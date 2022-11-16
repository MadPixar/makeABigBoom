<template>
  <div class="nav-content">
    <div class="nav-background fill-height"></div>
    <div class="navBar fill-height">
      <div class="navLeftLogo" @click="() => this.$router.push('/')">
        <div class="navLogo"></div>
        <!-- <div class="system-title" /> -->
      </div>
      <div class="navLeftOpe">
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '工作台' }" @click="toWorkBench">
          <svg-icon icon-class="ic-gzt"></svg-icon>
          <span class="el-font-weight">工作台</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '业务办理' }" @click="toDoHandle()">
          <svg-icon icon-class="ic-wyban"></svg-icon>
          <span class="el-font-weight">业务办理</span>
        </div>
        <div
          class="navLo-btn1"
          :class="{ 'navLo-active': activeModule === '内控管理' }"
          @click="navClick('内控管理', -1)"
        >
          <svg-icon icon-class="ic-wyd"></svg-icon>
          <span class="el-font-weight">内控管理</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '智能搜索' }" @click="toQueryHandle">
          <svg-icon icon-class="ic-wyc"></svg-icon>
          <span class="el-font-weight">智能搜索</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '数据资源' }" @click="toSeeHandle">
          <svg-icon icon-class="ic-wyk"></svg-icon>
          <span class="el-font-weight">数据资源</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '学习园地' }">
          <svg-icon icon-class="ic-wyb"></svg-icon>
          <span class="el-font-weight">学习园地</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '智慧决策' }">
          <svg-icon icon-class="ic-wyb"></svg-icon>
          <span class="el-font-weight">智慧决策</span>
        </div>
        <div class="navLo-btn1" :class="{ 'navLo-active': activeModule === '省市县直通车' }">
          <svg-icon icon-class="ic-ztc"></svg-icon>
          <span class="el-font-weight">省市县直通车</span>
        </div>
      </div>
      <div class="nav-scene-pic" v-if="themeName === 'new-year' || themeName === 'mid-autumn'"></div>
      <div class="navRightBtn">
        <!-- <el-input
          size="small"
          placeholder="一键搜索全部信息"
          @keyup.enter.native="handleRetrieval"
          @focus="searchActive = true"
          @blur="searchActive = false"
          v-model="searchText"
          class="navbarSearch"
        >
          <i slot="suffix" class="el-input__icon el-icon-search pointer search-icon" @click="handleRetrieval"></i>
        </el-input> -->

        <!-- <el-dropdown
          v-if="fastEntryList.length > 0"
          class="avatar-container right-menu-item hover-effect"
          trigger="click"
          size="medium"
          ref="dropdown"
        >
          <div class="avatar-wrapper el-pointer navRight-btn">
            <img src="~@/assets/images/home/navbar/icon-right-btn1.png" alt="" />
            <span class="nav-color">发起</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <ul class="fastEntryBox" style="padding:6px 24px 12px 24px">
              <li v-for="(item, index) in fastEntryList" :key="index">
                <span class="label">{{ item && item.moduleName ? item.moduleName : '' }}：</span>

                <template v-if="item && item.defaultPowerBusinessVOList">
                  <span
                    v-for="(item1, index1) in item.defaultPowerBusinessVOList"
                    :key="index1"
                    class="btn"
                    @click="goto(item.moduleName, item1.keyTypeCode, item1.keyTypeName)"
                    >{{ item1.keyTypeName }}</span
                  >
                </template>
              </li>
            </ul>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-badge :value="unreadNum" :max="99" class="chat-unreadnum" :hidden="unreadNum === 0">
          <div class="avatar-wrapper el-pointer navRight-btn" style="margin-left:20px" @click="openChat">
            <div class="nav-icon-style"></div>
            <span class="text-color-style">通讯</span>
          </div>
        </el-badge>
        <!-- <div class="avatar-wrapper el-pointer navRight-btn" style="margin-left:20px" @click="openCalc">
          <div class="nav-icon-style2"></div>
          <span class="text-color-style">计算</span>
        </div>
        <div class="avatar-wrapper el-pointer navRight-btn" style="margin-left:20px">
          <el-popover placement="top-start" width="120" trigger="hover">
            <img style="width:120px" src="./imgs/appDownload.png" />
            <img
              style="width:16px;margin-top: 4px;"
              v-if="theme === 'classic-2020'"
              slot="reference"
              src="./imgs/ewm.png"
            />
            <img style="width:16px; margin-top: 4px;" v-else slot="reference" src="./imgs/4875.svg" />
          </el-popover>
        </div>
        <div class="line"></div> -->
        <el-dropdown class="avatar-container last-right right-menu-item hover-effect" trigger="click" size="medium">
          <div class="avatar-wrapper el-pointer">
            <span class="nav-color avatar-head-name">{{ userName }}，您好</span>
            <img :src="avatarPath" class="user-avatar" />
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="personalSet"
            :class="{
              'ud-default-blue': themeName === 'default-blue',
              'ud-dusk-red': themeName === 'dusk-red' || themeName === 'new-year',
              'ud-space-gray': themeName === 'space-gray',
              'ud-aurora-green': themeName === 'aurora-green',
              'ud-danxia-orange': themeName === 'danxia-orange' || themeName === 'mid-autumn',
              'ud-french-magenta': themeName === 'french-magenta',
              'ud-emerald-green': themeName === 'emerald-green',
              'ud-roland-purple': themeName === 'roland-purple'
            }"
          >
            <router-link to="">
              <el-dropdown-item>
                <router-link to="/home/profile" style="width:100%;display:inline-block">用户中心</router-link>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item>
              <span style="display:block;" @click="settingTheme">主题设置</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span style="display:block;" @click="showDashbordSetting = true">面板设置</span>
            </el-dropdown-item>
            <!-- <el-dropdown-item>
              <span style="display:block;" @click="toGuider">用户手册</span>
            </el-dropdown-item> -->
            <el-dropdown-item>
              <span style="display:block;" @click="toCollect">收藏夹</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="navRightBg">
        <img src="@/assets/images/nav/mzd.png" alt="" />
      </div>
      <div class="bottom-border">
        <div class="skeleton-gradient"></div>
      </div>
      <CostumDashbordSetting :visible.sync="showDashbordSetting"></CostumDashbordSetting>
    </div>
    <Chatting curName="" curId="" :visible.sync="chattingVisible" @unreadNumchange="showNum"></Chatting>
    <SimpleCacler :calcerVisible.sync="calcerVisible"></SimpleCacler>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import { SettingsModule } from '@/store/modules/settings'
