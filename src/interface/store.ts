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
      local: Array<string>
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

    relationships: {
      [id: string]: mastodonentities.Relationship
    }

    customEmojis: Array<mastodonentities.Emoji>

    appStatus: {
      documentWidth: number
      isDrawerOpened: boolean
      isNotificationsPanelOpened: boolean
      isPostStatusDialogOpened: boolean
      postStatusDialogExternalInfo: {
        reblog: mastodonentities.Status
      }
      unreadNotificationCount: number
      streamStatusesPool: {
        home: Array<string>
        public: Array<string>
        direct: Array<string>
        local: Array<string>
        tag: {
          [index: string]: Array<string>
        }
        list: {
          [index: string]: Array<string>
        }
      }
      settings: {
        multiLineMode: boolean
        maximumNumberOfColumnsInMultiLineMode: number
        showSensitiveContentMode: boolean
        postMediaAsSensitiveMode: boolean
        realTimeLoadStatusMode: boolean
        onlyMentionTargetUserMode: boolean
        emulateGPlusLikeReBlogMode: boolean
        theme: string,
        tags: Array<string>
        locale: string,
        postPrivacy: string
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
