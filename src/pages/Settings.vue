<template>
  <div class="setting-page-container">
    <mu-card>
      <mu-card-actions class="setting-card">
        <p class="card-label">{{$t($i18nTags.settings.general_label)}}</p>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.choose_theme)}}</span>
          <mu-select class="setting-select" v-model="themeName">
            <mu-option v-for="(themeInfo, index) in themeOptions" :key="index"
                       :label="themeInfo.label" :value="themeInfo.value" />
          </mu-select>
        </div>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.choose_language)}}</span>
          <mu-select class="setting-select" v-model="locale">
            <mu-option v-for="(localeInfo, index) in localesOptions" :key="index"
                       :label="localeInfo.label" :value="localeInfo.value" />
          </mu-select>
        </div>

        <p class="card-label">{{$t($i18nTags.settings.stream_label)}}</p>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.auto_load_new_status)}}</span>
          <mu-switch class="setting-switch" v-model="realTimeLoadStatusMode" />
        </div>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.use_multi_line_mode)}}</span>
          <mu-switch class="setting-switch" v-model="multiLineMode" />
        </div>

        <p class="card-label">{{$t($i18nTags.settings.media_label)}}</p>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.show_sensitive_media_files)}}</span>
          <mu-switch class="setting-switch" v-model="showSensitiveContentMode" />
        </div>

        <p class="card-label">{{$t($i18nTags.settings.publishing_label)}}</p>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.post_privacy)}}</span>
          <mu-select class="setting-select" v-model="postPrivacy">
            <mu-option v-for="(visibilityInfo, index) in postPrivacyOptions" :key="index"
                       :label="visibilityInfo.label" :value="visibilityInfo.value" />
          </mu-select>
        </div>

      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { ThemeNames, I18nLocales, VisibilityTypes } from '@/constant'
  import * as moment from 'moment'

  @Component({})
  class Setting extends Vue {

    $i18n

    $t

    @State('appStatus') appStatus

    @Mutation('updateTheme') updateTheme

    @Mutation('updateMultiLineMode') updateMultiLineMode

    @Mutation('updateShowSensitiveContentMode') updateShowSensitiveContentMode

    @Mutation('updateRealTimeLoadStatusMode') updateRealTimeLoadStatusMode

    @Mutation('updateLocale') updateLocale

    @Mutation('updatePostPrivacy') updatePostPrivacy

    themeOptions = [
      { label: 'Google Plus', value: ThemeNames.GOOGLE_PLUS },
      { label: 'Dark', value: ThemeNames.DARK }
    ]

    localesOptions = [
      { label: 'English', value: I18nLocales.EN },
      { label: '日本語', value: I18nLocales.JA },
      { label: '简体中文', value: I18nLocales.ZH_CN },
      { label: '繁體中文（香港）', value: I18nLocales.ZH_HK },
      { label: '繁體中文（台灣）', value: I18nLocales.ZH_TW }
    ]

    get postPrivacyOptions () {
      return [VisibilityTypes.PUBLIC, VisibilityTypes.UNLISTED, VisibilityTypes.PRIVATE].map(visibilityType => {
        return { label: this.$t(visibilityType), value: visibilityType }
      })
    }

    get themeName (): string {
      return this.appStatus.settings.theme
    }

    set themeName (val) {
      this.updateTheme(val)
    }

    get locale () {
      return this.appStatus.settings.locale
    }

    set locale (val) {
      this.$i18n.locale = val
      moment.locale(val)
      this.updateLocale(val)
    }

    get multiLineMode () {
      return this.appStatus.settings.multiLineMode
    }

    set multiLineMode (val) {
      this.updateMultiLineMode(val)
    }

    get showSensitiveContentMode () {
      return this.appStatus.settings.showSensitiveContentMode
    }

    set showSensitiveContentMode (val) {
      this.updateShowSensitiveContentMode(val)
    }

    get realTimeLoadStatusMode () {
      return this.appStatus.settings.realTimeLoadStatusMode
    }

    set realTimeLoadStatusMode (val) {
      this.updateRealTimeLoadStatusMode(val)
    }

    get postPrivacy () {
      return this.appStatus.settings.postPrivacy
    }

    set postPrivacy (val) {
      this.updatePostPrivacy(val)
    }
  }

  export default Setting
</script>

<style lang="less" scoped>
  .setting-page-container {
    max-width: 600px;
    min-width: 320px;
    margin: 0 auto;

    p {
      margin: 0;
    }

    .setting-card {
      padding: 10px;

      .card-label {
        font-size: 16px;
        font-weight: bold;
        margin-top: 5px;
      }

      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;

        .setting-label {
          font-size: 13px;
        }

        .setting-switch {
          margin-right: 12px;
        }

        .setting-input {
          min-height: unset;
          margin: 0;
          padding: 0;
        }
      }

      .select-row {
        .setting-select {
          width: 170px;
          padding: 0;
          margin: 0;
          min-height: unset;
        }
      }
    }
  }
</style>