import { CollectModule } from '@/store/modules/collect'
import { Login } from '@/api/login'
import { TopSearchModule } from '@/store/modules/topSearch'
import { DashboardApi } from '@/api/dashboard'
import ApiService from '@/modules/xingzheng/process/api/manage/index'
import affairModule from '@/modules/xingzheng/process/store/index'
import { CollectApi } from '@/api/collect'
import { TagsViewModule } from '@/store/modules/tags-view'
import CostumDashbordSetting from '@/components/CustomDashbordSetting/index.vue'
import { PermissionModule } from '@/store/modules/permission'
import { cookies } from '@/utils'
import Chatting from '@/components/Chatting/index.vue'
import SimpleCacler from '@/components/SimpleCacler/index.vue'
interface obj {
  [props: string]: any
}
@Component({
  name: 'NavBar',
  components: {
    CostumDashbordSetting,
    Chatting,
    SimpleCacler
  }
})
export default class NavBar extends Vue {
  unreadNum: any = ''
  chattingVisible = false
  themeName = ''
  activeIndex = '1'
  showSearchIcon = false
  showDashbordSetting = false
  searchText = ''
  searchActive = false
  showApplication = false
  //  fastEntryList: Array<Object> = PermissionModule.fastEntryList
  fastEntryList: Array<Object> = []
  fastEntryRoute: Array<Object> = []
  urlList: obj = {
    外出办事: '/process/handle/details',
    调休申请: '/process/handle/details',
    员工请假: '/process/handle/details',
    加班申请: '/process/handle/details',
    拟写通知: '/office/secretary/editMessage',
    会议登记: '/meeting/manager/registerForm',
    会议申请: '/meeting/manager/application/form',
    发文拟稿: '/document/post/draft',
    收文登记: '/document/receive/register',
    案卷登记: '/op/accept/register'
  }
  developStatus = false
  calcerVisible = false
  get loadingText() {
    return AppModule.loadingText
  }
  get theme() {
    return SettingsModule.theme
  }
  get avatarPath() {
    return UserModule.avatar
  }
  get userName() {
    return UserModule.userInfo.user.userName
  }

