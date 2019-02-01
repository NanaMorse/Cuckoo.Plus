import * as Api from '@/api'
import { mastodonentities } from "@/interface"

const relationships = {
  async updateRelationships ({ commit, state }, { idList }: { idList: Array<string> }) {
    try {
      const result = await Api.accounts.fetchRelationships(idList || [])
      const relationshipList: Array<mastodonentities.Relationship> = result.data

      const relationshipMap = {}
      relationshipList.forEach(relationship => {
        relationshipMap[relationship.id] = relationship
      })

      commit('updateRelationships', relationshipMap)
    } catch (e) {

    }
  }
}

export default relationships
