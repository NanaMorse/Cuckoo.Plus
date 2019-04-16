import googlePlusTheme from './googleplus'
import stylePattern from '../stylepattern'

const colorSet = Object.assign(googlePlusTheme.colorSet, {
  '@primaryColor': '#0f9d58',
  '@secondaryColor': '#0f9d58'
})

export default {
  source: stylePattern(colorSet),
  colorSet,
  toFavIconPath: 'green_light'
}