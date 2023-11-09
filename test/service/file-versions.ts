import { resolve } from 'path'
import t from 'tap'

let mockConfig: { fileNames: string[] } = {
  fileNames: [],
}

const {
  addRootFile,
  updateFileVersion,
  fileVersions,
  incProjectVersion,
  projectVersion,
  rootFileNames,
} = (await t.mockImport('../../src/service/file-versions.js', {
  '../../src/service/tsconfig.js': {
    tsconfig: () => mockConfig,
  },
})) as typeof import('../../src/service/file-versions.js')

t.strictSame(rootFileNames(), new Set())
t.equal(projectVersion(), '0')
t.equal(incProjectVersion(), '1')
t.equal(projectVersion(), '1')
t.equal(incProjectVersion(), '2')
t.equal(projectVersion(), '2')
const f = resolve(t.testdirName, 'file.ts')
addRootFile(f)
t.equal(projectVersion(), '3')
updateFileVersion(f, 'console.log("hello")')
t.equal(projectVersion(), '4')
t.equal(fileVersions.get(f), 1)

const rfn = rootFileNames()
mockConfig = { fileNames: [resolve(t.testdirName, 'foo.ts')] }
const rfn2 = rootFileNames()
t.not(rfn2, rfn, 'changes when config changes')
