import VueRouter, { Route } from "vue-router";

interface routerInfo { path: string, name: string }

declare module "vue/types/vue" {
  interface Vue {
    $router: VueRouter;
    $route: Route;

    $routersInfo: {
      empty: routerInfo
      home: routerInfo
      oauth: routerInfo
      settings: routerInfo
      statuses: routerInfo
      timelines: routerInfo
      defaulttimelines: routerInfo
      tagtimelines: routerInfo
      listtimelines: routerInfo
      accounts: routerInfo
    }

    $i18nTags: {
      statusCard: {
        post_new_status_placeholder: string
        reply_to_replier: string
        reply_to_main_status: string
        cancel_post: string
        submit_post: string
        show_content: string
        hide_content: string
        mute_status: string
        delete_status: string
        delete_status_confirm: string
        do_delete_status_btn: string
        cancel_delete_status_btn: string
        originally_shared_by: string
        sensitive_media_alert: string
        change_visibility: string
        add_photos: string
      },
      common: {
        status_visibility_public: string
        status_visibility_private: string
        status_visibility_unlisted: string
        status_visibility_direct: string
        status_visibility_public_desc: string,
        status_visibility_private_desc: string,
        status_visibility_unlisted_desc: string,
        status_visibility_direct_desc: string,
        drag_and_drop_to_upload: string
        write_your_warning_here: string
      },
      timeLines: {
        no_load_more_status_notice: string
        new_message_notice: string
        whats_new_with_you: string
      },
      header: {

      },
      drawer: {
        home: string
        public: string
        tag: string
        profile: string
        settings: string
        toHostInstance: string
        search_input_placeholder: string
        search_result_people_label: string
        search_result_hashtag_label: string
        do_logout_message_confirm: string
        do_logout_message_yes: string
        do_logout_message_no: string
      },
      settings: {
        general_label: string
        choose_theme: string
        choose_language: string
        use_multi_line_mode: string
        show_sensitive_media_files: string
        auto_load_new_status: string
        post_privacy: string
        post_media_as_sensitive: string
        only_mention_target_user: string
        maximum_number_of_columns_in_multi_line_mode: string
        auto_expand_spoiler_text: string

        stream_label: string
        media_label: string
        publishing_label: string
        personality_label: string
        web_label: string
        changes_successfully_saved: string
      },
      home: {

      },
      oauth: {
        form_brand: string
        login_hint: string
        server_input_label: string
        please_input_server_url: string
        please_input_correct_server_url: string
        register_app_error_message: string
        confirm_input: string
      },
      postStatusDialog: {
        do_discard_message_confirm: string
        do_keep_message: string
        do_discard_message: string
        text_character_limit_exceed: string
      },
      notifications: {
        someone_followed_you: string
        mentioned_you: string
        boosted_your_status: string
        favourited_your_status: string
      }
    }

    $toast: {
      error: (msg: string) => void
    }

    $confirm: (message: string, title: string, options) => Promise<{ result: boolean }>
  }
}
