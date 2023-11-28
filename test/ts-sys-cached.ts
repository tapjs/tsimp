import { readFileSync, realpathSync } from 'fs'
import { resolve, win32 } from 'path'
import t from 'tap'
import { fileURLToPath } from 'url'

import * as sys from '../src/ts-sys-cached.js'

t.equal(sys.normalizeSlashes('a\\b/c'), 'a/b/c')
t.equal(sys.normalizeSlashes('a/b/c'), 'a/b/c')

t.equal(sys.readFile('/this/file/does/not/exist'), undefined)
const rm = fileURLToPath(new URL('../README.md', import.meta.url))
t.equal(sys.readFile(rm), readFileSync(rm, 'utf8'))

t.equal(sys.directoryExists('.'), true)
t.equal(sys.directoryExists(rm), false)
t.equal(sys.directoryExists('/this/file/does/not/exist'), false)

t.equal(sys.fileExists('.'), false)
t.equal(sys.fileExists(rm), true)
t.equal(sys.fileExists('/this/file/does/not/exist'), false)

t.equal(sys.realpath(rm), realpathSync(rm))

t.equal(sys.getCurrentDirectory(), process.cwd())

t.equal(sys.normalizePath(import.meta.url), import.meta.url)
t.equal(
  sys.normalizePath(fileURLToPath(import.meta.url) + '/../x/y/'),
  resolve(fileURLToPath(import.meta.url), '../x/y').replace(
    /\\/g,
    '/'
  ) + '/'
)
t.equal(sys.normalizePath('x/y/z/../a/'), 'x/y/a/')
const sysWin = await t.mockImport('../src/ts-sys-cached.js', {
  path: win32,
})
t.equal(sysWin.normalizePath('c:/x/y\\z\\'), 'C:/x/y/z/')

t.test('getFileSystemEntries', t => {
  const dir = t.testdir({
    file: 'x',
    dir: {},
    symfile: t.fixture('symlink', 'file'),
    symdir: t.fixture('symlink', 'dir'),
  })
  t.strictSame(sys.getDirectories(dir), ['dir', 'symdir'])
  t.strictSame(sys.getFiles(dir), ['file', 'symfile'])
  t.equal(sys.getDirectories('').includes('src'), true)
  t.equal(sys.getFiles('').includes('README.md'), true)
  t.end()
})
