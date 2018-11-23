<template>
  <mu-list tabindex="0" ref="list"
           class="at-account-search-result-list dialog-theme-bg-color"
           :style="listStyle">
    <mu-list-item avatar button :ripple="false" :key="index"
                  @hover="currentSelectedResultIndex = index"
                  :class="{ 'active': currentSelectedResultIndex === index }"
                  v-for="(account, index) in data">
      <mu-list-item-action>
        <mu-avatar>
          <img :src="account.avatar_static">
        </mu-avatar>
      </mu-list-item-action>
      <mu-list-item-title v-html="formatAccountDisplayName(account)" />
    </mu-list-item>
  </mu-list>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import {} from 'vuex-class'
  import { formatAccountDisplayName } from '@/util'
  import { mastodonentities } from '@/interface'

  @Component({})
  class AccountSearchList extends Vue {

    $refs: {
      list: {
        $el: HTMLUListElement
      }
    }

    @Prop() data

    @Prop() listStyle

    currentSelectedResultIndex: number = 0

    formatAccountDisplayName = formatAccountDisplayName

    mounted () {

    }
  }

  export default AccountSearchList
</script>

<style lang="less" scoped>
  .at-account-search-result-list {
    width: 100%;
    max-height: 216px;
    position: absolute;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.26);
    z-index: 1;
    outline: none;
  }
</style>

<style lang="less">
  .at-account-search-result-list .active > a {
    background-color: rgba(0,0,0,.1);
  }
</style>