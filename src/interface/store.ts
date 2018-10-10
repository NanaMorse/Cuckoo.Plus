declare namespace cuckoostore {
  interface OAuthInfo {
    clientId: string
    clientSecret: string
    accessToken: string
  }

  interface state {
    OAuthInfo: OAuthInfo
    mastodonServerUri: string
  }
}
