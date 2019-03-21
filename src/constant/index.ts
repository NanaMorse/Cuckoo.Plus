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
  LIST: 'list',
  LOCAL: 'local'
}

const VisibilityTypes = {
  DIRECT: 'direct',
  PRIVATE: 'private',
  UNLISTED: 'unlisted',
  PUBLIC: 'public'
}

const UiWidthCheckConstants = {
  DRAWER_DOCKING_BOUNDARY: 960,
  POST_STATUS_DIALOG_TOGGLE_WIDTH: 530,
  NOTIFICATION_DIALOG_TOGGLE_WIDTH: 530,
  DRAWER_DESKTOP_WIDTH: 290,
  DRAWER_MOBILE_WIDTH: 300,

  STATUS_CARD_MAX_WIDTH: 530,
  STATUS_CARD_MIN_WIDTH: 360,
  TIMELINE_WATER_FALL_GUTTER: 24
}

const ThemeNames = {
  GOOGLE_PLUS: 'Google-Plus',
  DARK: 'dark',
  GREEN_LIGHT: 'green_light'
}

const NotificationTypes = {
  MENTION: 'mention',
  REBLOG: 'reblog',
  FAVOURITE: 'favourite',
  FOLLOW: 'follow'
}

const StreamingEventTypes = {
  UPDATE: 'update',
  NOTIFICATION: 'notification',
  DELETE: 'delete',
  FILTERS_CHANGED: 'filters_changed'
}

export {
  AttachmentTypes,
  TimeLineTypes,
  VisibilityTypes,
  UiWidthCheckConstants,
  ThemeNames,
  NotificationTypes,
  StreamingEventTypes
}
