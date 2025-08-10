import * as cheerio from 'cheerio'
import { type Element } from 'domhandler'

export async function getAsylumOptions() {
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.',
  }

  const url = 'https://www.policia.es/_es/extranjeria_asilo_y_refugio.php'

  const response = await fetch(url, { headers })

  if (!response.ok) {
    throw new Error(`Failed to fetch asylum options: ${response.statusText}`)
  }

  const text = await response.text()

  const $ = cheerio.load(text)

  const $provinces = $('div.col-12').eq(-2).find('ul')
  return { $, $provinces }
}

function checkATags($: cheerio.CheerioAPI, tag: cheerio.Cheerio<Element>) {
  let value = ''
  const aTags = tag.find('td').eq(1).find('a')

  if (aTags.length > 0) {
    aTags.each((_, aTag) => {
      value += $(aTag).text().trim() + ' '
    })
  } else {
    value = tag.find('td').eq(1).text().trim()
  }

  return value.trim()
}

export function getFullInformation(
  $: cheerio.CheerioAPI,
  options: cheerio.Cheerio<Element>
) {
  const provinceList: Array<{
    province: string
    options: Record<string, string>
  }> = []

  options.find('tbody').each((_, tbody) => {
    $(tbody)
      .find('tr')
      .each((_, tr) => {
        const options: Record<string, string> = {}
        let province = ''

        try {
          if ($(tr).find('td').length > 0) {
            const key = $(tr).find('td').eq(0).text().trim()
            const value = checkATags($, $(tr))
            options[key] = value
            province = $(tr).find('th').text().trim()
          }
        } catch {
          const key = $(tr).find('td').eq(0).text().trim()
          options[key] = checkATags($, $(tr))
        }

        provinceList.push({
          province,
          options,
        })
      })
  })

  const newData: Array<{ province: string; options: Record<string, string> }> =
    []

  provinceList.forEach((item) => {
    if ('province' in item && item.province === '') {
      const prevItem = newData[newData.length - 1]
      prevItem.options = { ...prevItem.options, ...item.options }
    } else {
      newData.push(item)
    }
  })

  return newData
}
