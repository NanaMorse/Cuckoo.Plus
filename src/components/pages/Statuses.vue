<template>
  <div class="statuses-page-container" v-loading="!status">
    <status-card v-if="status" :status="status"/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { State, Action } from 'vuex-class'
  import { mastodonentities } from '@/interface'
  import StatusCard from '@/components/StatusCard.vue'
  import * as api from '@/api'

  @Component({
    components: {
      'status-card': StatusCard,
    }
  })
  class Statuses extends Vue {

    $route

    @Action('fetchStatusById') fetchStatusById

    @State('statusMap') statusMap: {
      [statusId: string]: mastodonentities.Status
    }

    get status (): mastodonentities.Status {
      return this.statusMap[this.$route.params.statusId]
    }

    mounted () {
      if (!this.status) {
        this.fetchStatusById(this.$route.params.statusId)
      }
    }
  }

  export default Statuses
</script>

<style lang="scss" scoped>
  .statuses-page-container {
    max-width: 530px;
    margin: 16px auto;
  }
</style>