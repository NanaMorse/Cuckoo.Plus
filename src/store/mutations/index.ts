
const OAuthInfoMutations = {
  updateClientInfo (state: cuckoostore.state, { clientId, clientSecret }) {
    state.OAuthInfo.clientId = clientId
    state.OAuthInfo.clientSecret = clientSecret

    localStorage.setItem('clientId', clientId)
    localStorage.setItem('clientSecret', clientSecret)
  }
}

const mutations = {
  updateMastodonServerUri (state: cuckoostore.state, mastodonServerUri: string) {
    state.mastodonServerUri = mastodonServerUri
  },
  ...OAuthInfoMutations
}

export default mutations
