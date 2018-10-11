<template>
  <div class="status-card-container">
    <mu-card class="status-card">
      <mu-card-header class="mu-card-header">
        <mu-avatar slot="avatar" size="34">
          <img src="https://lh3.googleusercontent.com/-0a0m1ci9jdY/AAAAAAAAAAI/AAAAAAAAo_8/T804d2CL_d8/s120-p-rw-no-il/photo.jpg">
        </mu-avatar>
        <a class="user-name">Nana Morse</a>
      </mu-card-header>
      <mu-card-title title="Content Title" sub-title="Content Title"></mu-card-title>
      <mu-card-text>
        散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。
        调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。
        似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光，
        找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！
      </mu-card-text>
      <mu-card-actions>
        <mu-button flat>Action 1</mu-button>
        <mu-button flat>Action 2</mu-button>
      </mu-card-actions>
    </mu-card>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {} from 'vuex-class'

  @Component({})
  class StatusCard extends Vue {

  }

  export default StatusCard
</script>

<style lang="scss" scoped>

  .status-card-container {
    margin: 16px 0;
  }

  .status-card {
    width: 100%;
    max-width: 498px;
    margin: 0 auto;
  }

  .mu-card-header {
    .user-name {
      font-size: 15px;
      color: rgba(0,0,0,.87);
      display: inline-block;
      vertical-align: top;
      white-space: normal;
      line-height: 34px;
    }
  }
</style>

<style lang="scss">
  .mu-card-header {
    line-height: 1;

    .mu-avatar {
      margin-right: 8px;
    }
  }

</style>
