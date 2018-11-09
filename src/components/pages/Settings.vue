<template>
  <div class="setting-page-container">
    <mu-card>
      <mu-card-actions class="setting-card">
        <p class="card-label">常规</p>

        <div class="setting-row select-row">
          <span class="setting-label primary-read-text-color">选择主题：</span>
          <mu-select class="setting-select" v-model="themeName">
            <mu-option v-for="(themeInfo, index) in themeOptions" :key="index"
                       :label="themeInfo.label" :value="themeInfo.value" />
          </mu-select>
        </div>

        <div class="setting-row">
          <span class="setting-label primary-read-text-color">是否使用多行布局模式：</span>
          <mu-switch class="setting-switch" v-model="multiLineMode" />
        </div>

      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { ThemeNames } from '@/constant'

  @Component({})
  class Setting extends Vue {

    @State('appStatus') appStatus

    @Mutation('updateTheme') updateTheme

    @Mutation('updateMultiLineMode') updateMultiLineMode

    themeOptions = [
      { label: 'Google Plus', value: ThemeNames.GOOGLE_PLUS },
      { label: 'Dark', value: ThemeNames.DARK }
    ]

    get themeName (): string {
      return this.appStatus.settings.theme
    }

    set themeName (val) {
      this.updateTheme(val)
    }

    get multiLineMode () {
      return this.appStatus.settings.multiLineMode
    }

    set multiLineMode (val) {
      this.updateMultiLineMode(val)
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