  get navColor() {
    return SettingsModule.navColor
  }
  get isTablet() {
    return AppModule.isTablet
  }
  async created() {
    await this.getFastEntry()
    UserModule.getMenuCount()
    PermissionModule.setCustomRoutes(this.fastEntryRoute)
  }
  mounted() {
    // changeTheme(Cookies.get('primaryColor') || '#1491ED')
    this.themeName = this.theme
  }
  showNum(val: any) {
    this.unreadNum = val
  }
  toGuider() {
    window.open('http://10.14.2.34:12300/vlc/%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8C1.0.html')
  }
  openChat() {
    this.chattingVisible = true
  }
  toCollect() {
    this.$router.push({ path: '/office/secretary/collect' })
  }
  reSort() {
    ;[...this.fastEntryList].forEach((item: any) => {
      switch (item.moduleName) {
        case '事务':
          this.fastEntryList[3] = item
          break
        case '行政':
          this.fastEntryList[0] = item
          break
        case '公文':
          this.fastEntryList[2] = item
          break
        case '审批':
          this.fastEntryList[4] = item
          break
        case '会议':
          this.fastEntryList[1] = item
          break
        default:
          break
      }
    })
  }
  genrateRoute() {
    this.fastEntryList.forEach((item: any) => {
      item.defaultPowerBusinessVOList.forEach((item1: any) => {
        item1.name = item1.keyTypeName
        item1.moduleName = item.moduleName
        item1.isFast = true
        item1.path = this.urlList[item1.keyTypeName]
        this.fastEntryRoute.push(item1)
      })
    })
  }
  logout() {
    Login.logOut()
      .then(() => {
        localStorage.removeItem('loginName')
        TagsViewModule.RESET_VIEW()
        UserModule.LogOut()
      })
      .catch(() => {
        window.location.reload()
      })
  }
  async goto(moduleName?: any, keyTypeCode?: any, keyTypeName?: any) {
    if (moduleName === '事务') {
      await this.startAffiar(keyTypeCode)
      return
    }
    this.$router.push({
      path: this.urlList[keyTypeName]
    })
    ;(this.$refs.dropdown as any).hide()
  }
  //发起事务，并跳转
  startAffiar(keyTypeCode: any) {
    return ApiService.startAffair(keyTypeCode).then((res: any) => {
      affairModule.setAffairData(res.data)
      this.$opener('process', {
        moduleKey: res.data.keyDigNumGather,
        boxType: res.data.boxType,
        source: 'launch',
        data: res.data
      })
      ;(this.$refs.dropdown as any).hide()
    })
  }
  getFastEntry() {
    return DashboardApi.getFastEntry({ userId: UserModule.userInfo.user.userId })
      .then((res: any) => {
        this.fastEntryList = res.data
        this.reSort()
        this.genrateRoute()
      })
      .catch(() => {})
  }
  settingTheme() {
    SettingsModule.ChangeSetting({ key: 'showRightPanel', value: true, type: 1 })
    CollectModule.SetPageType(1)
  }
  settingCollect() {
    CollectApi.collectionApi({ pageIndex: 1, pageSize: this.$globalProps.pageSize }).then((res: any) => {
      CollectModule.SetListData(res.data.records)
      CollectModule.SetPageType(2)
      SettingsModule.ChangeSetting({ key: 'showRightPanel', value: true, type: 2 })
    })
  }

