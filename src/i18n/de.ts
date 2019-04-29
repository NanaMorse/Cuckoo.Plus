import { I18nTags } from '@/constant'

const oauth = {
  [I18nTags.oauth.form_brand]: 'Cuckoo Plus',
  [I18nTags.oauth.login_hint]: 'Anmelden',
  [I18nTags.oauth.server_input_label]: 'Mastodon URL',
  [I18nTags.oauth.please_input_server_url]: 'Bitte Mastodon URL eingeben',
  [I18nTags.oauth.please_input_correct_server_url]: 'Bitte Mastodon URL überprüfen',
  [I18nTags.oauth.register_app_error_message]: 'Oops! Bitte Mastodon URL nochmals überprüfen',
  [I18nTags.oauth.confirm_input]: 'Bestätigen'
}

const common = {
  [I18nTags.common.status_visibility_public]: 'Öffentlich',
  [I18nTags.common.status_visibility_unlisted]: 'Privat',
  [I18nTags.common.status_visibility_private]: 'Nur Folgende',
  [I18nTags.common.status_visibility_direct]: 'Direktnachrichten',
  [I18nTags.common.status_visibility_public_desc]: 'In öffentlicher Zeitleiste teilen',
  [I18nTags.common.status_visibility_unlisted_desc]: 'Nicht in öffentlicher Zeitleiste teilen',
  [I18nTags.common.status_visibility_private_desc]: 'Nur mit den Folgers teilen',
  [I18nTags.common.status_visibility_direct_desc]: 'Nur mit erwähnten Freunden teilen',
  [I18nTags.common.drag_and_drop_to_upload]: 'Drag & Drop zum Hochladen',
  [I18nTags.common.write_your_warning_here]: 'Bitte hier Warnung schreiben'
}

const statusCard = {
  [I18nTags.statusCard.post_new_status_placeholder]: 'Gibt\'s etwas Neues?',
  [I18nTags.statusCard.reply_to_main_status]: 'Kommentieren...',
  [I18nTags.statusCard.reply_to_replier]: 'Antworten',
  [I18nTags.statusCard.cancel_post]: 'Abbrechen',
  [I18nTags.statusCard.submit_post]: 'Tröt',
  [I18nTags.statusCard.show_content]: 'Mehr anzeigen',
  [I18nTags.statusCard.hide_content]: 'Weniger anzeigen',
  [I18nTags.statusCard.mute_status]: 'Stummschalten',
  [I18nTags.statusCard.delete_status]: 'Löschen',
  [I18nTags.statusCard.delete_status_confirm]: 'Möchtest du diesen Beitrag löschen?',
  [I18nTags.statusCard.do_delete_status_btn]: 'Löschen',
  [I18nTags.statusCard.cancel_delete_status_btn]: 'Abbrechen',
  [I18nTags.statusCard.originally_shared_by]: 'Ursprünglich geteilt von {displayName}<span class="at-name">@{atName}</span>',
  [I18nTags.statusCard.sensitive_media_alert]: 'Ausgeblendeter Inhalt <br/> Tippen zum Anzeigen',
  [I18nTags.statusCard.change_visibility]: 'Sichtbarkeit ändern',
  [I18nTags.statusCard.add_photos]: 'Fotos hinzufügen'
}

const drawer = {
  [I18nTags.drawer.home]: 'Übersicht',
  [I18nTags.drawer.public]: 'Öffentlich',
  [I18nTags.drawer.tag]: 'Tag',
  [I18nTags.drawer.local]: 'Lokal',
  [I18nTags.drawer.profile]: 'Profil',
  [I18nTags.drawer.settings]: 'Einstellungen',
  [I18nTags.drawer.logout]: 'Abmelden',
  [I18nTags.drawer.do_logout_message_confirm]: 'Möchtest du abmelden?',
  [I18nTags.drawer.do_logout_message_yes]: 'Ja',
  [I18nTags.drawer.do_logout_message_no]: 'Nein',
  [I18nTags.drawer.toHostInstance]: 'Aktuelle Instanzseite öffnen',
  [I18nTags.drawer.search_input_placeholder]: 'Suchen',
  [I18nTags.drawer.search_result_people_label]: 'Leute',
  [I18nTags.drawer.search_result_hashtag_label]: 'Hashtag'
}

const settings = {
  [I18nTags.settings.general_label]: 'Allgemeines',
  [I18nTags.settings.choose_theme]: 'Themen',
  [I18nTags.settings.export_theme_color_set]: 'Exportieren',
  [I18nTags.settings.import_theme_color_set]: 'Importieren',
  [I18nTags.settings.edit_theme_color_set]: 'Bearbeiten',
  [I18nTags.settings.delete_theme_color_set]: 'Löschen',

  [I18nTags.settings.choose_language]: 'Sprache',
  [I18nTags.settings.use_multi_line_mode]: 'Mehrspaltiger Layout-Mode verwenden',
  [I18nTags.settings.maximum_number_of_columns_in_multi_line_mode]: 'Maximale Anzahl der Spalten im mehrspaltigen Layout-Mode',
  [I18nTags.settings.show_sensitive_media_files]: 'Sensible Medien immer anzeigen',
  [I18nTags.settings.auto_expand_spoiler_text]: 'Ausgeblendete Texte immer automatisch expandieren',
  [I18nTags.settings.auto_load_new_status]: 'Neue Beiträge immer automatisch laden',
  [I18nTags.settings.post_privacy]: 'Beitragssichtbarkeit',
  [I18nTags.settings.post_media_as_sensitive]: 'Medien immer als sensibel markieren',
  [I18nTags.settings.only_mention_target_user]: 'Nur für erwähnte Freunden sichtbar',

  [I18nTags.settings.stream_label]: 'Stream',
  [I18nTags.settings.media_label]: 'Medien',
  [I18nTags.settings.personality_label]: 'Individualität',
  [I18nTags.settings.publishing_label]: 'Veröffentlichung',
  [I18nTags.settings.web_label]: 'Web',

  [I18nTags.settings.changes_successfully_saved]: 'Änderungen gespeichert!'
}

const timeLines = {
  [I18nTags.timeLines.no_load_more_status_notice]: 'Das ist alles!',
  [I18nTags.timeLines.new_message_notice]: '{count} neue Beitrag | {count} neue Beiträge',
  [I18nTags.timeLines.whats_new_with_you]: 'Gibt\'s etwas Neues?'
}

const postStatusDialog = {
  [I18nTags.postStatusDialog.do_discard_message_confirm]: 'Möchtest du diesen Beitrag verwerfen?',
  [I18nTags.postStatusDialog.do_keep_message]: 'Behalten',
  [I18nTags.postStatusDialog.do_discard_message]: 'Verwerfen',
  [I18nTags.postStatusDialog.text_character_limit_exceed]: 'Buchstabenbegrenzung von 500 überschritten'
}

const notifications = {
  [I18nTags.notifications.someone_followed_you]: 'folgt dir',
  [I18nTags.notifications.mentioned_you]: 'hat dich erwähnt',
  [I18nTags.notifications.favourited_your_status]:'gefällt deinen Status',
  [I18nTags.notifications.boosted_your_status]: 'hat deinen Beitrag erneut geteilt'
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
