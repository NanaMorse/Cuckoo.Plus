import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: 'Cuckoo Plus',
  [I18nTags.oauth.login_hint]: 'Authorize Login',
  [I18nTags.oauth.server_input_label]: 'Mastodon URL',
  [I18nTags.oauth.please_input_server_url]: 'please input Mastodon URL',
  [I18nTags.oauth.please_input_correct_server_url]: 'check your Mastodon URL',
  [I18nTags.oauth.register_app_error_message]: 'Something went wrong! please check your Mastodon URL again',
  [I18nTags.oauth.confirm_input]: 'CONFIRM'
}

const common = {
  [I18nTags.common.status_visibility_public]: 'Public',
  [I18nTags.common.status_visibility_unlisted]: 'Unlisted',
  [I18nTags.common.status_visibility_private]: 'Followers-only',
  [I18nTags.common.status_visibility_direct]: 'Direct',
  [I18nTags.common.status_visibility_public_desc]: 'Post to public timelines',
  [I18nTags.common.status_visibility_unlisted_desc]: 'Do not post to public timelines',
  [I18nTags.common.status_visibility_private_desc]: 'Post to followers only',
  [I18nTags.common.status_visibility_direct_desc]: 'Post to mentioned users only',
  [I18nTags.common.drag_and_drop_to_upload]: 'Drag & Drop to upload',
  [I18nTags.common.write_your_warning_here]: 'Write your warning here'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: 'What is on your mind?',
  [I18nTags.statusCard.reply_to_main_status]: 'Add a comment...',
  [I18nTags.statusCard.reply_to_replier]: 'REPLY',
  [I18nTags.statusCard.cancel_post]: 'CANCEL',
  [I18nTags.statusCard.submit_post]: 'POST',
  [I18nTags.statusCard.show_content]: 'SHOW MORE',
  [I18nTags.statusCard.hide_content]: 'SHOW LESS',
  [I18nTags.statusCard.mute_status]: 'Mute',
  [I18nTags.statusCard.delete_status]: 'Delete',
  [I18nTags.statusCard.delete_status_confirm]: 'Are you sure you want to delete the post?',
  [I18nTags.statusCard.do_delete_status_btn]: 'DELETE',
  [I18nTags.statusCard.cancel_delete_status_btn]: 'CANCEL',
  [I18nTags.statusCard.originally_shared_by]: 'Originally shared by {displayName}<span class="at-name">@{atName}</span>',
  [I18nTags.statusCard.sensitive_media_alert]: 'Hide content <br/> Click to view',
  [I18nTags.statusCard.change_visibility]: 'Change Visibility',
  [I18nTags.statusCard.add_photos]: 'Add Photos'
}

const drawer = {
  [I18nTags.drawer.home]: 'Home',
  [I18nTags.drawer.public]: 'Public',
  [I18nTags.drawer.tag]: 'Tag',
  [I18nTags.drawer.local]: 'Local',
  [I18nTags.drawer.profile]: 'Profile',
  [I18nTags.drawer.settings]: 'Settings',
  [I18nTags.drawer.logout]: 'Logout',
  [I18nTags.drawer.do_logout_message_confirm]: 'Are you sure you want to Logout?',
  [I18nTags.drawer.do_logout_message_yes]: 'Yes',
  [I18nTags.drawer.do_logout_message_no]: 'No',
  [I18nTags.drawer.toHostInstance]: 'Open Current Instance Site',
  [I18nTags.drawer.search_input_placeholder]: 'Search',
  [I18nTags.drawer.search_result_people_label]: 'People',
  [I18nTags.drawer.search_result_hashtag_label]: 'HashTag'
}

const settings = {
  [I18nTags.settings.general_label]: 'General',
  [I18nTags.settings.choose_theme]: 'Choose Theme:',
  [I18nTags.settings.export_theme_color_set]: 'export',
  [I18nTags.settings.import_theme_color_set]: 'import',
  [I18nTags.settings.edit_theme_color_set]: 'edit',
  [I18nTags.settings.delete_theme_color_set]: 'delete',

  [I18nTags.settings.choose_language]: 'Choose Language:',
  [I18nTags.settings.use_multi_line_mode]: 'Use multi-column layout mode:',
  [I18nTags.settings.maximum_number_of_columns_in_multi_line_mode]: 'Maximum number of columns in multi-column layout mode:',
  [I18nTags.settings.show_sensitive_media_files]: 'Always show media marked as sensitive:',
  [I18nTags.settings.auto_expand_spoiler_text]: 'Always auto expand spoiler text:',
  [I18nTags.settings.auto_load_new_status]: 'Always auto load new post:',
  [I18nTags.settings.post_privacy]: 'Post privacy:',
  [I18nTags.settings.post_media_as_sensitive]: 'Always mark media as sensitive:',
  [I18nTags.settings.only_mention_target_user]: 'Only mention target user',

  [I18nTags.settings.stream_label]: 'Stream',
  [I18nTags.settings.media_label]: 'Media',
  [I18nTags.settings.personality_label]: 'Personality',
  [I18nTags.settings.publishing_label]: 'Publishing',
  [I18nTags.settings.web_label]: 'Web',

  [I18nTags.settings.changes_successfully_saved]: 'Changes successfully saved!'
}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: 'You have seen all posts.',
  [I18nTags.timeLines.new_message_notice]: '{count} new post | {count} new posts',
  [I18nTags.timeLines.whats_new_with_you]: 'What\'s new with you?'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: 'Discard this post?',
  [I18nTags.postStatusDialog.do_keep_message]: 'KEEP',
  [I18nTags.postStatusDialog.do_discard_message]: 'DISCARD',
  [I18nTags.postStatusDialog.text_character_limit_exceed]: 'Text character limit of 500 exceeded'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: 'followed you',
  [I18nTags.notifications.mentioned_you]: 'mentioned you',
  [I18nTags.notifications.favourited_your_status]:'favourited your status',
  [I18nTags.notifications.boosted_your_status]: 'boosted your status'
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
