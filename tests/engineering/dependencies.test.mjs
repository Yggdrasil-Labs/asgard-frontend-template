import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const project = fileURLToPath(new URL('../../', import.meta.url))
const script = join(project, 'scripts/check-dependencies.mjs')

function check(files) {
  const directory = mkdtempSync(join(tmpdir(), 'asgard-dependencies-'))
  try {
    symlinkSync(join(project, 'node_modules'), join(directory, 'node_modules'), 'dir')
    const fixture = {
      'package.json': '{"type":"module"}',
      'tsconfig.app.json': JSON.stringify({ compilerOptions: { paths: { '@/*': ['./src/*'] } }, include: ['src/**/*'] }),
      'src/env.d.ts': 'export {}',
      ...files,
    }
    for (const [file, content] of Object.entries(fixture)) {
      const target = resolve(directory, file)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, content)
    }
    const result = spawnSync(process.execPath, [script], { cwd: directory, encoding: 'utf8' })
    assert.ifError(result.error)
    return { status: result.status, output: result.stdout + result.stderr }
  }
  finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('native rules allow components and reject a reverse alias import', () => {
  const allowed = check({
    'src/pages/Home.vue': '<script setup lang="ts">import Card from "@/components/Card.vue"</script><template><Card /></template>',
    'src/components/Card.vue': '<template><div /></template>',
  })
  assert.equal(allowed.status, 0, allowed.output)
  const forbidden = check({
    'src/components/Card.vue': '<script setup lang="ts">import Home from "@/pages/Home.vue"</script><template><Home /></template>',
    'src/pages/Home.vue': '<template><div /></template>',
  })
  assert.equal(forbidden.status, 1, forbidden.output)
  assert.match(forbidden.output, /layer-components/)
})

test('a cycle through an import.meta.glob page edge fails after merging graphs', () => {
  const result = check({
    'src/router/app-routes.ts': 'export const pages = import.meta.glob("/src/pages/*.vue")',
    'src/pages/Home.vue': '<script setup lang="ts">import { pages } from "@/router/app-routes"</script><template><div /></template>',
  })
  assert.equal(result.status, 1, result.output)
  assert.match(result.output, /no-merged-file-cycles/)
})

test('production layers reject shell, UI, business and initialization back references', () => {
  for (const [from, to, rule] of [
    ['src/pages/example.ts', 'src/app/shell/Renderer.ts', 'layer-pages'],
    ['src/components/widget.ts', 'src/stores/state.ts', 'layer-components'],
    ['src/components/widget.ts', 'src/router/index.ts', 'layer-components'],
    ['src/api/customer.ts', 'src/components/widget.ts', 'layer-api'],
    ['src/app/shell/Renderer.ts', 'src/pages/example.ts', 'layer-shell'],
    ['src/stores/state.ts', 'src/app/shell/Renderer.ts', 'layer-stores'],
    ['src/router/types.ts', 'src/stores/state.ts', 'layer-router-protocol'],
    ['src/composables/useAppBreakpoint.ts', 'src/locales/i18n.ts', 'layer-composables'],
    ['src/config/env.ts', 'src/components/widget.ts', 'layer-base-config'],
    ['src/locales/types.ts', 'src/locales/i18n.ts', 'layer-locale-data'],
    ['src/types/runtime.ts', 'src/components/widget.ts', 'layer-types'],
    ['src/utils/helper.ts', 'src/api/customer.ts', 'layer-utils'],
    ['src/utils/helper.ts', 'src/App.vue', 'layer-no-startup-back-reference'],
  ]) {
    const result = check({
      [from]: `export { default } from "@/${to.slice(4)}"`,
      [to]: to.endsWith('.vue') ? '<template><div /></template>' : 'export default 1',
    })
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, new RegExp(rule))
  }
  const framework = check({ 'src/components/navigation.ts': 'export { useRoute } from "vue-router"' })
  assert.equal(framework.status, 0, framework.output)
})

test('native value and type-only file cycles both fail', () => {
  for (const files of [{
    'src/utils/a.ts': 'export { b } from "./b"; export const a = 1',
    'src/utils/b.ts': 'export { a } from "./a"; export const b = 1',
  }, {
    'src/types/a.ts': 'import type { B } from "./b"; export interface A { b: B }',
    'src/types/b.ts': 'import type { A } from "./a"; export interface B { a: A }',
  }]) {
    const result = check(files)
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, /no-file-cycles/)
    assert.match(result.output, /no-merged-file-cycles/)
  }
})

test('shell and store directories may refer to each other without a file cycle', () => {
  const result = check({
    'src/app/shell/Renderer.ts': 'export { state } from "@/stores/state"',
    'src/stores/state.ts': 'import { cache } from "@/app/shell/route-cache"; export const state = cache',
    'src/app/shell/route-cache.ts': 'export const cache = 1',
  })
  assert.equal(result.status, 0, result.output)
})

test('local automatic template components obey the same direction rules', () => {
  const result = check({
    'src/utils/Forbidden.vue': '<template><Card /></template>',
    'src/components/Card.vue': '<template><div /></template>',
  })
  assert.equal(result.status, 1, result.output)
  assert.match(result.output, /layer-utils \(auto-component\)/)
})

test('automatic component and native import edges can form a merged cycle', () => {
  const result = check({
    'src/components/Alpha.vue': '<template><Beta /></template>',
    'src/components/Beta.vue': '<script setup lang="ts">import Alpha from "./Alpha.vue"</script><template><Alpha /></template>',
  })
  assert.equal(result.status, 1, result.output)
  assert.match(result.output, /no-merged-file-cycles/)
})

