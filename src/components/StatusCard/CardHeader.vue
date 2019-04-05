<template>
  <mu-card-header class="mu-card-header" ref="cardHeader"
                  @mouseover="shouldShowHeaderActionButtonGroup = true"
                  @mouseout="shouldShowHeaderActionButtonGroup = false">
    <div class="left-area" :style="leftAreaStyle">
      <mu-avatar @click="onCheckUserAccountPage" class="status-account-avatar" slot="avatar" size="34">
        <img :src="status.account.avatar">
      </mu-avatar>
      <div class="user-and-status-info">
        <a @click="onCheckUserAccountPage" class="user-name primary-read-text-color">
          <span class="display-name" v-html="getAccountDisplayName(status.account)"></span>
          <span class="at-name secondary-read-text-color">@{{getAccountAtName(status.account)}}</span>
        </a>
        <div ref="visibilityInfo" class="visibility-row secondary-read-text-color">
          <div class="arrow-container">
            <svg viewBox="0 0 48 48" height="100%" width="100%">
              <path class="header-svg-fill" d="M20 14l10 10-10 10z" />
            </svg>
          </div>
          <div class="visibility-info secondary-read-text-color">{{$t(status.visibility)}}</div>
        </div>
      </div>
    </div>

    <div class="right-area" ref="rightArea" v-if="isOAuthUser">
      <span v-show="!shouldOpenMoreOperationPopOver && !shouldShowHeaderActionButtonGroup" class="status-from-now secondary-read-text-color">{{getFromNowTime(status.created_at)}}</span>

      <div v-show="shouldOpenMoreOperationPopOver || shouldShowHeaderActionButtonGroup" class="card-header-action">
        <mu-icon class="header-icon secondary-read-text-color" value="open_in_new" @click="onCheckStatusInSinglePage"/>
        <mu-icon class="header-icon secondary-read-text-color" value="more_vert" ref="moreOperationTriggerBtn"
                 @click="shouldOpenMoreOperationPopOver = true"/>
      </div>
    </div>

    <mu-popover v-if="isOAuthUser" cover placement="left-start"
                :open.sync="shouldOpenMoreOperationPopOver"
                :trigger="moreOperationTriggerBtn">
      <mu-list>
        <mu-list-item button @click.stop="onMuteStatus">
          <mu-list-item-title>{{$t($i18nTags.statusCard.mute_status)}}</mu-list-item-title>
        </mu-list-item>
        <mu-list-item button v-if="currentUserAccount.id === status.account.id"
                      @click.stop="onDeleteStatusByOperateList">
          <mu-list-item-title>{{$t($i18nTags.statusCard.delete_status)}}</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-popover>

  </mu-card-header>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Getter, State, Action } from 'vuex-class'
  import * as moment from 'moment'
  import { mastodonentities } from '@/interface'

  @Component({})
  class CardHeader extends Vue {

    @Prop() status: mastodonentities.Status

    $router

    $routersInfo

    $confirm

    $t

    $i18nTags

    $refs: {
      cardHeader: HTMLDivElement
      visibilityInfo: any
      rightArea: HTMLDivElement
      moreOperationTriggerBtn: any
    }

    @Getter('getAccountDisplayName') getAccountDisplayName
    @Getter('getAccountAtName') getAccountAtName
    @Getter('isOAuthUser') isOAuthUser

    @State('currentUserAccount') currentUserAccount: mastodonentities.AuthenticatedAccount

    @Action('deleteStatus') deleteStatus

    shouldShowHeaderActionButtonGroup = false

    shouldOpenMoreOperationPopOver = false

    moreOperationTriggerBtn: any = null

    leftAreaStyle = null

    mounted () {
      if (this.isOAuthUser) {
        this.moreOperationTriggerBtn = this.$refs.moreOperationTriggerBtn
      }

      this.setLeftAreaStyle()
    }

    onOpenMoreOperationPopOver () {
      this.shouldOpenMoreOperationPopOver = true
    }

    onCheckUserAccountPage () {
      window.open(this.status.account.url, "_blank")
    }

    onCheckStatusInSinglePage () {
      this.$router.push({
        name: this.$routersInfo.statuses.name,
        params: {
          statusId: this.status.id
        }
      })
    }

    async onDeleteStatusByOperateList () {
      const targetStatusId = this.status.id

      const doDeleteStatus = (await this.$confirm(this.$t(this.$i18nTags.statusCard.delete_status_confirm), {
        okLabel: this.$t(this.$i18nTags.statusCard.do_delete_status_btn),
        cancelLabel: this.$t(this.$i18nTags.statusCard.cancel_delete_status_btn),
      })).result
      if (doDeleteStatus) {
        this.$emit('deleteStatus')
        await this.deleteStatus({ statusId: targetStatusId })
      }
    }

    onMuteStatus () {}

    getFromNowTime (createdAt: string) {
      return moment(createdAt).fromNow(true)
    }

    setLeftAreaStyle () {
      const headerPadding = 16 * 2
      const rightAreaWidth = Math.max(60, this.$refs.rightArea.clientWidth)

      this.leftAreaStyle = {
        maxWidth: `${this.$refs.cardHeader.clientWidth - headerPadding - rightAreaWidth}px`
      }
    }
  }

  export default CardHeader
</script>

<style lang="less" scoped>
  .mu-card-header {
    line-height: 1;
    display: flex;
    justify-content: space-between;

    .left-area {
      display: flex;
      align-items: center;

      .status-account-avatar {
        margin-right: 8px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .user-and-status-info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        max-width: calc(100% - 34px - 8px);

        .user-name {
          cursor: pointer;
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
        }

        .visibility-row {
          display: flex;
          align-items: center;

          .arrow-container {
            width: 18px;
            height: 18px;
          }

          .visibility-info {
            cursor: pointer;
          }
        }

      }

    }

    .right-area {
      display: flex;
      align-items: center;

      .status-from-now {
        font-size: 13px;
        font-weight: 400;
      }

      .card-header-action {
        .header-icon {
          cursor: pointer;
          font-size: 18px;
          margin-left: 10px;
        }
      }
    }
  }
</style>
