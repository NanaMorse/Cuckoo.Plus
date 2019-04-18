<template>
  <div class="theme-edit-panel-container">
    <mu-dialog :open.sync="isDialogOpening" overlay-color="rgba(0,0,0,0.12)"
               dialog-class="theme-edit-dialog" :width="dialogWidth"
               :overlay-opacity="1" :transition="transition" :fullscreen="shouldDialogFullScreen">

      <mu-appbar color="primary">
        <mu-button slot="left" icon>
          <mu-icon value="close" />
        </mu-button>
        <mu-button slot="right" flat>

        </mu-button>
      </mu-appbar>

      <div class=""></div>

    </mu-dialog>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Getter } from 'vuex-class'
  import { UiWidthCheckConstants } from '@/constant'

  @Component({})
  class ThemeEditPanel extends Vue {

    @Getter('shouldDialogFullScreen') shouldDialogFullScreen

    isDialogOpening: boolean = true

    get transition () {
      return this.shouldDialogFullScreen ? 'slide-bottom' : 'slide-top'
    }

    get dialogWidth () {
      return this.shouldDialogFullScreen ? null : UiWidthCheckConstants.POST_STATUS_DIALOG_TOGGLE_WIDTH
    }

  }

  export default ThemeEditPanel
</script>

<style lang="less" scoped>

</style>

<style lang="less">
  .theme-edit-dialog {
    border-radius: 4px;

    .mu-dialog-body {
      padding: 0;
    }
  }
</style>
