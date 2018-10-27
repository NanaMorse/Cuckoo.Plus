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
  [I18nTags.common.status_visibility_unlisted]: '不公开',
  [I18nTags.common.status_visibility_private]: '仅关注者',
  [I18nTags.common.status_visibility_direct]: '私信',
  [I18nTags.common.status_visibility_public_desc]: '所有人可见，并会出现在公共时间轴上',
  [I18nTags.common.status_visibility_unlisted_desc]: '所有人可见，但不会出现在公共时间轴上',
  [I18nTags.common.status_visibility_private_desc]: '只有关注你的用户能看到',
  [I18nTags.common.status_visibility_direct_desc]: '只有被提及的用户能看到',
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
