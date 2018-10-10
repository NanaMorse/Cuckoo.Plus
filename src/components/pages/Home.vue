<template>
  <div>
    <h1>You have got the access token!</h1>
  </div>
</template>

<script lang="ts">
  import { State } from 'vuex-class'
  import { Vue, Component } from 'vue-property-decorator'

  @Component({})
  class Home extends Vue {

    @State('OAuthInfo') OAuthInfo: cuckoostore.OAuthInfo

    mounted () {

    }

    
  }

  export default Home
</script>

<style lang="scss">

</style>
