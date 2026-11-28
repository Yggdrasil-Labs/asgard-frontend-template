import { globSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { compileScript, compileTemplate, parse, registerTS } from '@vue/compiler-sfc'
import { cruise } from 'dependency-cruiser'
import extractTSConfig from 'dependency-cruiser/config-utl/extract-ts-config'
import ts from 'typescript'
import config from '../.dependency-cruiser.cjs'

// Keep this local adapter aligned with Components({ dirs: ['src/components'] })
// in vite.config.ts. External resolvers/auto-imports only add package edges.
registerTS(() => ts)
const slash = value => value.replaceAll('\\', '/')
const pascalCase = value => value.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(/^./, letter => letter.toUpperCase())
const generated = new RegExp(config.options.exclude.path)
const tsConfig = extractTSConfig(config.options.tsConfig.fileName)
const { output } = await cruise(['src'], {
  ...config.options,
  validate: true,
  outputType: 'json',
  ruleSet: { forbidden: config.forbidden },
}, {}, { tsConfig })
const graph = JSON.parse(output)
const violations = graph.summary.violations.map(violation => `${violation.rule.name}: ${violation.from} -> ${violation.to}`)
const modules = graph.modules.filter(module => module.source.startsWith('src/'))
const edges = modules.flatMap(module => module.dependencies
  .filter(dependency => dependency.resolved.startsWith('src/'))
  .map(dependency => ({ from: module.source, to: dependency.resolved, dependencyTypes: dependency.dependencyTypes })))
const nativeCount = edges.length
const extraEdges = []

function expandPattern(from, pattern) {
  let relative
  if (pattern.startsWith('/src/')) {
    relative = pattern.slice(1)
  }
  else if (pattern.startsWith('.')) {
    relative = path.posix.join(path.posix.dirname(from), pattern)
  }
  else {
    const aliases = Object.entries(tsConfig.options.paths ?? {})
      .filter(([alias, targets]) => alias.endsWith('/*') && targets.length === 1)
    const alias = aliases.find(([alias]) => pattern.startsWith(alias.slice(0, -1)))
    if (alias) {
      const [key, [target]] = alias
      relative = slash(path.relative(process.cwd(), path.resolve(
        tsConfig.options.baseUrl ?? tsConfig.options.pathsBasePath ?? '.',
        target.slice(0, -1) + pattern.slice(key.length - 1),
      )))
    }
  }
  if (!relative || !path.posix.normalize(relative).startsWith('src/'))
    throw new Error(`glob must resolve inside src: ${pattern}`)
  const files = globSync(relative).map(file => slash(path.relative(process.cwd(), path.resolve(file))))
  if (files.some(file => !file.startsWith('src/')))
    throw new Error(`glob matched outside src: ${pattern}`)
  return files.filter(file => statSync(file).isFile() && !generated.test(file))
}

function globPatterns(node) {
  const argument = node.arguments[0]
  const patterns = argument && ts.isArrayLiteralExpression(argument)
    ? argument.elements
    : [argument]
  if (!patterns.length || patterns.some(pattern => !pattern || !ts.isStringLiteralLike(pattern)))
    throw new Error('import.meta.glob requires literal strings or a literal string array')
  return patterns.map(pattern => pattern.text)
}

function checkGlobOptions(node, source) {
  const options = node.arguments[1]
  if (options && (!ts.isObjectLiteralExpression(options) || options.properties.some(property =>
    !ts.isPropertyAssignment(property) || !['eager', 'query', 'import'].includes(property.name.getText(source).replaceAll(/['"]/g, ''))))) {
    throw new Error('unsupported glob options (including base/exhaustive); extend this adapter before using them')
  }
}

function addGlob(from, node, source) {
  checkGlobOptions(node, source)
  const included = new Set()
  const excluded = new Set()
  for (const pattern of globPatterns(node)) {
    const negative = pattern.startsWith('!')
    for (const file of expandPattern(from, negative
      ? pattern.slice(1)
      : pattern))
      (negative ? excluded : included).add(file)
  }
  for (const to of included) {
    if (!excluded.has(to)) {
      extraEdges.push({
        from,
        to,
        kind: 'glob',
        dependencyTypes: ['local', 'import'],
      })
    }
  }
}

function isLocaleResource(from, argument, source) {
  return from === 'src/locales/i18n.ts' && ts.isTemplateExpression(argument)
    && argument.head.text === './' && argument.templateSpans.length === 1
    && argument.templateSpans[0].expression.getText(source) === 'locale'
    && argument.templateSpans[0].literal.text === '/common.json'
}

function scanCall(from, node, source) {
  const expression = node.expression
  if (ts.isPropertyAccessExpression(expression) && expression.name.text === 'glob'
    && ts.isMetaProperty(expression.expression) && expression.expression.keywordToken === ts.SyntaxKind.ImportKeyword) {
    addGlob(from, node, source)
    return
  }
  const argument = node.arguments[0]
  const requireCall = ts.isIdentifier(expression) && expression.text === 'require'
  if ((expression.kind !== ts.SyntaxKind.ImportKeyword && !requireCall) || !argument || ts.isStringLiteralLike(argument))
    return
  // This existing locale loader can only reach JSON resource leaves.
  if (requireCall || !isLocaleResource(from, argument, source))
    throw new Error(`unsupported dynamic module load: ${argument.getText(source)}`)
  for (const to of expandPattern(from, './*/common.json')) {
    extraEdges.push({
      from,
      to,
      kind: 'locale-resource',
      dependencyTypes: ['local', 'import'],
    })
  }
}

function scanScript(from, content) {
  const source = ts.createSourceFile(from, content, ts.ScriptTarget.Latest, true, /\.[jt]sx$/.test(from)
    ? ts.ScriptKind.TSX
    : ts.ScriptKind.TS)
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1
      try {
        scanCall(from, node, source)
      }
      catch (error) {
        violations.push(`unsupported-dependency: ${from}:${line}: ${error.message}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}

const components = new Map()
for (const { source } of modules) {
  if (!source.startsWith('src/components/') || !source.endsWith('.vue'))
    continue
  const base = path.posix.basename(source, '.vue')
  const name = pascalCase(base === 'index'
    ? path.posix.basename(path.posix.dirname(source))
    : base)
  if (components.has(name))
    violations.push(`ambiguous-auto-component: ${name}: ${components.get(name)}, ${source}`)
  components.set(name, source)
}

for (const { source } of modules) {
  if (!/\.(?:[cm]?[jt]sx?|vue)$/.test(source))
    continue
  const content = readFileSync(source, 'utf8')
  if (!source.endsWith('.vue')) {
    scanScript(source, content)
    continue
  }
  const { descriptor, errors } = parse(content, {
    filename: path.resolve(source),
  })
  if (errors.length)
    violations.push(`vue-parse-error: ${source}: ${errors.join(', ')}`)
  for (const block of [descriptor.script, descriptor.scriptSetup].filter(Boolean))
    scanScript(source, block.content)
  try {
    if ([descriptor.script, descriptor.scriptSetup, descriptor.template].some(block => block?.src))
      throw new Error('external Vue blocks need explicit adapter support')
    if (!descriptor.template)
      continue
    if (descriptor.template.lang && descriptor.template.lang !== 'html')
      throw new Error(`unsupported template language: ${descriptor.template.lang}`)
    const bindings = descriptor.script || descriptor.scriptSetup
      ? compileScript(descriptor, { id: source }).bindings
      : {}
    const compiled = compileTemplate({
      source: descriptor.template.content,
      filename: path.resolve(source),
      id: source,
      compilerOptions: { bindingMetadata: bindings },
    })
    if (compiled.errors.length)
      throw new Error(compiled.errors.join(', '))
    // Same static resolver calls consumed by unplugin-vue-components' Vue 3 transform.
    // Compiler bindings preserve explicit imports, local variables and template scopes.
    for (const match of compiled.code.matchAll(/_resolveComponent\d*\("(.+?)"\)/g)) {
      const to = components.get(pascalCase(match[1]))
      if (to && to !== source) {
        extraEdges.push({
          from: source,
          to,
          kind: 'auto-component',
          dependencyTypes: ['local', 'import'],
        })
      }
    }
  }
  catch (error) {
    violations.push(`unsupported-vue-dependency: ${source}: ${error.message}`)
  }
}

// Supplemental edges reuse only the path/type predicates of the local layer rules.
// Unresolved edges and native cycles remain dependency-cruiser's responsibility.
function matches(restriction, file, dependencyTypes = []) {
  return (!restriction.path || new RegExp(restriction.path).test(file))
    && (!restriction.pathNot || !new RegExp(restriction.pathNot).test(file))
    && (!restriction.dependencyTypesNot || !restriction.dependencyTypesNot.some(type => dependencyTypes.includes(type)))
}
for (const edge of extraEdges) {
  for (const rule of config.forbidden.filter(rule => rule.name.startsWith('layer-'))) {
    if (rule.name === 'layer-router-loader' && edge.from === 'src/router/app-routes.ts'
      && edge.kind === 'glob' && edge.to.startsWith('src/pages/')) {
      continue
    }
    if (matches(rule.from, edge.from) && matches(rule.to, edge.to, edge.dependencyTypes))
      violations.push(`${rule.name} (${edge.kind}): ${edge.from} -> ${edge.to}`)
  }
}

// File graph including type-only edges, glob expansion and auto-components.
// A directory-level cycle is not evidence of a file dependency cycle.
const adjacency = new Map()
for (const { from, to } of [
  ...edges,
  ...extraEdges,
]) {
  if (!adjacency.has(from))
    adjacency.set(from, new Set())
  adjacency.get(from).add(to)
}
const done = new Set()
const active = new Set()
const stack = []
function visit(file) {
  if (active.has(file)) {
    violations.push(`no-merged-file-cycles: ${[
      ...stack.slice(stack.indexOf(file)),
      file,
    ].join(' -> ')}`)
    return
  }
  if (done.has(file))
    return
  active.add(file)
  stack.push(file)
  for (const next of adjacency.get(file) ?? [])
    visit(next)
  stack.pop()
  active.delete(file)
  done.add(file)
}
for (const file of adjacency.keys())
  visit(file)

for (const violation of new Set(violations))
  console.error(violation)
console.warn(`Dependencies: ${nativeCount} native src edges (${edges.filter(edge => edge.dependencyTypes.includes('type-only')).length} type-only), ${extraEdges.filter(edge => edge.kind === 'glob').length} glob, ${extraEdges.filter(edge => edge.kind === 'auto-component').length} auto-component, ${extraEdges.filter(edge => edge.kind === 'locale-resource').length} locale resource; ${violations.length} violations.`)
process.exitCode = violations.length ? 1 : 0
