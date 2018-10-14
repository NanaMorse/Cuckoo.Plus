import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: '布谷鸟 Plus',
  [I18nTags.oauth.login_hint]: '授权登录',
  [I18nTags.oauth.server_input_label]: 'Mastodon 链接',
  [I18nTags.oauth.please_input_server_url]: '请输入 Mastodon 链接',
  [I18nTags.oauth.please_input_correct_server_url]: '请输入正确的 Mastodon 链接',
  [I18nTags.oauth.register_app_error_message]: '出错啦！检查一下目标链接是否正确吧'
}

const common = {
  [I18nTags.common.status_visibility_public]: '公开',
  [I18nTags.common.status_visibility_private]: '私密分享',
  [I18nTags.common.status_visibility_unlisted]: '未列出',
  [I18nTags.common.status_visibility_direct]: '指定对象'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: '你最近有什么新鲜事要分享吗？',
  [I18nTags.statusCard.reply_to_main_status]: '发表评论…',
  [I18nTags.statusCard.reply_to_replier]: '回复',
  [I18nTags.statusCard.cancel_post]: '取消',
  [I18nTags.statusCard.submit_post]: '发布'
}

export default {
  ...oauth,
  ...common,
  ...statusCard
}
