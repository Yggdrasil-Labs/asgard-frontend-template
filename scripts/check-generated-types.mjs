import { spawnSync } from 'node:child_process'
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const targets = ['src/types/auto-imports.d.ts', 'src/types/components.d.ts']
const temporary = await mkdtemp(path.join(os.tmpdir(), 'asgard-types-'))
const write = process.argv.includes('--write')
try {
  for (const name of ['src', 'vite.config.ts', 'package.json', 'index.html', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json']) {
    await cp(path.join(root, name), path.join(temporary, name), { recursive: true })
  }
  for (const name of targets) await rm(path.join(temporary, name), { force: true })
  await symlink(path.join(root, 'node_modules'), path.join(temporary, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
  const result = spawnSync(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build'], {
    cwd: temporary,
    env: { ...process.env, GENERATE_TYPES: 'true' },
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
  if (result.error)
    throw result.error
  if (result.status !== 0)
    throw new Error(`Type generation failed (${result.status}):\n${result.stdout}\n${result.stderr}`)
  let drift = false
  for (const name of targets) {
    const generated = await readFile(path.join(temporary, name), 'utf8')
    if (write) {
      await writeFile(path.join(root, name), generated)
      console.warn(`Generated ${name}`)
    }
    else {
      const current = await readFile(path.join(root, name), 'utf8').catch((error) => {
        if (error.code === 'ENOENT')
          return ''
        throw error
      })
      if (current !== generated) {
        console.error(`Generated declaration differs: ${name}. Run pnpm types:generate.`)
        drift = true
      }
    }
  }
  if (drift)
    process.exitCode = 1
  else if (!write)
    console.warn('Generated declarations match production sources.')
}
finally {
  await rm(temporary, { recursive: true, force: true })
}
