<template>
  <div class="setting-page-container">
    <mu-card v-loading="isLoading">
      <mu-card-actions class="setting-card">
        <p class="card-label">{{$t($i18nTags.settings.general_label)}}</p>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.choose_theme)}}</span>
          <mu-select class="setting-select" v-model="themeName">
            <mu-option v-for="(themeInfo, index) in themeOptions" :key="index"
                       :label="themeInfo.value" :value="themeInfo.value">
            </mu-option>
          </mu-select>
        </div>

        <div class="foot-note secondary-read-text-color">
          <span @click="onSelectThemeColorSetFile">{{$t($i18nTags.settings.import_theme_color_set)}}</span>
          /
          <span @click="shouldOpenThemeColorSetExportDialog = true">{{$t($i18nTags.settings.export_theme_color_set)}}</span>
          /
          <span @click="">{{$t($i18nTags.settings.edit_theme_color_set)}}</span>
          /
          <span @click="onOpenDeleteThemeColorSetPanel">{{$t($i18nTags.settings.delete_theme_color_set)}}</span>
        </div>

        <mu-dialog :title="$t($i18nTags.settings.export_theme_color_set)" :open.sync="shouldOpenThemeColorSetExportDialog">
          <div class="setting-row select-row dialog-setting-row">
            <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.choose_theme)}}</span>
            <mu-select class="setting-select" v-model="themeNameToExport">
              <mu-option v-for="(themeInfo, index) in themeOptions" :key="index"
                         :label="themeInfo.value" :value="themeInfo.value">
              </mu-option>
            </mu-select>
          </div>

          <mu-button slot="actions" flat color="secondary" @click="shouldOpenThemeColorSetExportDialog = false">Cancel</mu-button>
          <mu-button slot="actions" flat class="secondary-theme-text-color"
                     :disabled="!themeNameToExport" @click="onExportThemeColorSet">Export</mu-button>
        </mu-dialog>


        <mu-dialog :title="$t($i18nTags.settings.delete_theme_color_set)" :open.sync="shouldOpenThemeDeleteDialog">
          <div class="setting-row select-row dialog-setting-row">
            <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.choose_theme)}}</span>
            <mu-select class="setting-select" v-model="themeNameToDelete">
              <mu-option v-for="(themeInfo, index) in customThemeOptions" :key="index"
                         :label="themeInfo.value" :value="themeInfo.value">
              </mu-option>
            </mu-select>
          </div>

          <mu-button slot="actions" flat color="secondary" @click="shouldOpenThemeDeleteDialog = false">Cancel</mu-button>
          <mu-button slot="actions" flat class="secondary-theme-text-color"
                     :disabled="!themeNameToDelete" @click="onDeleteThemeColorSet">Delete</mu-button>
        </mu-dialog>


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

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.maximum_number_of_columns_in_multi_line_mode)}}</span>
          <mu-select class="setting-select" v-model="maximumNumberOfColumnsInMultiLineMode">
            <mu-option v-for="(info, index) in maximumColumnsOptions" :key="index"
                       :label="info.label" :value="info.value" />
          </mu-select>
        </div>

        <!--<p class="card-label">{{$t($i18nTags.settings.media_label)}}</p>-->

        <p class="card-label">{{$t($i18nTags.settings.publishing_label)}}</p>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.post_privacy)}}</span>
          <mu-select class="setting-select" v-model="postPrivacy">
            <mu-option v-for="(visibilityInfo, index) in postPrivacyOptions" :key="index"
                       :label="visibilityInfo.label" :value="visibilityInfo.value" />
          </mu-select>
        </div>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.post_media_as_sensitive)}}</span>
          <mu-switch class="setting-switch" v-model="postMediaAsSensitiveMode" />
        </div>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.only_mention_target_user)}}</span>
          <mu-switch class="setting-switch" v-model="onlyMentionTargetUserMode" />
        </div>

        <p class="card-label">{{$t($i18nTags.settings.web_label)}}</p>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.show_sensitive_media_files)}}</span>
          <mu-switch class="setting-switch" v-model="showSensitiveContentMode" />
        </div>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">{{$t($i18nTags.settings.auto_expand_spoiler_text)}}</span>
          <mu-switch class="setting-switch" v-model="autoExpandSpoilerTextMode"/>
        </div>

      </mu-card-actions>
    </mu-card>

    <input ref="importThemeInput" type="file" @change="onImportThemeColorSet"
           accept=".json"
           style="display: none"/>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action } from 'vuex-class'
  import { ThemeNames, I18nLocales, VisibilityTypes } from '@/constant'
  import * as moment from 'moment'
  import ThemeManager from '@/themes'

  const ADD_NEW_THEME_OPTION = 'ADD_NEW_THEME_OPTION'

  const presetThemeOptions = [
    { value: ThemeNames.GOOGLE_PLUS },
    { value: ThemeNames.DARK },
    { value: ThemeNames.GREEN_LIGHT },
    { value: ThemeNames.CUCKOO_HUB },
  ]

  @Component({})
  class Setting extends Vue {

    $i18n

    $i18nTags

    $t

    $toast

    $refs: {
      importThemeInput: HTMLInputElement
    }

    @State('appStatus') appStatus

    @Mutation('updateTheme') updateTheme
    @Mutation('updateMultiLineMode') updateMultiLineMode
    @Mutation('updateMaximumNumberOfColumnsInMultiLineMode') updateMaximumNumberOfColumnsInMultiLineMode
    @Mutation('updateShowSensitiveContentMode') updateShowSensitiveContentMode
    @Mutation('updateRealTimeLoadStatusMode') updateRealTimeLoadStatusMode
    @Mutation('updateLocale') updateLocale
    @Mutation('updateOnlyMentionTargetUserMode') updateOnlyMentionTargetUserMode
    @Mutation('updateAutoExpandSpoilerTextMode') updateAutoExpandSpoilerTextMode

    @Mutation('updatePostPrivacy') mutationUpdatePostPrivacy

    @Action('updatePostPrivacy') actionUpdatePostPrivacy
    @Action('updatePostMediaAsSensitiveMode') updatePostMediaAsSensitiveMode

    isLoading: boolean = false

    shouldOpenThemeColorSetExportDialog: boolean = false

    shouldOpenThemeDeleteDialog: boolean = false

    themeNameToExport = ''

    themeNameToDelete = ''

    shouldUpdateThemeOptions = 1

    get themeOptions () {
      this.shouldUpdateThemeOptions
      return ThemeManager.getThemeOptionsList()
    }

    get customThemeOptions () {
      this.shouldUpdateThemeOptions
      return ThemeManager.getCustomThemeOptionsList()
    }

    localesOptions = [
      { label: 'English', value: I18nLocales.EN },
      { label: '日本語', value: I18nLocales.JA },
      { label: '简体中文', value: I18nLocales.ZH_CN },
      { label: '繁體中文（香港）', value: I18nLocales.ZH_HK },
      { label: '繁體中文（台灣）', value: I18nLocales.ZH_TW }
    ]

    maximumColumnsOptions = [
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 }
    ]

    showSuccessChangedToast () {
      this.$toast.success(this.$t(this.$i18nTags.settings.changes_successfully_saved))
    }

    get postPrivacyOptions () {
      return [VisibilityTypes.PUBLIC, VisibilityTypes.UNLISTED, VisibilityTypes.PRIVATE].map(visibilityType => {
        return { label: this.$t(visibilityType), value: visibilityType }
      })
    }

    get themeName (): string {
      return this.appStatus.settings.theme
    }

    set themeName (val) {
      if (val === ADD_NEW_THEME_OPTION) {

      } else {
        this.updateTheme(val)
        ThemeManager.setTheme(val)
      }
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

    get maximumNumberOfColumnsInMultiLineMode () {
      return this.appStatus.settings.maximumNumberOfColumnsInMultiLineMode
    }

    set maximumNumberOfColumnsInMultiLineMode (val) {
      this.updateMaximumNumberOfColumnsInMultiLineMode(val)
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
      // todo muse-select has a bug, if only use updatePostPrivacy action here, select component will re-open after action complete
      this.mutationUpdatePostPrivacy(val)
      this._updatePostPrivacy(val)
    }

    async _updatePostPrivacy (val) {
      this.isLoading = true
      await this.actionUpdatePostPrivacy(val)
      this.isLoading = false
      this.showSuccessChangedToast()
    }

    get postMediaAsSensitiveMode () {
      return this.appStatus.settings.postMediaAsSensitiveMode
    }

    set postMediaAsSensitiveMode (val) {
      this._updatePostMediaAsSensitiveMode(val)
    }

    async _updatePostMediaAsSensitiveMode (val) {
      this.isLoading = true
      await this.updatePostMediaAsSensitiveMode(val)
      this.isLoading = false
      this.showSuccessChangedToast()
    }

    get onlyMentionTargetUserMode () {
      return this.appStatus.settings.onlyMentionTargetUserMode
    }

    set onlyMentionTargetUserMode (val) {
      this.updateOnlyMentionTargetUserMode(val)
    }

    get autoExpandSpoilerTextMode () {
      return this.appStatus.settings.autoExpandSpoilerTextMode
    }

    set autoExpandSpoilerTextMode (val) {
      this.updateAutoExpandSpoilerTextMode(val)
    }

    @Watch('shouldOpenThemeColorSetExportDialog')
    onShouldOpenThemeColorSetExportDialogChanged () {
      if (this.shouldOpenThemeColorSetExportDialog) {
        this.themeNameToExport = this.themeName
      }
    }

    @Watch('shouldOpenThemeDeleteDialog')
    onShouldOpenThemeDeleteDialogChanged () {
      if (this.shouldOpenThemeDeleteDialog) {
        this.themeNameToDelete = this.customThemeOptions[0].value
      }
    }

    onExportThemeColorSet () {
      ThemeManager.exportTheme(this.themeNameToExport)
      this.shouldOpenThemeColorSetExportDialog = false
    }

    onOpenDeleteThemeColorSetPanel () {
      if (!this.customThemeOptions.length) {
        return this.$toast.warning('There is no custom theme to delete')
      }

      this.shouldOpenThemeDeleteDialog = true
    }

    onDeleteThemeColorSet () {
      ThemeManager.deleteTheme(this.themeNameToDelete)
      if (this.themeNameToDelete === this.themeName) {
        this.themeName = ThemeNames.GOOGLE_PLUS
      }
      this.shouldUpdateThemeOptions = this.shouldUpdateThemeOptions + 1
      this.shouldOpenThemeDeleteDialog = false
    }

    onSelectThemeColorSetFile () {
      this.$refs.importThemeInput.click()
    }

    onImportThemeColorSet () {
      const file = this.$refs.importThemeInput.files[0]
      const fileName = file.name.replace(/.json$/, '')

      if (this.themeOptions.find(opt => opt.value === fileName)) {
        return this.$toast.warning('Same name theme conflicts')
      }

      const fileReader = new FileReader()
      fileReader.readAsText(file)

      fileReader.onload = e => {
        if(e.target.readyState !== 2) return
        if(e.target.error) return

        const themeColorSet = JSON.parse(e.target.result)
        ThemeManager.importTheme(themeColorSet, fileName)
        this.shouldUpdateThemeOptions = this.shouldUpdateThemeOptions + 1
        this.themeName = fileName
      }

    }

    mounted () {
      if (!this.themeOptions.find(opt => opt.value === this.themeName)) {
        this.themeName = ThemeNames.GOOGLE_PLUS
      }
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

    }
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

    &.dialog-setting-row {
      .setting-label {
        margin-right: 20px;
      }
    }
  }

  .foot-note {
    text-align: right;
    margin-right: 12px;
    margin-top: -6px;

    span {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
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
</style>
