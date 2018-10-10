import Vue from 'vue'
import store from '@/store'
import HttpResponse = vuejs.HttpResponse;

interface fetchOAuthTokenReturnData extends HttpResponse {
  data: {
    access_token: string
  }
}

async function fetchOAuthToken (): Promise<fetchOAuthTokenReturnData> {
  const OAuthInfo = store.state.OAuthInfo

  const formData = {
    client_id: OAuthInfo.clientId,
    client_secret: OAuthInfo.clientSecret,
    redirect_uri: location.origin,
    grant_type: "authorization_code",
    code: OAuthInfo.code
  }

  return await Vue.http.post(`${store.state.mastodonServerUri}/oauth/token`, formData) as any
}

export {
  fetchOAuthToken
}