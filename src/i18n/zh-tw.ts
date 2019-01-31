import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: '布穀鳥 Plus',
  [I18nTags.oauth.login_hint]: '授權登入',
  [I18nTags.oauth.server_input_label]: 'Mastodon 連結',
  [I18nTags.oauth.please_input_server_url]: '請輸入 Mastodon 連結',
  [I18nTags.oauth.please_input_correct_server_url]: '請輸入準確的 Mastodon 連結',
  [I18nTags.oauth.register_app_error_message]: '請檢查目標連結是否準確',
  [I18nTags.oauth.confirm_input]: '確認'
}

const common = {
  [I18nTags.common.status_visibility_public]: '公開貼',
  [I18nTags.common.status_visibility_unlisted]: '不列出來',
  [I18nTags.common.status_visibility_private]: '關注貼',
  [I18nTags.common.status_visibility_direct]: '直接貼',
  [I18nTags.common.status_visibility_public_desc]: '貼到公開時間軸',
  [I18nTags.common.status_visibility_unlisted_desc]: '不要貼到公開時間軸',
  [I18nTags.common.status_visibility_private_desc]: '只貼給關注者',
  [I18nTags.common.status_visibility_direct_desc]: '只貼給提到的使用者',
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: '最近有什麼新鮮事？',
  [I18nTags.statusCard.reply_to_main_status]: '發表留言...',
  [I18nTags.statusCard.reply_to_replier]: '回覆',
  [I18nTags.statusCard.cancel_post]: '取消',
  [I18nTags.statusCard.submit_post]: '發佈',
  [I18nTags.statusCard.show_content]: '顯示內容',
  [I18nTags.statusCard.hide_content]: '隱藏內容',
  [I18nTags.statusCard.mute_status]: '忽略',
  [I18nTags.statusCard.delete_status]: '刪除',
  [I18nTags.statusCard.delete_status_confirm]: '確定要刪除這則訊息嗎？',
  [I18nTags.statusCard.do_delete_status_btn]: '删除',
  [I18nTags.statusCard.cancel_delete_status_btn]: '取消',
  [I18nTags.statusCard.originally_shared_by]: '{displayName}<span class="at-name">@{atName}</span>最先分享這則訊息',
  [I18nTags.statusCard.sensitive_media_alert]: '隐藏內容 <br/> 點來看'
}

const drawer = {
  [I18nTags.drawer.home]: '首頁',
  [I18nTags.drawer.public]: '聯盟時間軸',
  [I18nTags.drawer.tag]: '主題標籤',
  [I18nTags.drawer.profile]: '個人資料',
  [I18nTags.drawer.settings]: '設定',
  [I18nTags.drawer.toHostInstance]: '前往當前實例站點'
}

const settings = {
  [I18nTags.settings.general_label]: '一般',
  [I18nTags.settings.choose_theme]: '選擇主題：',
  [I18nTags.settings.choose_language]: '選擇語言：',
  [I18nTags.settings.use_multi_line_mode]: '使用多行佈局模式：',
  [I18nTags.settings.show_sensitive_media_files]: '總是顯示標記為敏感的媒體文件：',
  [I18nTags.settings.auto_load_new_status]: '總是自動加載最新嘟文：',
  [I18nTags.settings.stream_label]: '訊息串',
  [I18nTags.settings.media_label]: '媒體內容'
}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: '你已看完了所有訊息',
  [I18nTags.timeLines.new_message_notice]: '{count}條新訊息'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: '確定要捨棄這則訊息嗎？',
  [I18nTags.postStatusDialog.do_keep_message]: '保留',
  [I18nTags.postStatusDialog.do_discard_message]: '捨棄'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: '{displayName} 關注了你'
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
