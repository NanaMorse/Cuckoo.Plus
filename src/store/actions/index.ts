import statuses from './statuses'
import timelines from './timelines'
import notifications from './notifications'

const actions = {
  ...timelines,
  ...statuses,
  ...notifications
}

export default actions
