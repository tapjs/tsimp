import ts from 'typescript'
const fileNameLowerCaseRegExp =
  /[^\u0130\u0131\u00DFa-z0-9\\/:\-_. ]+/g
export const getCanonicalFileName = ts.sys.useCaseSensitiveFileNames
  ? (x: string) =>
      x.replace(fileNameLowerCaseRegExp, s => s.toLowerCase())
  : (x: string) => x
