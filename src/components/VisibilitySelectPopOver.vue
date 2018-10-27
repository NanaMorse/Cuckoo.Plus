<template>
  <mu-popover cover :open.sync="shouldOpen"
              :trigger="trigger">
    <mu-list textline="two-line">
      <mu-list-item button v-for="(visibilityType, index) in VisibilityTypeList"
                    :class="{ 'selected-item': visibilityType === visibility }"
                    :key="index" @click="onChangeVisibility(visibilityType)">
        <mu-list-item-action>
          <mu-icon :value="getVisibilityDescInfo(visibilityType).icon"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-content>
          <mu-list-item-title class="primary-read-text-color">{{$t(visibilityType)}}</mu-list-item-title>
          <mu-list-item-sub-title class="secondary-read-text-color">{{$t(getVisibilityDescInfo(visibilityType).descTag)}}</mu-list-item-sub-title>
        </mu-list-item-content>
      </mu-list-item>
    </mu-list>
  </mu-popover>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { VisibilityTypes } from '@/constant'
  import { getVisibilityDescInfo } from '@/util'

  @Component({})
  class VisibilitySelectPopOver extends Vue {

    @Prop() visibility: string

    @Prop() open: boolean

    @Prop() trigger: HTMLElement

    getVisibilityDescInfo = getVisibilityDescInfo

    VisibilityTypeList = [
      VisibilityTypes.PUBLIC, VisibilityTypes.PRIVATE,
      VisibilityTypes.UNLISTED, VisibilityTypes.DIRECT
    ]

    get shouldOpen () {
      return this.open
    }

    set shouldOpen (open) {
      this.$emit('update:open', open)
    }

    onChangeVisibility (newVisibility: string) {
      this.shouldOpen = false
      this.$emit('update:visibility', newVisibility)
    }
  }

  export default VisibilitySelectPopOver
</script>

<style lang="less" scoped>

</style>