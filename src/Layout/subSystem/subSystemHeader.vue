<template>
  <div class="nav-content relative fill-height">
    <div class="nav-background fill-height"></div>
    <div class="navBar relative fill-height">
      <div class="navLeftLogo" @click="home">
        <div class="navLogo"></div>
        <div class="system-title" />
        <el-divider class="el-mx-4" direction="vertical"></el-divider>
        <div class="sub-system-title">{{ systemName }}</div>
      </div>
      <div class="nav-scene-pic" v-if="themeName === 'new-year' || themeName === 'mid-autumn'"></div>
      <div class="navRightBtn">
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
                <router-link to="/home/profile" style="width:100%;display:inline-block"> 用户中心</router-link>
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item>
              <span style="display:block;" @click="settingTheme">主题设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { TopSearchModule } from '@/store/modules/topSearch'
import { UserModule } from '@/store/modules/user'
import { TagsViewModule } from '@/store/modules/tags-view'
import { SettingsModule } from '@/store/modules/settings'
import { CollectModule } from '@/store/modules/collect'
import { SubSystemModule } from '@/store/modules/subsystem'
import { Login } from '@/api/login'
// import { changeTheme } from '@/utils/themeChange'
// import Cookies from 'js-cookie'

// const avatarPath = require('@/assets/user-photo.jpg')
@Component({
  name: 'SubSystemHeader'
})
export default class SubSystemHeader extends Vue {
  searchText = ''
  themeName = ''
  showDashbordSetting = false

  @Watch('theme')
  getTheme(newVal: any) {
    this.themeName = newVal
  }
  get avatarPath() {
    return UserModule.avatar
  }
  get systemName() {
    return this.$route.query.sysName || '项目管理系统'
  }
  get theme() {
    return SettingsModule.theme
  }
  get userName() {
    return UserModule.name
  }

  get symbol() {
    return SubSystemModule.subsystem.symbol
  }

  mounted() {
    // changeTheme(Cookies.get('primaryColor') || '#1491ED')
    this.themeName = this.theme
  }
  // 跳转到全文检索
  handleRetrieval() {
    if (!this.searchText) return
    TopSearchModule.SET_SEARCH_TEXT(this.searchText || '')
    this.$router.push({ path: '/search', query: { txt: this.searchText } })
  }

  settingTheme() {
    SettingsModule.ChangeSetting({ key: 'showRightPanel', value: true, type: 1 })
    CollectModule.SetPageType(1)
  }

  home() {
    this.$router.push({ path: `/sub/${this.symbol}` })
  }

  logout() {
    Login.logOut()
      .then(() => {
        localStorage.removeItem('loginName')
        TagsViewModule.RESET_VIEW()
        UserModule.LogOut()
        this.$router.replace({ path: `/subsystemLogin/${this.symbol}` })
      })
      .catch(() => {
        window.location.reload()
        this.$message.warning('退出失败')
      })
  }
}
</script>
<style scoped lang="scss">
.relative {
  position: relative;
}
.nav-content {
  .nav-background {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  }
  .navBar {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    background-position: right center;
    background-repeat: no-repeat;
    background-size: auto 100%;
    @include themify {
      @if themed('high-contrast') {
      }
      @if themed('classic-2020') and not themed('high-contrast') {
        background-size: 100% 100% !important;
      }
    }
    &:after {
      content: '';
      display: table;
      clear: both;
    }
    .nav-color {
      color: #fff;
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
        margin-left: 16px;
        width: 36px;
        height: 36px;
        background-size: cover;
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
    .nav-color {
      color: #fff;
    }
    .sub-system-title {
      font-size: 16px !important;
      font-family: PingFang Medium;
      font-weight: 500;
      text-align: left;
      color: #fff;
      @include themify {
        @if themed('high-contrast') {
        }
        @if themed('classic-2020') and not themed('high-contrast') {
          color: #2770e8;
        }
      }
    }
    .line {
      width: 1px;
      height: 20px;
      background-color: rgba(#fff, 0.2);
      margin-left: 16px;
    }

    .nav-scene-pic {
      float: right;
      width: 80px;
      height: 100%;
      @include themify($themes) {
        background: themed('navbar-background-img') no-repeat 0 0/ 100% 100%;
      }
    }
    .navRightBtn {
      height: 100%;
      float: right;
      display: flex;
      justify-content: flex-start;
      align-items: center;
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
          color: #fff;
          border-radius: 32px;
          &::-webkit-input-placeholder {
            color: rgba(#fff, 0.7);
          }
          &::-moz-input-placeholder {
            color: rgba(#fff, 0.7);
          }
          &::-ms-input-placeholder {
            color: rgba(#fff, 0.7);
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
        margin-left: 16px;
        position: relative;
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
  }
}
</style>
