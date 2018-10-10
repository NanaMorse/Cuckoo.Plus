import Vue from 'vue'
import store from '@/store'

const clientName = 'Cuckoo.Plus'
const scopes = 'read write follow'

namespace OAuth {

}

async function fetchOAuthToken () {

  const OAuthInfo = store.state.OAuthInfo

  // todo need code

  const formData = {
    client_id: OAuthInfo.clientId,
    client_secret: OAuthInfo.clientSecret,
    redirect_uri: location.origin,
    grant_type: "authorization_code",

  }
}
