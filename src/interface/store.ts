import { mastodonentities } from './entities'

export namespace cuckoostore {

  export interface stateInfo {
    OAuthInfo: OAuthInfo
    mastodonServerUri: string
    currentUserAccount: mastodonentities.Account

    timelines: {
      home: Array<string>
      public: Array<string>
      direct: Array<string>
      tag: {
        [index: string]: Array<string>
      }
      list: {
        [index: string]: Array<string>
      }
    }

    contextMap: {
      [statusId: string]: {
        ancestors: Array<string>
        descendants: Array<string>
      }
    }

    statusMap: {
      [statusId: string]: mastodonentities.Status
    }

    notifications: Array<mastodonentities.Notification>

    appStatus: {
      documentWidth: number
      isDrawerOpened: boolean
      isNotificationsPanelOpened: boolean
      unreadNotificationCount: number
      settings: {
        multiLineMode: boolean,
        showSensitiveContentMode: boolean,
        theme: string,
        tags: Array<string>
      }
    }
  }

  export interface OAuthInfo {
    clientId: string
    clientSecret: string
    accessToken: string
    code: string
  }

}
