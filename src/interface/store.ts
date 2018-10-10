export namespace cuckoostore {

  export interface stateInfo {
    OAuthInfo: OAuthInfo
    mastodonServerUri: string
  }

  export interface OAuthInfo {
    clientId: string
    clientSecret: string
    accessToken: string
    code: string
  }

}

// declare namespace cuckoostore {
//   interface OAuthInfo {
//     clientId: string
//     clientSecret: string
//     accessToken: string
//     code: string
//   }
//
//   interface state {
//     OAuthInfo: OAuthInfo
//     mastodonServerUri: string
//   }
// }
