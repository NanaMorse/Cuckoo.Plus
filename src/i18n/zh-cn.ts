import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: '布谷鸟 Plus',
  [I18nTags.oauth.login_hint]: '授权登录',
  [I18nTags.oauth.server_input_label]: 'Mastodon 链接',
  [I18nTags.oauth.please_input_server_url]: '请输入 Mastodon 链接',
  [I18nTags.oauth.please_input_correct_server_url]: '请输入正确的 Mastodon 链接',
  [I18nTags.oauth.register_app_error_message]: '出错啦！检查一下目标链接是否正确吧',
  [I18nTags.oauth.confirm_input]: '确认'
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
  [I18nTags.common.drag_and_drop_to_upload]: '将文件拖放至此处开始上传'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: '你最近有什么新鲜事要分享吗？',
  [I18nTags.statusCard.reply_to_main_status]: '发表评论…',
  [I18nTags.statusCard.reply_to_replier]: '回复',
  [I18nTags.statusCard.cancel_post]: '取消',
  [I18nTags.statusCard.submit_post]: '发布',
  [I18nTags.statusCard.show_content]: '显示内容',
  [I18nTags.statusCard.hide_content]: '隐藏内容',
  [I18nTags.statusCard.mute_status]: '忽略',
  [I18nTags.statusCard.delete_status]: '删除',
  [I18nTags.statusCard.delete_status_confirm]: '要删除这条嘟文吗?',
  [I18nTags.statusCard.do_delete_status_btn]: '删除',
  [I18nTags.statusCard.cancel_delete_status_btn]: '取消',
  [I18nTags.statusCard.originally_shared_by]: '此信息最初是由{displayName}<span class="at-name">@{atName}</span>分享的',
  [I18nTags.statusCard.sensitive_media_alert]: '隐藏媒体内容 <br/> 点击显示'
}

const drawer = {
  [I18nTags.drawer.home]: '主页',
  [I18nTags.drawer.public]: '公共',
  [I18nTags.drawer.tag]: '标签',
  [I18nTags.drawer.profile]: '个人资料',
  [I18nTags.drawer.settings]: '设置',
  [I18nTags.drawer.logout]: '注销',
  [I18nTags.drawer.toHostInstance]: '打开当前实例站点',
  [I18nTags.drawer.search_input_placeholder]: '搜索',
  [I18nTags.drawer.search_result_people_label]: '用户',
  [I18nTags.drawer.search_result_hashtag_label]: '话题标签'
}

const settings = {
  [I18nTags.settings.general_label]: '常规',
  [I18nTags.settings.choose_theme]: '选择主题：',
  [I18nTags.settings.choose_language]: '选择语言：',
  [I18nTags.settings.use_multi_line_mode]: '使用多行布局模式：',
  [I18nTags.settings.show_sensitive_media_files]: '总是显示标记为敏感的媒体文件：',
  [I18nTags.settings.auto_load_new_status]: '总是自动加载新的嘟文：',
  [I18nTags.settings.post_privacy]: '嘟文默认可见范围：',
  [I18nTags.settings.stream_label]: '信息流',
  [I18nTags.settings.media_label]: '媒体内容',
  [I18nTags.settings.personality_label]: '个性化',
  [I18nTags.settings.publishing_label]: '发布'
}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: '没有更多啦！',
  [I18nTags.timeLines.new_message_notice]: '{count}条新信息'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: '要舍弃这条信息吗？',
  [I18nTags.postStatusDialog.do_keep_message]: '保留',
  [I18nTags.postStatusDialog.do_discard_message]: '舍弃',
  [I18nTags.postStatusDialog.text_character_limit_exceed]: '内容超过500个字符的限制了'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: '{displayName} 关注了你'
}

export default {
  ...oauth,
  ...common,
  ...statusCard,
  ...timeLines,
  ...drawer,
  ...settings,
  ...postStatusDialog,
  ...notifications
}
