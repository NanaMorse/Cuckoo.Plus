<template>
  <mu-drawer class="cuckoo-drawer default-theme-bg-color primary-read-text-color" :open.sync="appStatus.isDrawerOpened" :style="drawerStyle"
             :docked="shouldDrawerDocked" :z-depth="shouldDrawerDocked ? 0 : 16">

    <search />

    <mu-divider />

    <mu-list :value="currentListValue" toggle-nested>

      <mu-list-item button v-for="(info, index) in baseRouterInfoList"
                    :value="info.value"
                    :nested="!!info.hashList" :ripple="!info.hashList"
                    :key="index" @click="!info.hashList && onBaseRouteItemClick(info.value)">
        <mu-list-item-action>
          <mu-icon :value="info.icon"/>
        </mu-list-item-action>
        <mu-list-item-title>{{$t(info.title)}}</mu-list-item-title>

        <mu-list-item-action v-if="!!info.hashList">
          <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down" />
        </mu-list-item-action>

        <mu-list-item class="hash-list-item" v-if="info.hashList" slot="nested" button
                      v-for="(hashName, index) in info.hashList"
                      :value="info.to + '/' + hashName"
                      :key="index" @click="onHashRouteItemClick(info.value, hashName)">
          <mu-list-item-title># {{hashName}}</mu-list-item-title>
          <mu-list-item-action>
            <mu-button class="delete-hash-btn" icon @click.stop="onDeleteHash(hashName)">
              <mu-icon value="delete" />
            </mu-button>
          </mu-list-item-action>
        </mu-list-item>

      </mu-list-item>

    </mu-list>

    <mu-divider />

    <mu-list class="secondary-list">
      <mu-list-item button :to="$routersInfo.settings.path" @click="onSecondaryItemClick">
        <mu-list-item-title class="secondary-read-text-color">{{$t($i18nTags.drawer.settings)}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>

    <div class="bottom-info-area secondary-read-text-color">
      <div style="margin-bottom: 6px">
        <a class="secondary-read-text-color">©2018 Cuckoo</a>
        •
        <a class="secondary-read-text-color" href="https://github.com/NanaMorse/Cuckoo.Plus" target="_blank">Github</a>
      </div>
      <a class="secondary-read-text-color" :href="mastodonServerUri" target="_blank">{{$t($i18nTags.drawer.toHostInstance)}}</a>
    </div>

  </mu-drawer>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { State, Mutation, Action } from 'vuex-class'
  import { isBaseTimeLine } from '@/util'
  import { TimeLineTypes, UiWidthCheckConstants, RoutersInfo, I18nTags } from '@/constant'
  import Search from './Search'

  const baseRouterInfoList = [
    {
      value: TimeLineTypes.HOME,
      title: I18nTags.drawer.home,
      icon: 'home',
      to: '/timelines/home'
    },
    {
      value: TimeLineTypes.PUBLIC,
      title: I18nTags.drawer.public,
      icon: 'public',
      to: '/timelines/public'
    },
    {
      value: TimeLineTypes.TAG,
      title: I18nTags.drawer.tag,
      icon: 'loyalty',
      to: '/timelines/tag',
      hashList: ['kimermark']
    },
    {
      value: 'profile',
      title: I18nTags.drawer.profile,
      icon: 'person',
      to: ''
    }
  ]

  @Component({
    components: {
      'search': Search
    }
  })
  class Drawer extends Vue {

    $route

    $router

    $progress

    $toast

    @State('appStatus') appStatus

    @State('mastodonServerUri') mastodonServerUri

    @State('currentUserAccount') currentUserAccount

    @Mutation('updateDrawerOpenStatus') updateDrawerOpenStatus

    @Mutation('updateTags') updateTags

    @Action('updateTimeLineStatuses') updateTimeLineStatuses

    @Watch('shouldDrawerDocked')
    onShouldDrawerDockedChanged () {
      if (!this.shouldDrawerDocked && this.appStatus.isDrawerOpened) {
        this.updateDrawerOpenStatus(false)
      }
    }

    get shouldDrawerDocked () {
      return this.appStatus.documentWidth > UiWidthCheckConstants.DRAWER_DOCKING_BOUNDARY
    }

    get baseRouterInfoList () {
      // @ts-ignore
      baseRouterInfoList.find(info => info.value === TimeLineTypes.TAG).hashList = this.appStatus.settings.tags

      return baseRouterInfoList
    }

    get drawerStyle () {
      if (this.shouldDrawerDocked) {
        return {
          top: '64px',
          width: `${UiWidthCheckConstants.DRAWER_DESKTOP_WIDTH}px`
        }
      } else {
        return {
          width: '300px'
        }
      }
    }

    get currentListValue () {
      if (this.$route.name === RoutersInfo.tagtimelines.name) {
        return this.$route.path
      } else {
        const currentRouterInfo = baseRouterInfoList.find(routerInfo => routerInfo.to === this.$route.path)

        if (currentRouterInfo) return currentRouterInfo.value
      }
    }

    async onBaseRouteItemClick (clickedRouterValue: string) {

      if (clickedRouterValue === 'profile') {
        return window.open(this.currentUserAccount.url, '_blank')
      }

      const targetPath = baseRouterInfoList.find(routerInfo => routerInfo.value === clickedRouterValue).to

      if (isBaseTimeLine(clickedRouterValue) && (targetPath === this.$route.path)) {
        this.fetchTimeLineStatuses(clickedRouterValue)
      }

      if (!this.shouldDrawerDocked) this.updateDrawerOpenStatus(false)

      this.$router.push(targetPath)

      window.scrollTo(0, 0)
    }

    async onHashRouteItemClick (clickedRouterValue: string, hashName: string) {
      const targetPath = baseRouterInfoList.find(routerInfo => routerInfo.value === clickedRouterValue).to + '/' + hashName

      if (targetPath === this.$route.path) {
        this.fetchTimeLineStatuses(clickedRouterValue, hashName)
      }

      if (!this.shouldDrawerDocked) this.updateDrawerOpenStatus(false)

      this.$router.push(targetPath)

      window.scrollTo(0, 0)
    }

    onSecondaryItemClick () {
      if (!this.shouldDrawerDocked) this.updateDrawerOpenStatus(false)
      window.scrollTo(0, 0)
    }

    onDeleteHash (hashName: string) {
      // todo only tag has hash now
      const newTags = [...this.appStatus.settings.tags]
      newTags.splice(newTags.indexOf(hashName as any), 1)

      this.updateTags(newTags)
    }

    /**
     * @desc if clicked timeline item is just current timeline
     * */
    async fetchTimeLineStatuses (timeLineType: string, hashName: string = '') {
      this.$progress.start()
      await this.updateTimeLineStatuses({
        isFetchMore: true,
        timeLineType, hashName
      })

      this.$progress.done()
    }

    onOpenHostInstance () {
      window.open(this.mastodonServerUri, '_blank');
    }
  }

  export default Drawer
</script>

<style lang="less" scoped>
  .cuckoo-drawer {
    .hash-list-item {

      .delete-hash-btn {
        display: none;
      }

      &:hover {

        .delete-hash-btn {
          display: unset;
        }

      }
    }

    .bottom-info-area {
      position: absolute;
      bottom: 0;
      margin: 0 0 24px 24px;
      font-size: 13px;
    }
  }

</style>

<style lang="less">
  @import "../../assets/variable";

  .cuckoo-drawer {
    background: url("https://i.imgur.com/vKv5bn5.png") no-repeat left bottom;
    background-size: 42%;

    .mu-item-wrapper {
      -webkit-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -moz-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -ms-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      -o-transition: background-color .3s cubic-bezier(0,0,0.2,1);
      transition: background-color .3s cubic-bezier(0,0,0.2,1);
    }

    .toggle-icon {
      transform: rotate(0);
      transition: transform .3s cubic-bezier(.23,1,.32,1),-webkit-transform .3s cubic-bezier(.23,1,.32,1)
    }

    .mu-item__open .toggle-icon {
      transform: rotate(180deg);
    }
  }
</style>
