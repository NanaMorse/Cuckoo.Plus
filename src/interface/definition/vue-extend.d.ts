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
      },
      timeLines: {
        no_load_more_status_notice: string
        new_message_notice: string
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
      },
      settings: {
        general_label: string
        choose_theme: string
        choose_language: string
        use_multi_line_mode: string
        show_sensitive_media_files: string
        auto_load_new_status: string
        stream_label: string
        media_label: string
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
      }
    }

    $toast: {
      error: (msg: string) => void
    }

    $confirm: (message: string, title: string, options) => Promise<{ result: boolean }>
  }
}
