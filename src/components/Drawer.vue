<template>
  <mu-drawer class="cuckoo-drawer" :open.sync="appStatus.isDrawerOpened" :style="drawerStyle"
             :docked="shouldDrawerDocked" :z-depth="shouldDrawerDocked ? 0 : 16">
    <mu-list :value="currentListValue">
      <mu-list-item button v-for="(info, index) in baseTimeLineInfoList" :value="info.value"
                    :key="index" :to="info.to" @click="!shouldDrawerDocked && updateDrawerOpenStatus(false)">
        <mu-list-item-action>
          <mu-icon :value="info.icon" />
        </mu-list-item-action>
        <mu-list-item-title>{{info.title}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>

    <mu-divider></mu-divider>

    <mu-list>
      <mu-list-item button>
        <mu-list-item-title>Settings</mu-list-item-title>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import { State, Mutation } from 'vuex-class'
  import { getTimeLineTypeAndHashName, isBaseTimeLine } from '@/util'
  import { TimeLineTypes, UiWidthCheckConstants } from '@/constant'

  const baseTimeLineInfoList = [
    {
      value: TimeLineTypes.HOME,
      title: 'Home',
      icon: 'home',
      to: '/timelines/home'
    },
    {
      value: TimeLineTypes.PUBLIC,
      title: 'Public',
      icon: 'public',
      to: '/timelines/public'
    }
  ]

  @Component({})
  class Drawer extends Vue {

    @State('appStatus') appStatus

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    get shouldDrawerDocked () {
      return this.appStatus.documentWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY
    }

    get drawerStyle () {
      if (this.shouldDrawerDocked) {
        return {
          top: '64px',
          backgroundColor: '#f2f2f2'
        }
      }
    }

    get currentListValue () {
      // @ts-ignore
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      if (isBaseTimeLine(timeLineType)) {
        return timeLineType
      } else {
        return `${timeLineType}/${hashName}`
      }
    }

    baseTimeLineInfoList = baseTimeLineInfoList
  }

  export default Drawer
</script>

<style lang="scss">
  @import "../assets/variable";

  .cuckoo-drawer {
    .mu-item.is-selected {
      color: $common_google_plus_red_color;

      .material-icons {
        color: $common_google_plus_red_color;
      }
    }
  }
</style>
