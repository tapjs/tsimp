/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/service/diagnostic.ts > TAP > pretty 1`] = `
[96m.tap/fixtures/test-service-diagnostic.ts/bad-foo.ts[0m:[93m2[0m:[93m25[0m - [91merror[0m[90m TS2322: [0mType 'boolean' is not assignable to type 'string'.

[7m2[0m export const f: Foo = { bar: true, baz: 'xyz' }
[7m [0m [91m                        ~~~[0m

  [96m.tap/fixtures/test-service-diagnostic.ts/bad-foo.ts[0m:[93m1[0m:[93m21[0m
    [7m1[0m export type Foo = { bar: string }
    [7m [0m [96m                    ~~~[0m
    The expected type comes from property 'bar' which is declared here on type 'Foo'

`

exports[`test/service/diagnostic.ts > TAP > ugly 1`] = `
.tap/fixtures/test-service-diagnostic.ts/bad-foo.ts(2,25): error TS2322: Type 'boolean' is not assignable to type 'string'.

`
