import { InlineKeyboard } from 'grammy'
import type { InlineKeyboardButton } from 'grammy/types'

export function createLevelOneKeyboard() {
  return new InlineKeyboard().text('Список провинций', 'provinces')
}

export function createLevelTwoKeyboard(provinces: string[]) {
  const chunkSize = 3
  const inlineKb: InlineKeyboardButton[][] = []

  const sorted = [...provinces].sort((a, b) => a.localeCompare(b))

  for (let i = 0; i < sorted.length; i += chunkSize) {
    const tmp: InlineKeyboardButton[] = []
    sorted.slice(i, i + chunkSize).forEach((province) => {
      tmp.push(InlineKeyboard.text(province, `action_${province}`))
    })

    inlineKb.push(tmp)
  }

  return inlineKb
}
