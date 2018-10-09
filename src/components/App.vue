<template>
  <div>
    <!-- todo add vue i18n -->
    <h1>Please input the mastodon server which you want to join in..</h1>

    <el-input placeholder="https://pawoo.net" :value="mastodonServer"/>

    <el-button class="submit-server-name-btn" @click="onSubmitServerName">Submit</el-button>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { postClientInfo } from '@/api'

  // the first step, ask for mastodon OAuth Access token
  // and store this token

  @Component({})
  class App extends Vue {

    mastodonServer: string = 'https://pawoo.net';

    async onSubmitServerName () {
      const result = await postClientInfo(this.mastodonServer)
    }
  }

  export default App
</script>

<style lang="scss" scoped>
  .submit-server-name-btn {
    // todo don't use px
    margin-top: 20px;
  }
</style>