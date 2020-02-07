import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: 'Cuckoo Plus',
  [I18nTags.oauth.login_hint]: '連携ログイン',
  [I18nTags.oauth.server_input_label]: 'マストドンのURL',
  [I18nTags.oauth.please_input_server_url]: 'マストドンのURLを入力してください',
  [I18nTags.oauth.please_input_correct_server_url]: 'マストドンのURLを確認してください',
  [I18nTags.oauth.register_app_error_message]: '何かがおかしいです！ マストドンのURLを確認してください',
  [I18nTags.oauth.confirm_input]: '確認'
}

const common = {
  [I18nTags.common.status_visibility_public]: '公開',
  [I18nTags.common.status_visibility_unlisted]: '未収載',
  [I18nTags.common.status_visibility_private]: 'フォロワー限定',
  [I18nTags.common.status_visibility_direct]: 'ダイレクト',
  [I18nTags.common.status_visibility_public_desc]: '公開TLに投稿する',
  [I18nTags.common.status_visibility_unlisted_desc]: '公開TLで表示しない',
  [I18nTags.common.status_visibility_private_desc]: 'フォロワーだけに公開',
  [I18nTags.common.status_visibility_direct_desc]: 'メンションしたユーザーだけに公開',
  [I18nTags.common.drag_and_drop_to_upload]: 'ドラッグ＆ドロップでアップロード',
  [I18nTags.common.write_your_warning_here]: 'ここに警告を書いてください'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: '今なにしてる？',
  [I18nTags.statusCard.reply_to_main_status]: 'コメントを追加してください...',
  [I18nTags.statusCard.reply_to_replier]: '返信',
  [I18nTags.statusCard.cancel_post]: 'キャンセル',
  [I18nTags.statusCard.submit_post]: '送信',
  [I18nTags.statusCard.show_content]: '開く',
  [I18nTags.statusCard.hide_content]: '閉じる',
  [I18nTags.statusCard.mute_status]: 'ミュート投稿',

  [I18nTags.statusCard.mute_status]: 'ミュート投稿',
  [I18nTags.statusCard.mute_status_confirm]: 'この投稿をミュートしてもよろしいですか？',
  [I18nTags.statusCard.do_mute_status_btn]: 'ミュート',
  [I18nTags.statusCard.cancel_mute_user_btn]: 'キャンセル',

  [I18nTags.statusCard.mute_user]: 'ミュートユーザー',
  [I18nTags.statusCard.mute_user_confirm]: 'このユーザーをミュートしてもよろしいですか？',
  [I18nTags.statusCard.do_mute_user_btn]: 'ミュート',
  [I18nTags.statusCard.cancel_mute_user_btn]: 'キャンセル',

  [I18nTags.statusCard.delete_status]: '削除',
  [I18nTags.statusCard.delete_status_confirm]: 'この投稿を削除してもよろしいですか？',
  [I18nTags.statusCard.do_delete_status_btn]: '削除',
  [I18nTags.statusCard.cancel_delete_status_btn]: 'キャンセル',
  [I18nTags.statusCard.originally_shared_by]: '{displayName}<span class="at-name">@{atName}</span> さんから',
  [I18nTags.statusCard.sensitive_media_alert]: '隠されたメディア <br/> クリックで開きます',
  [I18nTags.statusCard.change_visibility]: '表示/非表示を切り替え',
  [I18nTags.statusCard.add_photos]: '画像を追加'
}

const drawer = {
  [I18nTags.drawer.home]: 'ホーム',
  [I18nTags.drawer.public]: 'パブリック',
  [I18nTags.drawer.local]: 'ローカル',
  [I18nTags.drawer.tag]: 'タグ',
  [I18nTags.drawer.profile]: 'プロフィール',
  [I18nTags.drawer.settings]: '設定',
  [I18nTags.drawer.logout]: 'ログアウト',
  [I18nTags.drawer.do_logout_message_confirm]: 'ログアウトを確認ですか？' ,
  [I18nTags.drawer.do_logout_message_yes]: 'はい',
  [I18nTags.drawer.do_logout_message_no]: 'いいえ',
  [I18nTags.drawer.toHostInstance]: '現在のインスタンスを開く',
  [I18nTags.drawer.search_input_placeholder]: '検索',
  [I18nTags.drawer.search_result_people_label]: 'ユーザー',
  [I18nTags.drawer.search_result_hashtag_label]: 'ハッシュタグ'
}

const settings = {
  [I18nTags.settings.general_label]: '一般',
  [I18nTags.settings.choose_theme]: 'テーマ:',
  [I18nTags.settings.export_theme_color_set]: 'エクスポート',
  [I18nTags.settings.import_theme_color_set]: 'インポート',
  [I18nTags.settings.edit_theme_color_set]: '編集',
  [I18nTags.settings.delete_theme_color_set]: '削除',

  [I18nTags.settings.choose_language]: '言語:',
  [I18nTags.settings.use_multi_line_mode]: 'マルチカラムレイアウトを使う:',
  [I18nTags.settings.maximum_number_of_columns_in_multi_line_mode]: 'マルチカラムレイアウトの最大カラム数:',
  [I18nTags.settings.show_sensitive_media_files]: 'メディアを常に閲覧注意としてマークする:',
  [I18nTags.settings.auto_expand_spoiler_text]: '警告内容を自動的に表示する:',
  [I18nTags.settings.auto_load_new_status]: '新しい投稿を常に自動的に読み込む:',
  [I18nTags.settings.post_privacy]: '投稿の公開範囲:',
  [I18nTags.settings.post_media_as_sensitive]: '自分が投稿するメディアを常に閲覧注意(NSFW)に設定する:',
  [I18nTags.settings.only_mention_target_user]: 'ターゲットユーザーのみをメンションする:',

  [I18nTags.settings.stream_label]: 'ストリーム',
  [I18nTags.settings.media_label]: 'メディア',
  [I18nTags.settings.personality_label]: 'パーソナリティ',
  [I18nTags.settings.publishing_label]: '投稿',
  [I18nTags.settings.web_label]: 'ウェブ',

  [I18nTags.settings.changes_successfully_saved]: '正常に変更されました！'
}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: 'すべての投稿を見ました。',
  [I18nTags.timeLines.new_message_notice]: '新しい投稿 {count} | 新しい投稿 {count}',
  [I18nTags.timeLines.whats_new_with_you]: '最近の出来事を共有してみましょう'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: 'この投稿を破棄しますか？',
  [I18nTags.postStatusDialog.do_keep_message]: '保持',
  [I18nTags.postStatusDialog.do_discard_message]: '破棄',
  [I18nTags.postStatusDialog.text_character_limit_exceed]: '文字数が500を超えています。'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: 'さんがあなたをフォローしています',
  [I18nTags.notifications.mentioned_you]: '返信',
  [I18nTags.notifications.favourited_your_status]:'お気に入り',
  [I18nTags.notifications.boosted_your_status]: 'ブースト'
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
