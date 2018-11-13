<template>
  <section class="oauth-container">

    <div class="form-container">
      <p class="oauth-form-brand">{{$t($i18nTags.oauth.form_brand)}}</p>

      <p class="oauth-login-hint">{{$t($i18nTags.oauth.login_hint)}}</p>

      <mu-form ref="form" :model="validateForm">

        <mu-form-item class="server-input-form-item" prop="mastodonServerUri" :rules="uriRules" :label="$t($i18nTags.oauth.server_input_label)">
          <mu-auto-complete prop="mastodonServerUri" class="server-input" :data="mastodonServerUriList" :full-width="true"
                            :max-search-results="5" label-float :prefix="prefix"
                            v-model="validateForm.mastodonServerUri" avatar>
            <template slot-scope="scope">
              <mu-list-item-action>
                <mu-avatar>
                  <img :src="scope.item.favicon">
                </mu-avatar>
              </mu-list-item-action>
              <mu-list-item-content v-html="scope.item.value">
              </mu-list-item-content>
            </template>
          </mu-auto-complete>
        </mu-form-item>

        <mu-button class="submit-server-name-btn" color="primary"
                   @click="onSubmitServerName">确认</mu-button>

      </mu-form>

    </div>

  </section>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { Mutation, State } from 'vuex-class'
  import { apps } from '@/api'
  import { cuckoostore } from '@/interface'

  // the first step, ask for mastodon OAuth Access token
  // and store this token

  const mastodonServerUriList = [
    { value: 'pawoo.net', favicon: 'https://pawoo.net/favicon.png' },
    // todo get mastodon favicon
    { value: 'mastodon.social', favicon: 'https://raw.githubusercontent.com/tootsuite/mastodon/master/public/favicon.ico' }
  ]

  function isURL(str) {
    const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/
    return pattern.test(str);
  }

  @Component({})
  class OAuth extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    @Mutation('updateMastodonServerUri') updateMastodonServerUri

    @Mutation('updateClientInfo') updateClientInfo

    prefix = 'https://'

    mastodonServerUriList = mastodonServerUriList

    get uriRules () {
      return [
        // @ts-ignore
        { validate: (val) => !!val, message: this.$t(this.$i18nTags.oauth.please_input_server_url) },
        // @ts-ignore
        { validate: (val) => isURL(this.prefix + val), message: this.$t(this.$i18nTags.oauth.please_input_correct_server_url) }
      ]
    }

    validateForm = {
      mastodonServerUri: ''
    }

    onSubmitServerName () {
      (this.$refs as any).form.validate().then(async (pass) => {
        if (!pass) return

        this.updateMastodonServerUri(this.prefix + this.validateForm.mastodonServerUri)

        try {
          const result = await apps.registerApplication()

          this.updateClientInfo({
            clientId: result.data.client_id,
            clientSecret: result.data.client_secret
          })

          this.goToMastodonServerForOAuth()
        } catch (e) {
          // @ts-ignore
          this.$toast.error(this.$t(this.$i18nTags.oauth.register_app_error_message))
        }
      });
    }

    goToMastodonServerForOAuth () {
      window.location.href = `${this.prefix + this.validateForm.mastodonServerUri}/oauth/authorize?client_id=${this.OAuthInfo.clientId}` +
        `&redirect_uri=${location.origin}` +
        `&response_type=code&scope=read write follow`
    }
  }

  export default OAuth
</script>

<style lang="less" scoped>
  .oauth-container {
    margin-top: 30px;
    padding: 20px;

    .form-container {
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }

    @media (min-width: 768px) {
      .form-container {
        width: 360px;
      }
    }

    .oauth-form-brand {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      line-height: 50px;
      padding: 0 14px;
      margin-top: 0;
      margin-bottom: 10px;
    }

    .oauth-login-hint {
      text-align: center;
      padding: 14px;
      font-size: 14px;
      margin: 0;
      font-weight: bold;
    }

    .server-input-form-item {
      margin: 0 auto;
    }
  }

  .submit-server-name-btn {
    width: 100%;
    margin: 20px auto 0;
    display: block;
  }
</style>