test('template bindings and explicit imports avoid spurious automatic edges', () => {
  for (const script of ['const Card = "div"', 'import Card from "@/components/Card.vue"']) {
    const result = check({
      'src/pages/Home.vue': `<script setup lang="ts">${script}</script><template><Card /></template>`,
      'src/components/Card.vue': '<template><div /></template>',
    })
    assert.equal(result.status, 0, result.output)
    assert.match(result.output, /0 auto-component/)
  }
})

test('component names follow the configured index.vue and kebab-case conventions', () => {
  const result = check({
    'src/pages/Home.vue': '<template><status-badge /></template>',
    'src/components/status-badge/index.vue': '<template><div /></template>',
  })
  assert.equal(result.status, 0, result.output)
  assert.match(result.output, /1 auto-component/)
})

test('icon type exceptions stay exact and never allow runtime imports', () => {
  const target = { 'src/components/icon/icon.types.ts': 'export type Icon = string; export const runtime = 1' }
  const allowed = check({ ...target, 'src/router/types.ts': 'import type { Icon } from "@/components/icon/icon.types"; export type RouteIcon = Icon' })
  assert.equal(allowed.status, 0, allowed.output)
  for (const script of [
    'import { runtime } from "@/components/icon/icon.types"; export const icon = runtime',
    'import type { Icon } from "@/components/icon/icon.types"; import { runtime } from "@/components/icon/icon.types"; export const icon: Icon = String(runtime)',
  ]) {
    const result = check({ ...target, 'src/router/types.ts': script })
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, /layer-icon-type-only/)
  }
  const wrongCaller = check({ ...target, 'src/stores/other.ts': 'import type { Icon } from "@/components/icon/icon.types"; export type OtherIcon = Icon' })
  assert.equal(wrongCaller.status, 1, wrongCaller.output)
  assert.match(wrongCaller.output, /layer-icon-type-callers/)
})

test('shared route type exceptions reject runtime exports', () => {
  for (const [keyword, status] of [['type ', 0], ['', 1]]) {
    const result = check({
      'src/types/index.ts': `export ${keyword}* from "@/router/types"`,
      'src/router/types.ts': 'export type Route = string; export const runtime = 1',
    })
    assert.equal(result.status, status, result.output)
    if (status)
      assert.match(result.output, /layer-shared-route-type-only/)
  }
})

test('only app-routes glob edges can load pages, not explicit imports or other router files', () => {
  for (const [from, script] of [
    ['src/router/app-routes.ts', 'export { default } from "@/pages/Home.vue"'],
    ['src/router/app-routes.ts', 'export const loader = () => import("@/pages/Home.vue")'],
    ['src/router/app-routes.ts', 'export const loader = () => import(`@/pages/Home.vue`)'],
    ['src/router/other.ts', 'export const pages = import.meta.glob("/src/pages/*.vue")'],
  ]) {
    const result = check({ [from]: script, 'src/pages/Home.vue': '<template><div /></template>' })
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, /layer-router-/)
  }
})

test('glob string arrays, exclusions and tsconfig aliases expand to the intended pages', () => {
  const result = check({
    'src/router/app-routes.ts': 'export const pages = import.meta.glob(["@/pages/**/*.vue", "!/src/pages/Skip.vue"])',
    'src/pages/nested/Home.vue': '<template><div /></template>',
    'src/pages/Skip.vue': '<template><div /></template>',
  })
  assert.equal(result.status, 0, result.output)
  assert.match(result.output, /1 glob/)
})

test('glob edges from ordinary files are checked for direction too', () => {
  const result = check({
    'src/components/Card.vue': '<script setup lang="ts">const pages = import.meta.glob("../pages/*.vue")</script><template><div /></template>',
    'src/pages/Home.vue': '<template><div /></template>',
  })
  assert.equal(result.status, 1, result.output)
  assert.match(result.output, /layer-components \(glob\)/)
})

test('unknown imports and nonliteral or unsupported globs fail explicitly', () => {
  for (const script of [
    'const target = "./x.ts"; export const load = () => import(target)',
    'const target = "./x.ts"; export const load = () => require(target)',
    `const target = "x"; export const load = () => import(\`./\${target}.ts\`)`,
    'const paths = ["./*.vue"]; export const pages = import.meta.glob(paths)',
    'export const pages = import.meta.glob("./*.vue", { base: "./nested" })',
  ]) {
    const result = check({ 'src/pages/loader.ts': script })
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, /unsupported-dependency/)
  }
})

test('the known locale template import expands only JSON resource leaves', () => {
  const result = check({
    'src/locales/i18n.ts': `export const load = (locale: string) => import(\`./\${locale}/common.json\`)`,
    'src/locales/en-US/common.json': '{}',
    'src/locales/zh-CN/common.json': '{}',
  })
  assert.equal(result.status, 0, result.output)
  assert.match(result.output, /2 locale resource/)
})

test('SVG URL glob resources are leaves and empty icon folders are valid', () => {
  for (const assets of [{}, { 'src/assets/icons/menu/home.svg': '<svg />' }]) {
    const result = check({
      ...assets,
      'src/components/icon/SvgIcon.vue': '<script setup lang="ts">const icons = import.meta.glob("@/assets/icons/**/*.svg", { eager: true, query: "?url", import: "default" })</script><template><img></template>',
    })
    assert.equal(result.status, 0, result.output)
  }
})

test('only the exact icon virtual module namespace bypasses unresolved failures', () => {
  const allowed = check({ 'src/components/icon.ts': 'export { default } from "~icons/ep/back"' })
  assert.equal(allowed.status, 0, allowed.output)
  for (const target of ['@/missing', '~icon/ep/back', '~icons/missing']) {
    const result = check({ 'src/components/icon.ts': `export { default } from "${target}"` })
    assert.equal(result.status, 1, result.output)
    assert.match(result.output, /no-unresolved/)
  }
})
