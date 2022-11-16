<template>
  <el-container class="fill-height">
    <el-header class="el-px-0 topNavbar" height="52px">
      <SubSystemHeader></SubSystemHeader>
    </el-header>
    <div class="subsystem-container el-flex el-flex-row">
      <el-aside class="sidebar" :width="isExpend ? '256px' : '80px'">
        <SubSystemAside></SubSystemAside>
      </el-aside>
      <el-main class="el-flex el-flex-column el-pa-0" v-loading="loading" :element-loading-text="loadingText">
        <div class="topTagViews">
          <TagViews></TagViews>
        </div>
        <keep-alive :key="$route.fullPath">
          <router-view :key="$route.fullPath" class="el-flex-grow"></router-view>
        </keep-alive>
      </el-main>
    </div>
    <RightPanel v-show="show">
      <CollectList v-if="typeNum === 2" />
      <ThemSetting v-else />
    </RightPanel>
  </el-container>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SubSystemHeader from '@/Layout/subSystem/subSystemHeader.vue'
import SubSystemAside from '@/Layout/subSystem/subSystemAside.vue'
import TagViews from '../tagViews.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import ThemSetting from '../themSetting.vue'
import CollectList from '../collectList.vue'

import { SettingsModule } from '@/store/modules/settings'
import { CollectModule } from '@/store/modules/collect'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'SubsystemLayout',
  components: {
    SubSystemHeader,
    SubSystemAside,
    RightPanel,
    ThemSetting,
    CollectList,
    TagViews
  }
})
export default class SubsystemLayout extends Vue {
  get loading() {
    return SettingsModule.loading
  }
  get loadingText() {
    return SettingsModule.loadingText
  }
  get show() {
    return SettingsModule.showRightPanel
  }
  get typeNum() {
    return SettingsModule.typeNum || CollectModule.pageType
  }
  get systemName() {
    return this.$route.query.sysName
  }
  get symbol() {
    return this.$route.params.symbol
  }
  get isExpend() {
    return AppModule.collapse
  }
}
</script>
<style scoped lang="scss">
.sidebar {
  box-shadow: 1px 0px 2px 0px rgba(58, 58, 68, 0.2), 2px 0px 4px 0px rgba(90, 91, 106, 0.2);
  overflow: hidden;
}
.topNavbar {
  box-shadow: 0 2px 4px 0 rgb(90 91 106 / 20%), 0 1px 2px 0 rgb(58 58 68 / 20%);
  position: relative;
  z-index: 2;
}

.topTagViews {
  flex-shrink: 0;
}
.subsystem-container {
  height: calc(100% - 52px);
}
</style>
