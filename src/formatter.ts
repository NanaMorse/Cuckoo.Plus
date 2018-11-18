import { mastodonentities } from "@/interface"

const DelOpenTag = "<del>"
const DelCloseTag = "</del>"

class StringReplacer {
  buffer: string
  offset: number

  constructor(originalString: string) {
    this.buffer = originalString.slice()
    this.offset = 0
  }

  replaceAtIndex(index: number, needle: string) {
    this.buffer = this.buffer.slice(0, index + this.offset) + needle + this.buffer.slice(index + this.offset + 1, this.buffer.length)
    this.offset += (needle.length - 1)
  }

  finalize() {
    return this.buffer;
  }
}

class Formatter {

  static StringReplacer = StringReplacer

  private delOpenTag = '<del>'

  private delCloseTag = '</del>'

  private customEmojiRegex = /:\w+:/g

  private customEmojiMap: {
    [index: string]: mastodonentities.Emoji
  } = {}

  constructor (customEmojis: Array<mastodonentities.Emoji> = []) {
    customEmojis.forEach(emoji => {
      this.customEmojiMap[emoji.shortcode] = emoji
    })
  }

  public insertDels (text: string): string {
    const length = text.length
    let firstOpenTagIndex = -1
    let lastCloseTagIndex = -1
    const stringReplacer = new StringReplacer(text)

    function insert() {
      stringReplacer.replaceAtIndex(firstOpenTagIndex, DelOpenTag)
      stringReplacer.replaceAtIndex(lastCloseTagIndex, DelCloseTag)
    }

    for (let index = 0; index < length; ++index) {
      if (text[index] === "-") {
        if ((index === length - 1 || text[index + 1] === " ")) {
          lastCloseTagIndex = index
        } else if (index === 0 || text[index - 1] === " ") {
          if (firstOpenTagIndex === -1 && lastCloseTagIndex === -1) {
            firstOpenTagIndex = index
          } else if (firstOpenTagIndex !== -1 && lastCloseTagIndex !== -1) {
            insert()
            firstOpenTagIndex = index
            lastCloseTagIndex = -1
          } else if (firstOpenTagIndex === -1) {
            firstOpenTagIndex = index
            lastCloseTagIndex = -1
          }
        }
      }
    }
    if (firstOpenTagIndex !== -1 && lastCloseTagIndex !== -1) {
      insert()
    }

    return stringReplacer.finalize()
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
