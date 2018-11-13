import statuses from './statuses'
import timelines from './timelines'
import notifications from './notifications'
import appstatus from './appstatus'

const actions = {
  ...timelines,
  ...statuses,
  ...notifications,
  ...appstatus
}

export default actions
