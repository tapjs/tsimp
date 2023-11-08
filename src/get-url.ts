// polyfilled in commonjs build
export const getUrl = (f: string) =>
  //@ts-ignore
  String(new URL(`./${f}`, import.meta.url))
