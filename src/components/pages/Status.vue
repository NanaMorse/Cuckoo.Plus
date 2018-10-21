<template>
  <div class="status-cards-container">
    <status-card v-if="!isLoading" :status="status"/>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { mastodonentities } from '@/interface'
  import StatusCard from '@/components/StatusCard.vue'
  import * as api from '@/api'

  @Component({
    components: {
      'status-card': StatusCard,
    }
  })
  class Status extends Vue {

    $route;

    isLoading: boolean = false

    status: mastodonentities.Status

    get statusId (): string {
      return this.$route.params.statusId
    }

    async mounted () {
      this.loadStatus()
    }

    async loadStatus () {
      this.isLoading = true
      this.status = (await api.statuses.getStatusById(this.statusId)).data
      this.isLoading = false
    }
  }

  export default Status
</script>