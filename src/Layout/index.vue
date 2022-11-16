<template>
  <div class="elLayout" v-loading="loading" :element-loading-text="loadingText">
    <div class="topNavbar" v-if="!routeParams.hideNav">
      <Navbar />
    </div>
    <div class="centerContent" :class="{ 'fill-height': routeParams.hideNav }">
      <div class="leftSidebar">
        <SidebarNew></SidebarNew>
      </div>
      <div class="rightContent">
        <div class="topTagViews">
          <TagViews></TagViews>
        </div>
        <div class="mainContent">
          <keep-alive
            :key="$route.fullPath"
            exclude="NoKeepAlive,DuchaHome,DuchaDetail,WorkPlanDetail,NoticeDetail,TrainedDetail"
          >
            <router-view :key="$route.fullPath"></router-view>
          </keep-alive>
        </div>
      </div>
    </div>
    <RightPanel v-show="show">
      <collect-list v-if="typeNum === 2" />
      <them-setting v-else />
    </RightPanel>
    <LoginDialog v-if="loginExpire"></LoginDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from './navbar.vue'
import SidebarNew from './sidebarNew.vue'
import TagViews from './tagViews.vue'
import RightPanel from '@/components/RightPanel/index.vue'
import themSetting from './themSetting.vue'
import collectList from './collectList.vue'
import { SettingsModule } from '@/store/modules/settings'
import { CollectModule } from '@/store/modules/collect'
import { UserModule } from '@/store/modules/user'
import { OneMapModule } from '@/store/modules/oneMap'
import LoginDialog from '@/views/login/indexDialog.vue'
// import Socket from './socket'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import { modelConfig } from '@/api/login'
import Cookies from 'js-cookie'
import { cookies } from '@/utils/cookies'

@Component({
  name: 'BaseLayout',
  components: {
    Navbar,
    TagViews,
    RightPanel,
    themSetting,
    SidebarNew,
    collectList,
    LoginDialog
  }
})
export default class BaseLayout extends Vue {
  private routeParams: any = {}
  get show() {
    return SettingsModule.showRightPanel
  }
  get typeNum() {
    return SettingsModule.typeNum || CollectModule.pageType
  }
  get loading() {
    return SettingsModule.loading
  }
  get loadingText() {
    return SettingsModule.loadingText
  }
  get loginExpire() {
    return UserModule.loginExpired
  }
  async toMenu() {
    PermissionModule.SET_ACTIVE_MODULE('业务办理')
    PermissionModule.SET_NAV_SIDERBAR_PROP(0)
    if (this.routeParams.modelName && this.routeParams.modelKey)
      return this.$router.push({ path: '/op/list/openDetail', query: {} })
    const { data } = await modelConfig(this.routeParams.menuName)
    if (data.modelUrl) this.$router.push({ path: data.modelUrl, query: data.params })
  }
  created() {
    this.routeParams = cookies.getLocalParams('loginRouteParams') || {}
    if (this.routeParams.menuName) {
      this.toMenu()
    }
  }
  mounted() {
    if (window.innerWidth < this.$globalProps.maxDeviceWidth) {
      AppModule.setMinSidebar(false)
      const ipadStandardFontSize = 'ipadStandardFontSize'
      Cookies.set('fontSize', ipadStandardFontSize)
      SettingsModule.ChangeSetting({ key: 'fontSize', value: ipadStandardFontSize })
    }
    OneMapModule.getInitConfig()
  }
}
</script>
<style lang="scss" scoped>
.elLayout {
  height: 100%;
  background-color: rgba(239, 243, 246, 1);
  .centerContent {
    display: flex;
    height: calc(100% - 75px);
    .leftSidebar {
      flex-shrink: 0;
      display: flex;
      padding: 0;
    }
    .rightContent {
      flex-grow: 1;
      width: 0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .topTagViews {
        flex-shrink: 0;
      }
      .mainContent {
        flex-grow: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
        // background-color: rgb(227, 229, 233);
        background-color: #fff;
        // margin: 16px;
        height: calc(100% - 35px);
        // padding: 24px;
        position: relative; /* * !不要删除 loading有绝对定位,否则会相对body发生偏移 */
      }
    }
  }
}
.topNavbar {
  // box-shadow: 0 2px 4px 0 rgb(90 91 106 / 20%), 0 1px 2px 0 rgb(58 58 68 / 20%);
  position: relative;
  z-index: 2;
}
</style>
