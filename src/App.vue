<template>
  <div id="app">
    <cuckoo-plus-header v-if="shouldShowHeader"/>
    <mu-container>
      <mu-container>
        <router-view />
      </mu-container>
      <mu-drawer :open.sync="appStatus.isDrawerOpened" :docked="false">
        <mu-list>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="home"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Home</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="group"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>People</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="account_circle"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Profile</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button>
            <mu-list-item-action>
              <mu-icon value="notifications"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>Notifications</mu-list-item-title>
          </mu-list-item>
        </mu-list>
        <mu-divider></mu-divider>
        <mu-list>
          <mu-list-item button>
            <mu-list-item-title>Settings</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-drawer>
    </mu-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State } from 'vuex-class'
  import Header from '@/components/Header.vue'

  @Component({
    components: {
      'cuckoo-plus-header': Header
    }
  })
  class App extends Vue {

    @State('appStatus') appStatus

    get shouldShowHeader () {
      // @ts-ignore
      return this.$route.name !== this.$routersInfo.oauth.name
    }

  }

  export default App
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
  @import "assets/common";

  body {
    height: 100%;
    background-color: #f2f2f2;
  }

  .container {
    padding: 0;
  }
</style>
