interface OAuthInfo {
  clientId: string
  clientSecret: string
  accessToken: string
  scope: string
}

declare namespace cuckoostore {

  interface state {
    OAuthInfo: OAuthInfo
    mastodonServerUri: string
  }

  namespace state {
    interface OAuthInfo {
      clientId: string
      clientSecret: string
      accessToken: string
    }
  }

}
