import t from 'tap'
t.test('case sensitive', async t => {
  const { getCanonicalFileName: gcfn } = (await t.mockImport(
    '../../dist/esm/service/get-canonical-filename.js',
    {
      typescript: {
        sys: {
          useCaseSensitiveFileNames: true,
        },
      },
    }
  )) as typeof import('../../dist/esm/service/get-canonical-filename.js')
  t.equal(gcfn('/hElLo/wOrLd'), '/hElLo/wOrLd')
})

t.test('not case sensitive', async t => {
  const { getCanonicalFileName: gcfn } = (await t.mockImport(
    '../../dist/esm/service/get-canonical-filename.js',
    {
      typescript: {
        sys: {
          useCaseSensitiveFileNames: false,
        },
      },
    }
  )) as typeof import('../../dist/esm/service/get-canonical-filename.js')

  t.equal(gcfn('/hElLo/wOrLd'), '/hello/world')
})
