import { readFile } from 'fs/promises'
import path from 'path'
import { describe, expect, it, vi } from 'vitest'
import { getAsylumOptions, getFullInformation } from './actions'

const getAsiloPhp = async function () {
  const filePath = path.join(
    __dirname,
    '..',
    '..',
    'tests',
    'fixtures',
    'asilo.php'
  )
  console.log(`Reading file from: ${filePath}`)

  return await readFile(filePath, 'utf8')
}

// Mock global fetch to return the contents of asilo.php
vi.stubGlobal(
  'fetch',
  vi.fn(async () => {
    const body = await getAsiloPhp()
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => body,
      json: async () => ({ body }),
      headers: new Headers(),
      // Optional no-op methods to satisfy Response-like usage
      clone() {
        return this
      },
    } as unknown as Response
  })
)

describe('getAsylumOptions', () => {
  it('should call getAsylumOptions', async () => {
    const result = await getAsylumOptions()

    console.log(`Result: ${result.$provinces}`)

    expect(result).toBeDefined()
  })
})

describe('getFullInformation', () => {
  it('should return full information from options', async () => {
    const result = await getAsylumOptions()
    const test = getFullInformation(result.$, result.$provinces)

    console.log(`Full Information: ${JSON.stringify(test, null, 2)}`)

    expect(test).toBeDefined()
  })
})
