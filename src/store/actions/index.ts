import * as api from '@/api'
import statuses from './statuses'
import timelines from './timelines'

const actions = {
  ...timelines,
  ...statuses
}

export default actions
