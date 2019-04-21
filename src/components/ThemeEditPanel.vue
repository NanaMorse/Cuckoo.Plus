<template>
  <div class="theme-edit-panel-container">
    <mu-dialog :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
               dialog-class="theme-edit-dialog default-theme-bg-color" :width="dialogWidth"
               :overlay-close="false"
               :overlay-opacity="1" :transition="transition" :fullscreen="shouldDialogFullScreen">

      <mu-appbar color="secondary">
        <mu-button slot="right" icon @click="onMinimizePanel">
          <mu-icon value="exit_to_app" />
        </mu-button>
      </mu-appbar>

      <div class="color-select-area">
        <mu-card class="color-select-card" v-for="(colorInfo, index) in colorPickPanelOrder" :key="index">
          <div class="color-info">
            <span class="color-name primary-read-text-color">{{colorInfo.label}}</span>
            <span class="color-value secondary-read-text-color">{{colorInfo.value}}</span>
          </div>
          <div class="color-cake" ref="colorCakes" :style="{ backgroundColor: colorInfo.value }"
               @click="onColorCakeClick(colorInfo, index)">
            <mu-ripple />
          </div>
        </mu-card>
      </div>

      <mu-button slot="actions" flat color="secondary" @click="onTryToCancelEdit">Cancel</mu-button>
      <mu-button slot="actions" flat class="secondary-theme-text-color" @click="onTryToSaveTheme" :disabled="!hasColorChanged">Save</mu-button>

    </mu-dialog>

    <mu-button fab class="minimize-theme-edit-button" color="secondary" v-show="!isDialogOpening"
               @click="onMaximisePanel">
      <mu-icon value="color_lens" />
    </mu-button>

    <mu-popover cover :trigger="triggerPopOverElem"
                :open.sync="shouldOpenColorPickerPopOver">
      <chrome-picker :value="currentEditColorInfo.value" @input="onColorPickerInput"/>
    </mu-popover>

  </div>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Getter, Mutation } from 'vuex-class'
  import { UiWidthCheckConstants } from '@/constant'
  import ThemeManager from '@/themes'
  import { Chrome } from 'vue-color'
  import * as _ from 'underscore'

  const themeColorNameToDataNameMap = {
    primaryColor: 'primaryColor',
    secondaryColor: 'secondaryColor',
    trackColor: 'placeholderTextColor',
    textColor: 'primaryTextColor',
    secondaryTextColor: 'secondaryTextColor',
    disabledColor: 'disabledColor',
    backgroundColor: 'primaryBGColor',
    dialogBackgroundColor: 'secondaryBGColor'
  }

  const colorPickPanelNameOrder = [
    'primaryColor', 'secondaryColor',
    'primaryTextColor', 'secondaryTextColor',
    'placeholderTextColor', 'disabledColor',
    'primaryBGColor', 'secondaryBGColor'
  ]

  @Component({
    components: {
      'chrome-picker': Chrome
    }
  })
  class ThemeEditPanel extends Vue {

    $refs: {
      colorCakes: any
    }

    $confirm

    $prompt

    @State('appStatus') appStatus

    @Getter('shouldDialogFullScreen') shouldDialogFullScreen

    @Mutation('updateIsEditingThemeMode') updateIsEditingThemeMode
    @Mutation('updateShouldShowThemeEditPanel') updateShouldShowThemeEditPanel
    @Mutation('updateTheme') updateTheme

    currentEditColorInfo = {
      label: '',
      value: ''
    }

    shouldOpenColorPickerPopOver: boolean = false

    primaryColor: string = ''

    secondaryColor: string = ''

    primaryTextColor: string = ''

    secondaryTextColor: string = ''

    placeholderTextColor: string = ''

    disabledColor: string = ''

    primaryBGColor: string = ''

    secondaryBGColor: string = ''

    triggerPopOverElem: any = null

    onSomeColorChangedListener = () => {}

    hasColorChanged: boolean = false

    mounted () {
      const currentThemeInfo = ThemeManager.getThemeInfoByThemeName(this.appStatus.settings.theme)

      this.initColorList(currentThemeInfo.theme.colorSet)

      this.onSomeColorChangedListener = _.throttle(() => {
        const currentColorSet = this.getCurrentColorSet()

        ThemeManager.setTempThemeByColorSet(currentColorSet)
      }, 20)
    }

    get colorPickPanelOrder () {
      return colorPickPanelNameOrder.map(colorName => {
        return { label: colorName, value: this[colorName] }
      })
    }

    get isDialogOpening () {
      return this.appStatus.shouldShowThemeEditPanel
    }

    set isDialogOpening (show) {
      this.updateShouldShowThemeEditPanel(show)
    }

    get transition () {
      return this.shouldDialogFullScreen ? 'slide-bottom' : 'slide-top'
    }

    get dialogWidth () {
      return this.shouldDialogFullScreen ? null : UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
    }

    @Watch('colorPickPanelOrder')
    onSomeColorChanged () {
      this.onSomeColorChangedListener()
    }

    getCurrentColorSet () {
      const colorSet = {}

      Object.keys(themeColorNameToDataNameMap).forEach(colorName => {
        colorSet[`@${colorName}`] = this[themeColorNameToDataNameMap[colorName]]
      })

      return colorSet
    }

    initColorList (colorSet) {
      Object.keys(themeColorNameToDataNameMap).forEach(colorName => {
        this[themeColorNameToDataNameMap[colorName]] = colorSet[`@${colorName}`]
      })
    }

    async onTryToCancelEdit () {
      if (this.hasColorChanged) {
        const doClosePanel = (await this.$confirm('Exit without save your editing?', {
          okLabel: 'Yes',
          cancelLabel: 'No',
        })).result

        if (doClosePanel) {
          ThemeManager.setTheme(this.appStatus.settings.theme)
          this.updateIsEditingThemeMode(false)
        }
      } else {
        this.updateIsEditingThemeMode(false)
      }
    }

    async onTryToSaveTheme () {
      this.$prompt('Please naming your new theme', 'Theme Name', {
        validator (value) {
          return {
            valid: !ThemeManager.themeInfo[value],
            message: 'theme name conflict'
          }
        }
      }).then(({ result, value }) => {
        if (result) {
          ThemeManager.importTheme(this.getCurrentColorSet(), value)
          this.updateTheme(value)
          ThemeManager.setTheme(value)
          this.updateIsEditingThemeMode(false)
        }
      })
    }

    onMinimizePanel () {
      this.isDialogOpening = false
    }

    onMaximisePanel () {
      this.isDialogOpening = true
    }

    onColorCakeClick (colorInfo, index) {
      this.triggerPopOverElem = this.$refs.colorCakes[index]
      this.currentEditColorInfo = colorInfo
      this.shouldOpenColorPickerPopOver = true
    }

    onColorPickerInput (val) {
      this.hasColorChanged = true
      this[this.currentEditColorInfo.label] = `rgba(${val.rgba.r}, ${val.rgba.g}, ${val.rgba.b}, ${val.rgba.a})`
    }

  }

  export default ThemeEditPanel
</script>

<style lang="less" scoped>
  .theme-edit-panel-container {

    .minimize-theme-edit-button {
      position: fixed;
      right: 16px;
      bottom: 16px;

      @media (min-width: 768px) {
        right: 32px;
        bottom: 32px;
      }
    }
  }

  .theme-edit-dialog {
    .color-select-area {
      padding: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .color-select-card {
        user-select: none;
        min-width: 240px;
        display: flex;
        height: 60px;
        padding: 14px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .color-info {
          height: 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .color-name {
            font-size: 16px;
            height: 16px;
            line-height: 16px;
          }

          .color-value {
            font-size: 10px;
            height: 20px;
            line-height: 14px;
            padding-top: 6px;

            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
        }

        .color-cake {
          height: 36px;
          width: 36px;
          box-sizing: border-box;
          border-radius: 100%;
          cursor: pointer;
          border: 1px solid #dadada;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
          position: relative;
        }
      }
    }
  }
</style>

<style lang="less">
  .theme-edit-dialog {
    border-radius: 4px;

    .mu-dialog-body {
      padding: 0;
      height: auto !important;
    }
  }
</style>