  // 跳转到全文检索
  handleRetrieval() {
    if (!this.searchText) return
    TopSearchModule.SET_SEARCH_TEXT(this.searchText || '')
    this.$router.push({ path: '/search', query: { txt: this.searchText } })
  }

  openJcxxpt() {
    //获取token
    const token = cookies.getToken()
    window.open('http://10.14.3.71:17000/#/one-map?token=' + token)
  }
  openCockpit() {
    this.$router.push({ path: '/cockpit' })
  }
  expendApplication() {
    this.showApplication = !this.showApplication
    if (window.innerWidth < this.$globalProps.maxDeviceWidth && this.showApplication) {
      AppModule.setMinSidebar(false)
    }
  }
  handleOutSideClick(e: any) {
    if ((this.$refs.application as any).contains(e.target)) {
      return
    }
    this.showApplication = false
  }

  openCalc() {
    this.calcerVisible = true
  }

  // 子系统页面开发 临时使用 勿删
  subsystem(query: { symbol: string }) {
    window.open(`/sub/${query.symbol}`)
  }
  // 工作台
  toWorkBench() {
    this.$router.push('/')
    PermissionModule.SET_ACTIVE_MODULE('工作台')
    PermissionModule.SET_NAV_SIDERBAR_PROP(-1)
  }
  // 我要办
  toDoHandle() {
    if (this.activeModule === '数据资源') this.$router.push('/')
    PermissionModule.SET_ACTIVE_MODULE('业务办理')
    PermissionModule.SET_NAV_SIDERBAR_PROP(0)
  }
  // 我要看
  toSeeHandle() {
    PermissionModule.SET_ACTIVE_MODULE('数据资源')
    PermissionModule.SET_NAV_SIDERBAR_PROP(-1)
    this.$router.push('/wantToSee')
  }
  // 我要查
  toQueryHandle() {
    PermissionModule.SET_ACTIVE_MODULE('智能搜索')
    PermissionModule.SET_NAV_SIDERBAR_PROP(-1)
    this.$router.push({ path: '/search', query: { txt: '' } })
  }
  //我要督，我要报
  navClick(name: string, ind: number) {
    PermissionModule.SET_ACTIVE_MODULE(name)
    PermissionModule.SET_NAV_SIDERBAR_PROP(ind)
    let path = ''
    switch (name) {
      case '内控管理':
        path = '/wantToSuperintend'
        break
      case '学习园地':
        path = '/wantToReport'
        break
      case '智慧决策':
        path = '/wantToReport'
        break
    }
    this.$router.push({ path, query: {} })
  }

