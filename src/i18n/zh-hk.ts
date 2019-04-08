import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: '布穀鳥 Plus',
  [I18nTags.oauth.login_hint]: '授權登錄',
  [I18nTags.oauth.server_input_label]: 'Mastodon 連結',
  [I18nTags.oauth.please_input_server_url]: '請輸入 Mastodon 連結',
  [I18nTags.oauth.please_input_correct_server_url]: '請輸入準確的 Mastodon 連結',
  [I18nTags.oauth.register_app_error_message]: '請檢查目標連結是否準確',
  [I18nTags.oauth.confirm_input]: '確認'
}

const common = {
  [I18nTags.common.status_visibility_public]: '公共',
  [I18nTags.common.status_visibility_unlisted]: '公開',
  [I18nTags.common.status_visibility_private]: '關注者',
  [I18nTags.common.status_visibility_direct]: '私人訊息',
  [I18nTags.common.status_visibility_public_desc]: '在公共時間軸顯示',
  [I18nTags.common.status_visibility_unlisted_desc]: '公開，但不在公共時間軸顯示',
  [I18nTags.common.status_visibility_private_desc]: '只有關注你用戶能看到',
  [I18nTags.common.status_visibility_direct_desc]: '只有提及的用戶能看到',
  [I18nTags.common.drag_and_drop_to_upload]: '將檔案拖放至此上載',
  [I18nTags.common.write_your_warning_here]: '敏感警告訊息'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: '你有什麼新動態？',
  [I18nTags.statusCard.reply_to_main_status]: '新增留言…',
  [I18nTags.statusCard.reply_to_replier]: '回覆',
  [I18nTags.statusCard.cancel_post]: '取消',
  [I18nTags.statusCard.submit_post]: '發佈',
  [I18nTags.statusCard.show_content]: '顯示內容',
  [I18nTags.statusCard.hide_content]: '隱藏內容',
  [I18nTags.statusCard.mute_status]: '忽略',
  [I18nTags.statusCard.delete_status]: '刪除',
  [I18nTags.statusCard.delete_status_confirm]: '你確定要刪除這則訊息嗎？',
  [I18nTags.statusCard.do_delete_status_btn]: '刪除',
  [I18nTags.statusCard.cancel_delete_status_btn]: '取消',
  [I18nTags.statusCard.originally_shared_by]: '最初由{displayName}<span class="at-name">@{atName}</span>分享',
  [I18nTags.statusCard.sensitive_media_alert]: '隐藏內容 <br/> 點擊顯示'
}

const drawer = {
  [I18nTags.drawer.home]: '主頁',
  [I18nTags.drawer.public]: '跨站時間軸',
  [I18nTags.drawer.tag]: '標籤',
  [I18nTags.drawer.local]: '本站時間軸',
  [I18nTags.drawer.profile]: '個人檔案',
  [I18nTags.drawer.settings]: '設定',
  [I18nTags.drawer.logout]: '登出',
  [I18nTags.drawer.do_logout_message_confirm]: '確定登出Cuckoo？' ,
  [I18nTags.drawer.do_logout_message_yes]: '是',
  [I18nTags.drawer.do_logout_message_no]: '否',
  [I18nTags.drawer.toHostInstance]: '前往當前實例站點',
  [I18nTags.drawer.search_input_placeholder]: '搜索',
  [I18nTags.drawer.search_result_people_label]: '用戶',
  [I18nTags.drawer.search_result_hashtag_label]: '話題標籤'
}

const settings = {
  [I18nTags.settings.general_label]: '一般',
  [I18nTags.settings.choose_theme]: '選擇主題：',
  [I18nTags.settings.choose_language]: '選擇語言：',
  [I18nTags.settings.use_multi_line_mode]: '使用多列佈局模式：',
  [I18nTags.settings.maximum_number_of_columns_in_multi_line_mode]: '多列佈局模式下的最大列數：',
  [I18nTags.settings.show_sensitive_media_files]: '總是顯示被標記為敏感的媒體文件：',
  [I18nTags.settings.auto_expand_spoiler_text]: '總是顯示被警告折疊的文本內容：',
  [I18nTags.settings.auto_load_new_status]: '總是自動加載最新嘟文：',
  [I18nTags.settings.post_privacy]: '文章預設為：',
  [I18nTags.settings.post_media_as_sensitive]: '預設我的內容為敏感內容：',
  [I18nTags.settings.only_mention_target_user]: '回覆時僅提及目標使用者',

  [I18nTags.settings.stream_label]: '訊息串',
  [I18nTags.settings.media_label]: '媒體內容',
  [I18nTags.settings.personality_label]: '個人化',
  [I18nTags.settings.publishing_label]: '發佈',
  [I18nTags.settings.web_label]: '站内',

  [I18nTags.settings.changes_successfully_saved]: '已成功儲存修改'

}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: '你已看完了所有訊息',
  [I18nTags.timeLines.new_message_notice]: '{count}條新訊息',
  [I18nTags.timeLines.whats_new_with_you]: '你有什麼新動態？'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: '確定要捨棄這則訊息嗎？',
  [I18nTags.postStatusDialog.do_keep_message]: '保留',
  [I18nTags.postStatusDialog.do_discard_message]: '捨棄',
  [I18nTags.postStatusDialog.text_character_limit_exceed]: '內容超出500個字符的限制了'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: '關注了你',
  [I18nTags.notifications.mentioned_you]: '提及了你',
  [I18nTags.notifications.favourited_your_status]:'收藏了你的文章',
  [I18nTags.notifications.boosted_your_status]: '轉推你的文章'
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
