export { RoutersInfo } from './routers'
export { I18nTags, I18nLocales } from './i18n'

const AttachmentTypes = {
  IMAGE: 'image',
  VIDEO: 'video',
  GIFV: 'gifv',
  UNKNOWN: 'unknown'
}

const TimeLineTypes = {
  PUBLIC: 'public',
  HOME: 'home',
  DIRECT: 'direct',
  TAG: 'tag',
  LIST: 'list'
}

const VisibilityTypes = {
  DIRECT: 'direct',
  PRIVATE: 'private',
  UNLISTED: 'unlisted',
  PUBLIC: 'public'
}

const UiWidthCheckConstants = {
  'DRAWER_DOCKING_BOUNDARY': 960,
  'POST_STATUS_DIALOG_TOGGLE_WIDTH': 530
}

const ThemeNames = {
  GOOGLE_PLUS: 'Google-Plus',
  DARK: 'dark'
}

export {
  AttachmentTypes,
  TimeLineTypes,
  VisibilityTypes,
  UiWidthCheckConstants,
  ThemeNames
}
