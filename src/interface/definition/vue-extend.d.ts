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
      home: {

      },
      oauth: {
        form_brand: string
        login_hint: string
        server_input_label: string
        please_input_server_url: string
        please_input_correct_server_url: string
        register_app_error_message: string
      }
    }

    $toast: {
      error: (msg: string) => void
    }

    $confirm: (message: string, title: string, options) => Promise<{ result: boolean }>
  }
}
