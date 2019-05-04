<template>
  <div class="account-header" :style="{ backgroundImage: `url(${profileCoverImageSrc})` }">
    <div class="user-info-area">
      <div class="left-area">
        <mu-avatar class="account-avatar" slot="avatar" size="34">
          <img :src="account.avatar">
        </mu-avatar>
      </div>
      <div class="right-area"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {  } from 'vuex-class'
  import { mastodonentities } from "@/interface"

  const defaultUserProfileCover = 'https://lh3.googleusercontent.com/c5dqxl-2uHZ82ah9p7yxrVF1ZssrJNSV_15Nu0TUZwzCWqmtoLxCUJgEzLGtxsrJ6-v6R6rKU_-FYm881TTiMCJ_=w530-h298-n-rw-no'

  @Component({})
  class AccountHeader extends Vue {

    $route

    @Prop() account: mastodonentities.Account

    get profileCoverImageSrc () {
      return this.account.header.endsWith('missing.png') ? defaultUserProfileCover : this.account.header
    }
  }

  export default AccountHeader
</script>

<style lang="less" scoped>
  .account-header {
    width: 100%;
    margin: 0 auto;
    background-size: cover;
    background-position: 50%;
  }

  @media (min-width: 0px){
    .account-header {
      height: 280px;
      max-width: 530px;
    }
  }

  @media (min-width: 1024px) {
    .account-header {
      height: 380px;
      max-width: 1084px;
      box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);
      border-radius: 2px;
      overflow: hidden;
    }
  }

</style>
