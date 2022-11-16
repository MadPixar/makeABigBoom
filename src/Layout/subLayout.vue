<template>
  <div class="outer">
    <!-- <keep-alive :max="10" exclude="ProjectLibraryDetails,项目库案卷详情"> -->
    <!-- <router-view :key="$route.fullPath"></router-view> -->
    <!-- <router-view v-if="!routerShow" :key="fullPath.split('#')[0]"></router-view> -->
    <!-- <keep-alive :max="10">
      <router-view :key="fullPath.split('#')[0]"></router-view>
    </keep-alive> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator'
// import qs from 'qs'

@Component({
  name: 'SubLayout'
})
export default class SubLayout extends Vue {
  @Inject() appConfig!: any

  get fullPath() {
    return this.$route.fullPath
  }
}
</script>
<style lang="scss">
.ws-msg-notify {
  cursor: pointer;
  width: 400px;
  .el-notification__content {
    text-align: left;
  }
}
</style>
<style lang="scss" scoped>
.outer {
  height: 100%;
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
</style>
