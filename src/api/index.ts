import Vue from 'vue'
import HttpResponse = vuejs.HttpResponse;

const clientName = 'Cuckoo.Plus'
const scopes = 'read write follow'

interface postClientInfoReturnValue extends HttpResponse {
  data: {
    client_id: string,
    client_secret: string,
    id: string,
    name: string,
    redirect_uri: string,
    website: string | null
  }
}

async function postClientInfo (mastodonUrl: string): Promise<postClientInfoReturnValue> {
  return await Vue.http.post(`${mastodonUrl}/api/v1/apps`, {
    client_name: clientName,
    redirect_uris: "http://127.0.0.1:3000/",
    scopes: scopes,
    website: ""
  }) as any
}

export {
  postClientInfo
}