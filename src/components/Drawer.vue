<template>
  <mu-drawer class="cuckoo-drawer default-theme-bg-color primary-read-text-color" :open.sync="appStatus.isDrawerOpened" :style="drawerStyle"
             :docked="shouldDrawerDocked" :z-depth="shouldDrawerDocked ? 0 : 16">

    <mu-list :value="currentListValue">
      <mu-list-item button v-for="(info, index) in baseTimeLineInfoList" :value="info.value"
                    :key="index" @click="onTimeLineItemClick(info.value)">
        <mu-list-item-action>
          <mu-icon :value="info.icon"/>
        </mu-list-item-action>
        <mu-list-item-title>{{info.title}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>

    <mu-divider></mu-divider>

    <mu-list class="secondary-list">
      <mu-list-item button :to="$routersInfo.settings.path" @click="onSecondaryItemClick">
        <mu-list-item-title>Settings</mu-list-item-title>
      </mu-list-item>
    </mu-list>

  </mu-drawer>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action } from 'vuex-class'
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

    $route

    $router

    $progress

    $toast

    @State('appStatus') appStatus

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    baseTimeLineInfoList = baseTimeLineInfoList

    @Watch('shouldDrawerDocked')
    onShouldDrawerDockedChanged () {
      if (!this.shouldDrawerDocked && this.appStatus.isDrawerOpened) {
        this.updateDrawerOpenStatus(false)
      }
    }

    get shouldDrawerDocked () {
      return this.appStatus.documentWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY
    }

    get drawerStyle () {
      if (this.shouldDrawerDocked) {
        return {
          top: '64px',
          width: '210px'
        }
      } else {
        return {
          width: '300px'
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

    async onTimeLineItemClick (clickedTypeLineType: string, clickedHashName: string = '') {
      const { timeLineType, hashName } = getTimeLineTypeAndHashName(this.$route)

      if ((clickedTypeLineType === timeLineType) && (hashName === clickedHashName)) {
        this.fetchTimeLineStatuses(timeLineType, hashName)
      }

      // route to target
      const targetPath = '/timelines/' +
        (isBaseTimeLine(clickedTypeLineType) ? clickedTypeLineType : `${clickedTypeLineType}/${clickedHashName}`)

      this.$router.push(targetPath)

      if (!this.shouldDrawerDocked) this.updateDrawerOpenStatus(false)

      window.scrollTo(0, 0)
    }

    onSecondaryItemClick () {
      if (!this.shouldDrawerDocked) this.updateDrawerOpenStatus(false)
      window.scrollTo(0, 0)
    }

    /**
     * @desc if clicked timeline item is just current timeline
     * */
    async fetchTimeLineStatuses (timeLineType: string, hashName: string = '') {
      this.$progress.start()
      const result = await this.updateTimeLineStatuses({
        isFetchMore: true,
        timeLineType, hashName
      })

      if (!result.data.length) {
        this.$toast.info({
          message: '没有更多了',
          position: 'top'
        });
      }

      this.$progress.done()
    }
  }

  export default Drawer
</script>

<style lang="less">
  @import "../assets/variable";

  .cuckoo-drawer {
    .mu-item-wrapper {
      -webkit-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -moz-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -ms-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -o-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      transition: background-color .3s cubic-bezier(0,0,0.2,1);
    }
  }
</style>
