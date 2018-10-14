import { mastodonentities } from '@/interface'

const accounts = {
  getAccountDisplayName () {
    return (account: mastodonentities.Account) => account.display_name || account.username || account.acct
  }
}

const getters = {
  ...accounts
}

export default getters