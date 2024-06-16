import { walkUp } from 'walk-up-path'
import { normalizePath, fileExists, readFile } from '../ts-sys-cached.js'

function getPackageJSONPath(dir: string): string | undefined {
  for (const d of walkUp(dir)) {
    let pjPath = normalizePath(d + "/package.json");
    if (fileExists(pjPath))
      return pjPath;
  }
}

export default function getPackageJSON(dir: string): {contents: object, pathToJSON: string} | undefined {
  const pathToJSON = getPackageJSONPath(dir);
  if (pathToJSON) {
    const json = readFile(pathToJSON) as string;
    return {
      contents: JSON.parse(json) as object, 
      pathToJSON,
    };
  }
}