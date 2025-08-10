import { webhookCallback } from 'grammy'
import { bot } from '.'

export const config = {
  runtime: 'edge',
}

export default webhookCallback(bot, 'https')
