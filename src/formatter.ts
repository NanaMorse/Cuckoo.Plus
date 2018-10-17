const DelOpenTag = "<del>"
const DelCloseTag = "</del>"

export function insertHtmlDelsToText(text: string): string {
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

export class StringReplacer {
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