  get activeModule() {
    return PermissionModule.activeModule
  }
}
</script>
<style lang="scss">
.fastEntryBox {
  font-size: 14px !important;
  li {
    line-height: 40px;
  }
  .label {
    color: rgba(5, 23, 54, 0.45);
    display: inline-block;
    margin-right: 8px;
  }
  .btn {
    display: inline-block;
    margin-right: 24px;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep .chat-unreadnum {
  .el-badge__content.is-fixed {
    right: 6px;
  }
}
.search {
  width: 220px !important;
  transition: all 0.3s ease-out;
  padding-left: 80px;
  & .el-input {
    width: 100% !important;
  }
  &.active {
    padding-left: 0;
  }
}
.pointer {
  cursor: pointer;
  &:hover {
    color: #fff;
  }
}
.nav-content {
  height: 75px;
  box-sizing: border-box;
  position: relative;
  .nav-background {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  .navBar {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-color: #f0f4f9;
    background-image: none !important;
    // background: linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.2) 100%);
    // backdrop-filter: blur(2px);
    // background-position: right center;
    // background-repeat: no-repeat;
    // background-size: auto 100%;
    // @include themify {
    //   @if themed('high-contrast') {
    //   }
    //   @if themed('classic-2020') and not themed('high-contrast') {
    //     // background-size: 100% 124% !important;
    //     background-size: 100% 100% !important;
    //   }
    // }
    //    @include themify($themes) {
    //   font-size: themed('title-size') !important;
    // }
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    .nav-color {
      color: #1f1f1f;
      @include themify($themes) {
        color: themed('navbar-right-text-color') !important ;
      }
    }
    .navLeftLogo {
      cursor: pointer;
      height: 100%;
      float: left;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // 导航logo
      .navLogo {
        margin-left: 22px;
        width: 200px;
        height: 56px;
        // background-image: url(~@/assets/images/nav/logo-title.png) !important;
        @include themify($themes) {
          background: themed('navbar-logo') no-repeat 0 0/ 100% 100% !important;
          background-size: cover;
        }
      }
      .system-title {
        height: 25px;
        width: 310px;
        margin-left: 24px;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    //左侧操作按钮
    .navLeftOpe {
      float: left;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin: 0 0 0 28px;
      position: relative;
      z-index: 101;
      .navLo-btn1 {
        height: 75px;
        display: flex;
        padding: 0 10px;
        margin: 0;
        margin-right: 10px;
        align-items: center;
        border-top: 2px solid transparent;
        box-sizing: border-box;
        .svg-icon {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
        span {
          font-weight: normal !important;
          font-size: 18px !important;
          color: #1f1f1f;
        }
      }
      .navLo-active {
        background: #fff !important;
        position: relative;
        &::before {
          content: '';
          display: block;
          height: 14px;
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          background-image: url(~@/assets/images/nav/active-nav.png);
          background-size: 100% 100%;
        }
        span {
          color: #2770e8;
          font-weight: 500 !important;
        }
      }
      .navLo-btn1,
      .navLo-btn2-btn {
        flex: none;
        background: transparent;
        cursor: pointer;
        &:hover {
          background: rgba(#fff, 0.1);
        }
        > i {
          display: inline-block;
          width: 24px;
          height: 24px;
          vertical-align: middle;
          margin: 0 8px 0 0;
        }
        .navLo-btn-icon1 {
          background: url('~@/assets/images/home/navbar/icon-option1.png') no-repeat 0/ 100% 100%;
          @include themify($themes) {
            background: themed('navbar-option-icon1') no-repeat 0 0/ 100% 100% !important;
          }
        }
        .navLo-btn-icon2 {
          @include themify($themes) {
            background: themed('navbar-option-icon2') no-repeat 0 0/ 100% 100%;
          }
        }
        .navLo-btn-icon3 {
          @include themify($themes) {
            background: themed('navbar-option-icon3') no-repeat 0 0/ 100% 100%;
          }
        }
        .navLo-btn-icon4 {
          @include themify($themes) {
            background: themed('navbar-option-icon4') no-repeat 0 0/ 100% 100%;
          }
        }
        > span {
          font-size: 14px;
          line-height: 16px;
          // color: #fff;
          // @include themify($themes) {
          //   color: themed('navbar-text-color') !important ;
          // }
          text-align: left;
          vertical-align: middle;
        }
      }
      .navLo-btn2 {
        flex: none;
        position: relative;
      }
    }
    .nav-scene-pic {
      float: right;
      width: 80px;
      height: 100%;
      @include themify($themes) {
        background: themed('navbar-background-img') no-repeat 0 0/ 100% 100%;
      }
    }
    // 导航右侧
    .navRightBtn {
      height: 100%;
      float: right;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      z-index: 101;
      .nav-icon-style {
        width: 16px;
        height: 16px;
        background: url('~@/assets/images/home/navbar/icon-right-btn2.png') no-repeat 0/ 100% 100%;
        margin-right: 8px;

        @include themify {
          @if themed('high-contrast') {
          }
          @if themed('classic-2020') and not themed('high-contrast') {
            background: themed('navbar-right-icon1') no-repeat 0/ 100% 100% !important ;
          }
        }
      }
      .nav-icon-style2 {
        width: 16px;
        height: 16px;
        background: url('~@/assets/images/home/navbar/calculate.png') no-repeat 0/ 100% 100%;

        @include themify {
          @if themed('high-contrast') {
          }
          @if themed('classic-2020') and not themed('high-contrast') {
            background: themed('navbar-right-icon2') no-repeat 0/ 100% 100% !important ;
          }
        }

        margin-right: 8px;
      }
      .text-color-style {
        color: #595959;
        @include themify($themes) {
          color: themed('navbar-right-text-color') !important ;
        }
      }
      .last-right {
        margin-right: 16px;
      }
      .navRight-btn {
        height: 24px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        > img {
          flex: none;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: #fff;
          vertical-align: middle;
        }
        > span {
          flex: none;
        }
      }
      .navRbtn-icon {
        margin-right: 8px;
        color: #fff;
      }
      .navbarSearch {
        ::v-deep .el-input__inner {
          border: none;
          height: 36px;
          line-height: 36px;
          background-color: rgba(#000, 0.15);
          @include themify($themes) {
            background-color: themed('navbar-search-bg') !important ;
          }
          color: #fff;
          border-radius: 32px;
          padding-left: 17px;

          &::-webkit-input-placeholder {
            color: #fff !important;
            padding-left: 6px;
          }
          &::-moz-input-placeholder {
            color: #fff !important;
            padding-left: 6px;
          }
          &::-ms-input-placeholder {
            color: #fff !important;
            padding-left: 6px;
          }
          &::input-placeholder {
            color: #fff !important;
            padding-left: 6px;
          }
        }
        .search-icon {
          color: #fff;
        }
        .el-input__icon.el-icon-search {
          color: #fff;
        }
      }
      // 设置头像样式
      .avatar-container {
        // margin-right: 20px;
        margin-left: 16px;
        position: relative;
        // margin-right: 12px;
        flex-shrink: 0;

        .avatar-wrapper {
          position: relative;
          line-height: 100%;
          display: flex;
          align-items: center;
          outline: none;
          .user-avatar {
            cursor: pointer;
            width: 32px;
            height: 32px;
            margin-left: 10px;
            border-radius: 50%;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            height: 10px;
            width: 24px;
            font-size: 16px;
            color: #fff;
            transform: rotate(90deg);
          }
        }
      }
      // 设置搜索样式
      .navSearch {
        margin-right: 8px;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-top: 4px;
      }
    }
    .navRightBg {
      width: 676px;
      height: 110px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
      @include themify {
        @if themed('classic-2020') {
          // @if themed('classic-2020') and not themed('high-contrast') {
          background-image: url(~@/assets/images/nav/nav-right-bg.png);
          // background: themed('navbar-background-img') no-repeat 0 0/ 100% 100%;
        } @else {
          background: themed('navbar-background-img') no-repeat 0 0/ 100% 100%;
        }
      }
      background-size: 100% 100%;
      padding-left: 97px;
      img {
        width: 303px;
        height: 110px;
        @include themify {
          @if themed('classic-2020') {
            display: inline-block;
          } @else {
            display: none;
          }
        }
      }
    }
    .bottom-border {
      height: 2px;
      width: 1366px;
      position: absolute;
      bottom: 0px;
      left: 0;
      z-index: 90;
      background: linear-gradient(34.9deg, rgba(169, 198, 246, 1) 0%, rgba(169, 198, 246, 0) 100%);
      // .skeleton-gradient {
      //   width: 100%;
      //   height: 100%;
      //   background: #a9c6f6 -webkit-linear-gradient(left, #a9c6f6, #d4e2fa 50%, #ffffff 90%, rgba(169, 198, 246, 0)) no-repeat
      //     0 0;
      //   background-size: 20% 100%;
      //   animation: skeletonGradient 5s linear infinite;
      // }
      // @keyframes skeletonGradient {
      //   0% {
      //     background-position: 0 0;
      //   }
      //   to {
      //     background-position: 100% 100%;
      //   }
      // }
    }
  }
}
.application {
  width: 320px !important;
  height: 507px;
  background: #fff;
  box-shadow: 0px 0px 8px rgba(5, 23, 54, 0.15);
  border-radius: 2px;
  position: absolute;
  left: 24px;
  top: 40px;
  padding: 0 24px;
  z-index: 999 !important;
  color: rgba(5, 23, 54, 0.85);
  .sameApplication {
    margin-top: 24px;
    .title {
      font-size: 13px !important;
      font-weight: 400;
      line-height: 18px;
      color: rgba(5, 23, 54, 0.45);
      margin-bottom: 8px;
    }
    .icon {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 2px;
      margin-right: 10px;
    }
    .application-item {
      width: 100%;
      height: 36px;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      cursor: pointer;
      &:hover {
        @include themify($themes) {
          color: themed('primary-color');
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      .applicationName {
        width: 196px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .el-icon-arrow-right {
      margin-left: auto;
    }
  }
  .sameApplication:nth-child(1) {
    .icon {
      background-color: #3aa1f8;
    }
  }
  .sameApplication:nth-child(2) {
    .icon {
      background-color: #3ac5f8;
    }
  }
  .sameApplication:nth-child(3) {
    .icon {
      background-color: #3ac5f8;
    }
  }
  .sameApplication:nth-child(4) {
    .icon {
      background-color: #66b92e;
    }
  }
  .sameApplication:nth-child(5) {
    .icon {
      background-color: #9244ea;
    }
  }
  .svg-icon {
    fill: #fff;
    border-radius: 2px;
    font-size: 20px !important;
  }
}
.personalSet {
  ::v-deep .el-dropdown-menu__item {
    padding: 0;
    width: 100px;
    text-align: center;
    span {
      display: inline-block;
      width: 100%;
    }
  }
  ::v-deep .el-dropdown-menu__item--divided:before {
    // width: 100%;
    display: none;
  }
}
.ud-default-blue {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #e8f9ff;

    @include themify($themes) {
      color: themed('primary-color');
    }
  }
}
.ud-dusk-red {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #ffece8;
    color: #f53f3f;
  }
}
.ud-space-gray {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #f7f8fa;
    color: #86909c;
  }
}
.ud-aurora-green {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #e8ffea;
    color: #00b42a;
  }
}
.ud-danxia-orange {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #fff3e8;
    color: #f77234;
  }
}
.ud-french-magenta {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #ffe8ec;
    color: #f06d9b;
  }
}
.ud-emerald-green {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #e8fffe;
    color: #3bb9cd;
  }
}
.ud-roland-purple {
  ::v-deep .el-dropdown-menu__item:focus,
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #f7e8ff;
    color: #9244ea;
  }
}
.line {
  width: 1px;
  height: 20px;
  background-color: rgba(#fff, 0.2);
  margin-left: 16px;
}

.ripple-box {
  width: 589px;
  height: 52px;
  position: absolute;
  top: 0;
  right: 10%;
  @include themify($themes) {
    background: themed('navbar-searchinput-img') no-repeat 100%;
  }
}
/* ipad适配 */
@media only screen and (min-device-width: $--min-device-width) and (max-device-width: $--max-device-width) and (orientation: $--orientation) {
  .el-popper {
    z-index: 999999999 !important;
  }
}
@media only screen and (min-width: 1681px) {
  .navbarSearch {
    width: 300px !important;
  }
  .navLo-btn1,
  .navLo-btn2-btn {
    padding: 2px 16px;
    margin: 0 8px;
  }
}
@media only screen and (max-width: 1200px) {
  .navbarSearch {
    display: none;
  }
}
@media only screen and (max-width: 1680px) {
  .navbarSearch {
    width: 200px !important;
  }
  .navLo-btn1,
  .navLo-btn2-btn {
    padding: 2px 12px;
    margin: 0 6px;
  }
}
@media only screen and (max-width: 1440px) {
  .avatar-head-name {
    display: none;
  }
  .user-avatar {
    margin-left: 0 !important;
  }
}
</style>
