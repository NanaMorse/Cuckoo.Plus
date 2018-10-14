import * as api from '@/api'
import { TimeLineTypes } from '@/constant'

interface postStatusFormData {
  // The text of the status
  status: string
  // local ID of the status you want to reply to
  inReplyToId?: string
  // Array of media IDs to attach to the status (maximum 4)
  mediaIds?: Array<string>
  // Set this to mark the media of the status as NSFW
  sensitive?: boolean
  // Text to be shown as a warning before the actual content
  spoilerText?: string
  // Either "direct", "private", "unlisted" or "public"
  visibility?: string
  // ISO 639-2 language code of the toot, to skip automatic detection
  language?: string
}

const statuses = {
  async updateFavouriteStatusById ({ commit }, { favourited, mainStatusId, targetStatusId }: {
    favourited: boolean
    mainStatusId: string
    targetStatusId: string
  }) {
    try {

      if (favourited) {
        api.statuses.favouriteStatusById(targetStatusId)
      } else {
        api.statuses.unFavouriteStatusById(targetStatusId)
      }

      commit('updateFavouriteStatusById', { favourited, mainStatusId, targetStatusId })
    } catch (e) {
      throw new Error(e)
    }
  },

  async updateContextData ({ commit }, statusId: string) {
    if (!statusId) throw new Error('unknown status id!')

    try {
      const result = await api.statuses.getStatusContextById(statusId)
      commit('updateContextData', { statusId, context: result.data })
    } catch (e) {

    }
  },

  async postStatus ({ commit, dispatch }, { formData, mainStatusId }: {
    formData: postStatusFormData
    mainStatusId: string
  }) {
    try {
      const result = await api.statuses.postStatus(formData)

      // meaning this is a new root post
      if (!formData.inReplyToId) {
        // todo 默认只有home信息流，真的好吗？
        commit('unShiftTimeLineStatuses', {
          newStatuses: [result.data],
          timeLineType: TimeLineTypes.HOME
        })
      } else {
        // update the reply status's context
        dispatch('updateContextData', mainStatusId)
      }

    } catch (e) {
      throw new Error(e)
    }
  }
}

export default statuses