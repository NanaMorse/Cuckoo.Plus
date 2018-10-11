import Vue from 'vue'
import { patchApiUri } from './util'

const clientName = 'Cuckoo.Plus'
const scopes = 'read write follow'

namespace Apps {

  import HttpResponse = vuejs.HttpResponse;

  export interface registerApplicationFormData {
    // Name of your application
    client_name?: string
    // Where the user should be redirected after authorization
    // (for no redirect, use urn:ietf:wg:oauth:2.0:oob)
    redirect_uris?: string
    // This can be a space-separated list of the following items: "read", "write" and "follow"
    scopes?: string
    // URL to the homepage of your app
    website?: string
  }

  export interface registerApplicationReturnData extends HttpResponse {
    data: {
      client_id: string,
      client_secret: string,
      id: string,
      name: string,
      redirect_uri: string,
      website: string | null
    }
  }

}

async function registerApplication (): Promise<Apps.registerApplicationReturnData> {
  const formData: Apps.registerApplicationFormData = {
    client_name: clientName,
    redirect_uris: location.origin,
    scopes: scopes
  }

  const result = await Vue.http.post(patchApiUri('/api/v1/apps'), formData)

  if (result.ok && (result.status === 200)) {
    return result as any
  } else {
    // todo internet connect check
    throw new Error('some thing went wrong!')
  }
}

export {
  registerApplication
}
