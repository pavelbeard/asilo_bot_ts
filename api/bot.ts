import { Bot, InlineKeyboard, webhookCallback } from 'grammy'
import { ASILO_BOT, SERVERLESS } from '../config'
import { cacheHandler, type FullInformation } from '../utils/cache'
import { PROVINCE_MAP } from '../utils/mapper'
import { TEXT } from './constants'
import { createLevelOneKeyboard, createLevelTwoKeyboard } from './keyboards'

const bot = new Bot(ASILO_BOT)

bot.command(['start', 'help'], (ctx) => {
  ctx.reply(TEXT, {
    reply_markup: createLevelOneKeyboard(),
  })
})

// Level 1 callback query handler
bot.on('callback_query:data', async ({ callbackQuery, api }) => {
  const matched = callbackQuery.data?.match(/^action_(\w+|\w+\s\w+)$/)
  const messageChatId = callbackQuery.message?.chat?.id as number
  const messageId = callbackQuery.message?.message_id as number

  let kb: InlineKeyboard | null = null

  if (callbackQuery.data === 'back1') {
    await api.editMessageText(messageChatId, messageId, TEXT, {
      reply_markup: createLevelOneKeyboard(),
    })
    return
  }

  if ('provinces' == callbackQuery.data) {
    const rawData = (await cacheHandler()) as FullInformation
    const provinces = rawData.map((item) => item.province)
    const inlineKb = createLevelTwoKeyboard(provinces)
    inlineKb.push([InlineKeyboard.text('<- Назад', 'back1')])
    kb = InlineKeyboard.from(inlineKb)

    await api.editMessageText(messageChatId, messageId, 'Список провинций', {
      reply_markup: kb,
    })
    return
  }

  if ('back' === callbackQuery.data) {
    await api.editMessageText(messageChatId, messageId, TEXT, {
      reply_markup: createLevelOneKeyboard(),
    })
    return
  }

  if (matched) {
    const provinceName = matched[1]
    const provinceData = (await cacheHandler()) as FullInformation

    let markupItem: string | null = null

    provinceData.forEach(async (item) => {
      if (item.province === provinceName) {
        let markupMessage = `Провинция: <b>${provinceName}</b>\n`

        for (const [k, v] of Object.entries(item.options)) {
          const k_ = k.replace(/\s/g, '_').toLowerCase()
          const markupB = (k.charAt(0).toUpperCase() + k.slice(1)).replace(
            '_',
            ' '
          )
          if (k_ === 'internet') {
            const provinceKey = callbackQuery.data?.replace('action_', '')
            const province = PROVINCE_MAP.get(provinceKey)
            const provinceUrl = province
              ? `https://icp.administracionelectronica.gob.es${province}`
              : null

            markupItem = `<b>${markupB}</b>: <a href="${provinceUrl}">Открыть сайт extranjeria</a>\n`
          } else if (k_ === 'correo_electronico') {
            markupItem = `<b>${markupB}</b>: <a href="mailto:${v}">${v}</a>\n`
          } else {
            markupItem = `<b>${markupB}</b>: ${v}\n`
          }

          markupMessage += markupItem
        }

        await api.editMessageText(messageChatId, messageId, markupMessage, {
          parse_mode: 'HTML',
          reply_markup: InlineKeyboard.from([
            [InlineKeyboard.text('<- Назад', 'provinces')],
          ]),
        })
      }
    })
  }
})

bot.on('message', async ({ reply }) => {
  await reply(
    'Не понимаю ваше сообщение. Нажми /start или /help для получения помощи.',
    {
      reply_markup: createLevelOneKeyboard(),
    }
  )
})

let handler: unknown | null = null

if (!SERVERLESS) {
  bot.start()
  handler = () => new Response('bot is running locally', { status: 200 })
} else {
  handler = webhookCallback(bot, 'https')
}

export default handler
