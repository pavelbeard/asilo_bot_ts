import { LRUCache } from 'lru-cache'
import { getAsylumOptions, getFullInformation } from './actions'

const options = {
  max: 262144,
  ttl: 1000 * 60 * 5,
}

const cache = new LRUCache(options)

export type FullInformation = {
  province: string
  options: Record<string, string>
}[]

export async function cacheHandler(): Promise<FullInformation> {
  const cachedData = cache.get('cachedData') as
    | FullInformation
    | undefined
    | null
  if (!cachedData) {
    const asylumOptions = await getAsylumOptions()
    const fullInformation = getFullInformation(
      asylumOptions.$,
      asylumOptions.$provinces
    )

    cache.set('cachedData', fullInformation)
    return fullInformation
  }

  return cachedData
}
