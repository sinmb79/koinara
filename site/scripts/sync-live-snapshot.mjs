import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const sourcePath = resolve('..', 'docs', 'live', 'worldland-v2-snapshot.json')
const targetDir = resolve('public', 'live')
const targetPath = resolve(targetDir, 'worldland-v2-snapshot.json')

if (!existsSync(sourcePath)) {
  throw new Error(`Missing live snapshot source: ${sourcePath}`)
}

mkdirSync(targetDir, { recursive: true })
copyFileSync(sourcePath, targetPath)
