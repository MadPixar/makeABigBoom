<template>
  <div class="drawer-container el-pa-4 el-pr-0 fill-height">
    <div v-for="(theme, index) in allThemes" :key="index">
      <p class="theme-title">
        <svg-icon :icon-class="theme.icon" class="el-mr-2" />
        <span class="el-font-weight">{{ theme.typeTitle }}</span>
      </p>
      <div class="theme-choise">
        <div
          class="single-theme el-mt-3 el-mr-3"
          :class="{ 'is-active': currentTheme === it.type }"
          v-for="(it, subIndex) in theme.children"
          :key="subIndex"
          @click="changeTheme(it.type)"
        >
          <div class="theme-pic el-mb-1" :style="{ 'background-image': `url(${it.url})` }">
            <div class="selected-pic" v-if="currentTheme === it.type"><i class="el-icon-check"></i></div>
            <!-- <img
              src="@/assets/images/home/theme-guide/actived.png"
              class="selected-pic"
              v-if="currentTheme === it.type"
            /> -->
          </div>
          <p>{{ it.name }}</p>
        </div>
      </div>
      <el-divider class="el-my-4" />
    </div>
    <div v-if="isPc">
      <p class="theme-title el-mb-3">
        <svg-icon icon-class="icc_fontsize" class="el-mr-2" />
        <span class="el-font-weight">字号</span>
      </p>
      <div class="theme-font-area">
        <el-radio-group v-model="fontSize">
          <el-radio label="standardFontSize">标准</el-radio>
          <el-radio label="mediumFontSize">大</el-radio>
          <el-radio label="largeFontSize">加大</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SettingsModule } from '@/store/modules/settings'
import Cookies from 'js-cookie'
import { changeTheme } from '@/utils/themeChange'
interface ISingleThem {
  name: string
  url: string
  type: string
}
interface IAllThemes {
  typeTitle: string
  icon: string
  children: ISingleThem[]
}

@Component({
  name: 'ThemSetting'
})
export default class ThemSetting extends Vue {
  private isPc = window.innerWidth > this.$globalProps.maxDeviceWidth
  private allThemes: IAllThemes[] = [
    {
      typeTitle: '基础',
      icon: 'icc_basic',
      children: [
        {
          name: '中心蓝(默认)',
          url: require('@/assets/images/home/theme-guide/default-blue.png'),
          type: 'default-blue'
        },
        {
          name: '薄暮红',
          url: require('@/assets/images/home/theme-guide/dusk-red.png'),
          type: 'dusk-red'
        },
        {
          name: '深空灰',
          url: require('@/assets/images/home/theme-guide/space-gray.png'),
          type: 'space-gray'
        },
        {
          name: '极光绿',
          url: require('@/assets/images/home/theme-guide/aurora-green.png'),
          type: 'aurora-green'
        },
        {
          name: '丹霞橙',
          url: require('@/assets/images/home/theme-guide/danxia-orange.png'),
          type: 'danxia-orange'
        },
        {
          name: '法式洋红',
          url: require('@/assets/images/home/theme-guide/french-magenta.png'),
          type: 'french-magenta'
        },
        {
          name: '翡翠青',
          url: require('@/assets/images/home/theme-guide/emerald-green.png'),
          type: 'emerald-green'
        },
        {
          name: '罗兰紫',
          url: require('@/assets/images/home/theme-guide/roland-purple.png'),
          type: 'roland-purple'
        },
        {
          name: '简约白',
          url: require('@/assets/images/home/theme-guide/default-blue.png'),
          type: 'simple-white'
        }
      ]
    },
    {
      typeTitle: '情景主题',
      icon: 'icc_qingjin',
      children: [
        // {
        //   name: '高对比',
        //   url: require('@/assets/images/home/theme-guide/high-contrast.png'),
        //   type: 'high-contrast'
        // },
        {
          name: '经典2020',
          url: require('@/assets/images/home/theme-guide/classic-2020.png'),
          type: 'classic-2020'
        }
      ]
    },
    {
      typeTitle: '节日主题',
      icon: 'icc_jieri',
      children: [
        {
          name: '春节',
          url: require('@/assets/images/home/theme-guide/new-year.png'),
          type: 'new-year'
        },
        {
          name: '中秋节',
          url: require('@/assets/images/home/theme-guide/mid-autumn.png'),
          type: 'mid-autumn'
        }
      ]
    }
  ]

  get fontSize() {
    return SettingsModule.fontSize
  }
  set fontSize(val: string) {
    Cookies.set('fontSize', val)
    SettingsModule.ChangeSetting({ key: 'fontSize', value: val })
    // this.refreshView()
  }
  get currentTheme() {
    return SettingsModule.theme
  }

  private changeTheme(val: string) {
    Cookies.set('theme', val)
    SettingsModule.ChangeSetting({ key: 'theme', value: val })
    setTimeout(() => {
      const primaryBtn = document.querySelector('.el-button--primary') as any
      let theme = ''
      if (primaryBtn.currentStyle) {
        theme = this.colorRGBtoHex(primaryBtn.currentStyle.getAttribute('backgroundColor'))
      } else {
        theme = this.colorRGBtoHex(getComputedStyle(primaryBtn, null).getPropertyValue('background-color'))
      }
      changeTheme(theme)
      SettingsModule.ChangeSetting({ key: 'primaryColor', value: theme })
      Cookies.set('primaryColor', theme)
    }, 10)
  }
  //将rgb转换为16进制
  colorRGBtoHex(color: string) {
    const rgb = color.split(',')
    const r = parseInt(rgb[0].split('(')[1])
    const g = parseInt(rgb[1])
    const b = parseInt(rgb[2].split(')')[0])
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substring(1)
    return hex
  }

  private refreshView() {
    const { fullPath } = this.$route
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.theme-choise {
  display: flex;
  flex-wrap: wrap;
  .single-theme {
    width: 80px;
    text-align: center;
    cursor: pointer;
    .theme-pic {
      width: 80px;
      height: 52px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      .selected-pic {
        width: 18px;
        height: 18px;
        @include themify($themes) {
          background: themed('primary-color');
        }
        text-align: center;
        position: absolute;
        right: 0;
        bottom: 0;
        > i {
          font-size: 16px;
          line-height: 18px;
          color: #fff;
        }
      }
    }
    &.is-active > .theme-pic {
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);
      @include themify($themes) {
        border: 2px solid themed('primary-color');
      }
      border-radius: 2px;
    }
  }
}
.theme-font-area {
  padding-bottom: 80px;
}
</style>
