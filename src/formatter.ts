import { mastodonentities } from "@/interface"

class Formatter {

  private customEmojiRegex = /:\w+:/g

  // todo fix test
  private delRegex = /(^|\s)-.*-($|\s|\.|,|\?|!|~)/g

  private boldRegex = /(^|\s)\*.*\*($|\s|\.|,|\?|!|~)/g

  private italicRegex = /(^|\s)_.*_($|\s|\.|,|\?|!|~)/g

  private customEmojiMap: {
    [index: string]: mastodonentities.Emoji
  } = {}

  constructor (customEmojis: Array<mastodonentities.Emoji> = []) {
    customEmojis.forEach(emoji => {
      this.customEmojiMap[emoji.shortcode] = emoji
    })
  }

  private insertSomething (regex: RegExp, fragment: string, tag: string) {
    return (text: string) => {
      return text.replace(regex, (matchString: string, p1, p2, index) => {
        const trimString = matchString.trim()

        const isFinalCharacterDel = trimString[trimString.length - 1] === `${fragment}`
        const isMatchStringFinalPixel = (index + matchString.length) === text.length && isFinalCharacterDel
        const centralSubString = trimString.substring(1, trimString.length - ( isFinalCharacterDel ? 1 : 2 ))

        return `${matchString[0] === ' ' ? ' ' : ''}<${tag}>${centralSubString}</${tag}>${isMatchStringFinalPixel ? '' : matchString[matchString.length - 1]}`
      })
    }
  }

  public insertDels (text: string): string {
    return this.insertSomething(this.delRegex, '-', 'del')(text)
  }

  public insertBolds (text: string): string {
    return this.insertSomething(this.boldRegex, '*', 'strong')(text)
  }

  public insetItalic (text) {
    return this.insertSomething(this.italicRegex, '_', 'i')(text)
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
    return [this.insertDels, this.insertBolds, this.insetItalic, this.insertCustomEmojis].reduce((preValue, process) => {
      return process.bind(this)(preValue)
    }, text)
  }
}

export default Formatter
