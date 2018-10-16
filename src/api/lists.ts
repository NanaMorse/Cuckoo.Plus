import Vue from 'vue'
import { patchApiUri } from '@/util'

async function receiveLists () {
  return Vue.http.get(patchApiUri('/api/v1/instance'))
}

export {
  receiveLists
}
