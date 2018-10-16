<template>
  <mu-drawer :open.sync="appStatus.isDrawerOpened" :docked="false">
    <mu-list :value="currentListValue">
      <mu-list-item button v-for="(info, index) in baseTimeLineInfoList" :value="info.value"
                    :key="index" :to="info.to" @click="updateIsDrawerOpened(false)">
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
  import { TimeLineTypes } from '@/constant'

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

    @Mutation('updateIsDrawerOpened') updateIsDrawerOpened

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

</style>
