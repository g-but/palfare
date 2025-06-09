import fs from 'fs'
import path from 'path'

describe('tsconfig path aliases', () => {
  test('baseUrl and paths are configured', () => {
    const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json')
    const raw = fs.readFileSync(tsconfigPath, 'utf-8')
    const json = JSON.parse(raw)
    expect(json.compilerOptions.baseUrl).toBe('.')
    expect(json.compilerOptions.paths['@/*'][0]).toBe('./src/*')
  })
})
