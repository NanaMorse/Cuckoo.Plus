import darkTheme from './dark'
import stylePattern from '../stylepattern'

const colorSet = Object.assign(darkTheme.colorSet, {
  '@primaryColor': '#FF9900',
  '@secondaryColor': '#FF9900',

  '@textColor': '#fff',
  '@secondaryTextColor': '#666',

  '@backgroundColor': '#000',
  '@dialogBackgroundColor': '#1b1b1b'
})

export default {
  source: stylePattern(colorSet),
  colorSet,
  toFavIconPath: 'cuckoo_hub'
}