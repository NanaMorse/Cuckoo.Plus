<template>
  <div class="search-area-container">
    <div class="search-bar">
      <mu-icon value="search" style="margin-right: 10px"/>
      <mu-auto-complete class="search-input" v-model="searchKey" :max-search-results="5" avatar>
        <!--<template slot-scope="scope">-->
          <!--<mu-list-item-action>-->
            <!--<mu-avatar color="primary">-->
              <!--{{scope.item.substring(0, 1)}}-->
            <!--</mu-avatar>-->
          <!--</mu-list-item-action>-->
          <!--<mu-list-item-content v-html="scope.highlight"></mu-list-item-content>-->
        <!--</template>-->
      </mu-auto-complete>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import * as Api from '@/api'

  @Component({})
  class Search extends Vue {

    searchKey: string = ''


  }

  export default Search
</script>

<style lang="less" scoped>
  .search-area-container {
    .search-bar {
      display: flex;
      align-items: center;
      height: 68px;
      padding: 0 16px;

      .search-input {
        min-height: unset;
        margin: 0;
        padding: 0;
      }
    }
  }
</style>

<style lang="less">
  .search-area-container {
    .search-input {
      .mu-input-line, .mu-input-focus-line {
        display: none;
      }
    }
  }
</style>
