import { mastodonentities } from "@/interface"

class Formatter {

  private customEmojiRegex = /:\w+:/g

  // todo fix test
  private delRegex = /(^|\s)-.*-($|\s|\.|,|\?|!|~)/g

  private customEmojiMap: {
    [index: string]: mastodonentities.Emoji
  } = {}

  constructor (customEmojis: Array<mastodonentities.Emoji> = []) {
    customEmojis.forEach(emoji => {
      this.customEmojiMap[emoji.shortcode] = emoji
    })
  }

  public insertDels (text: string): string {
    return text.replace(this.delRegex, (matchString: string, p1, p2, index) => {
      const trimString = matchString.trim()

      const isFinalCharacterDel = trimString[trimString.length - 1] === '-'
      const isMatchStringFinalPixel = (index + matchString.length) === text.length && isFinalCharacterDel
      const centralSubString = trimString.substring(1, trimString.length - ( isFinalCharacterDel ? 1 : 2 ))

      return `${matchString[0] === ' ' ? ' ' : ''}<del>${centralSubString}</del>${isMatchStringFinalPixel ? '' : matchString[matchString.length - 1]}`
    })
  }

  private insertCustomEmojis (text: string): string {
    return text.replace(this.customEmojiRegex, (matchString: string) => {
      const emojiShortCode = matchString.trim().slice(1, -1)

      const targetEmoji = this.customEmojiMap[emojiShortCode]

      if (!targetEmoji) return matchString

      return `<img class="custom-emoji" src="${targetEmoji.static_url}"/>`
    })
  }

  public updateCustomEmojiMap (customEmojis: Array<mastodonentities.Emoji> = []) {
    customEmojis.forEach(emoji => {
      this.customEmojiMap[emoji.shortcode] = emoji
    })
  }

  public format (text: string, customEmojis: Array<mastodonentities.Emoji> = []): string {
    return [this.insertDels, this.insertCustomEmojis].reduce((preValue, process) => {
      return process.bind(this)(preValue)
    }, text)
  }
}

export default Formatter
