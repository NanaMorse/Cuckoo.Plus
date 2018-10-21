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
      [statusId: string]: mastodonentities.Context
    }

    statusMap: {
      [statusId: string]: mastodonentities.Status
    }

    appStatus: {
      documentWidth: number
      isDrawerOpened: boolean
      settings: {
        multiWaterFallLayout: boolean
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
