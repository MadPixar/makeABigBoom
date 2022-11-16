<template>
  <div class="subLayoutWantSee fill-height" v-loading="loading" :element-loading-text="loadingText">
    <div class="topNavbar">
      <Navbar />
    </div>
    <div class="topTagViews">
      <TagViews></TagViews>
    </div>
    <div class="mainContent">
      <div style="width: 200px">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item name="1">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">导览</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-1"></svg-icon>
              </div>
              <div class="trangle"></div>
            </template>
            <div class="desc">包括新闻资讯、统计汇总、业务 台账、数据资源、党建信息、政策文件、法律法规。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="2">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text" style="font-family: TTTGB-Medium">事务</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-2"></svg-icon>
              </div>
              <div class="trangle1"></div>
            </template>
            <div class="desc">主要包括机关运转事务，并通过打通经济社会数据，提供强大的统计分析及决策咨询服务。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="3">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">服务</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-3"></svg-icon>
              </div>
              <div class="trangle2"></div>
            </template>
            <div class="desc">包括资质资格、产品质量等行业管理服务，也包括面向行政相对人的一站式便民服务。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="4">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">项目</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-4"></svg-icon>
              </div>
              <div class="trangle3"></div>
            </template>
            <div class="desc">财政资金项目的申报、立项、实施、验收、问效进行全生命周期管理。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="5">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">规划</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-5"></svg-icon>
              </div>
              <div class="trangle4"></div>
            </template>
            <div class="desc">规划模块，包括国土空间规划的编制、入库、修改、许可、执法以及用途管制等事项。</div>
            <div class="bottom-btn">
              <div class="btn-item" :class="{ 'btn-item-active': true }" @click="$router.push('/guihua/home')">
                驾驶舱
              </div>
              <div class="btn-item">专题图</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="" name="6">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">土地</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-6"></svg-icon>
              </div>
              <div class="trangle5"></div>
            </template>
            <div>
              <div class="desc">对耕地开发、占用、补充、管护 等，对建设用地审批、储备、供 应、利用、登记等。</div>
              <div class="bottom-btn">
                <div class="btn-item" :class="{ 'btn-item-active': true }" @click="$router.push('/tudi/home')">
                  驾驶舱
                </div>
                <div class="btn-item">专题图</div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="" name="7">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">调查</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-7"></svg-icon>
              </div>
              <div class="trangle6"></div>
            </template>
            <div class="desc">包括测绘、调查、监测等工作，重点是构建“1+N”调查监测体系。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="8">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">登记</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-8"></svg-icon>
              </div>
              <div class="trangle7"></div>
            </template>
            <div class="desc">建设全省统一的自然资源和不动产登记平台及数据库。</div>
          </el-collapse-item>
          <el-collapse-item title="" name="9">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">地矿</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-9"></svg-icon>
              </div>
              <div class="trangle8"></div>
            </template>
            <div class="desc">地矿模块，包括地质勘察、矿产资源保护和开发利用管理。</div>
            <div class="bottom-btn">
              <div class="btn-item" :class="{ 'btn-item-active': true }" @click="$router.push('/dikuang/home')">
                驾驶舱
              </div>
              <div class="btn-item">专题图</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="" name="11">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">执法</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-10"></svg-icon>
              </div>
              <div class="trangle9"></div>
            </template>
            <div>
              <div class="desc">对规划、土 地、地矿、测绘、登记、修复等全业务流程的督察执法工作。</div>
              <div class="bottom-btn">
                <div
                  class="btn-item"
                  :class="{ 'btn-item-active': true }"
                  @click="$router.push('/inspectHomePage/home')"
                >
                  驾驶舱
                </div>
                <div class="btn-item">专题图</div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="" name="12">
            <template slot="title">
              <div class="custom-title el-flex el-flex-space-between">
                <div class="left-text">应急</div>
                <svg-icon style="font-size: 32px" icon-class="icf-see-11"></svg-icon>
              </div>
              <div class="trangle10"></div>
            </template>
            <div class="desc">应急模块，包括地质灾害防治、应急测绘保障等工作。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <router-view style="flex: 1" :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from './navbar.vue'
import TagViews from './tagViews.vue'
import { SettingsModule } from '@/store/modules/settings'

@Component({ name: '', components: { Navbar, TagViews } })
export default class Index extends Vue {
  private activeName = '1'
  get loading() {
    return SettingsModule.loading
  }
  get loadingText() {
    return SettingsModule.loadingText
  }
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {}
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>

<style lang="scss" scoped>
.subLayoutWantSee {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .mainContent ::v-deep {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    position: relative;
    .el-collapse {
      height: 100%;
      border-top: none;
      .el-collapse-item {
        border-top: none;
        &.is-active {
          border-top: 2px solid #4e72fc;
          // border-bottom: 2px solid #4e72fc;
        }
      }
      .el-collapse-item.is-active {
        height: calc(100% - 640px);
        .el-collapse-item__wrap {
          height: calc(100% - 63px);
          margin-bottom: -3px;
        }
      }
    }
    .el-collapse-item__header {
      height: 64px;
      border: 2px solid #fff;
      position: relative;
      &.is-active {
        background: #547afd;
        border: none;
        .custom-title {
          background-image: url(~@/assets/wantSee/menu-active-title.png);
          background-size: 100% 100%;
          // background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
        }
        .left-text {
          font-size: 20px !important;
        }
      }
      &.is-active {
        .custom-title {
          color: #000000;
          font-weight: bold;
          height: 36px !important;
          top: 21px;
          right: 0;
        }
        .trangle {
          width: 20px;
          position: absolute;
          top: 21px;
          right: -3px;
          z-index: 1;
          background-image: none;
          background-color: #fff;
          border-radius: 0 8px 8px 0;
          height: 36px;
        }
        @for $i from 1 through 10 {
          .trangle#{$i} {
            top: 21px;
            right: -3px;
            background-image: none;
            background-color: #fff;
            border-radius: 0 8px 8px 0;
            height: 36px;
          }
        }
      }
      @for $i from 1 through 10 {
        .trangle#{$i} {
          width: 20px;
          height: 40px;
          position: absolute;
          right: -6px;
          z-index: 1;
          background-image: url(~@/assets/wantSee/trangle#{$i}.png);
          background-size: 100% 100%;
        }
      }
    }
    .el-collapse-item__wrap {
      .el-collapse-item__content {
        padding-bottom: 0;
      }
      .desc {
        color: #fff;
        padding: 0 16px;
        position: relative;
        font-size: 12px !important;
        line-height: 16px;
        margin-bottom: 30px;
        &::after {
          content: '';
          display: block;
          width: 108px;
          height: 28px;
          position: absolute;
          right: 0;
          top: 62px;
          background-image: url(~@/assets/wantSee/menu-content.png);
          background-size: 100% 100%;
        }
      }
      .bottom-btn {
        width: 174px;
        height: 30px;
        border-radius: 3px;
        margin: 0 auto;
        display: flex;
        padding: 3px;
        background: rgba(23, 83, 194, 0.5);
        .btn-item {
          width: 82px;
          height: 24px;
          cursor: pointer;
          text-align: center;
          line-height: 24px;
          color: #fff;
        }
        .btn-item-active {
          background: #fff;
          color: #1753c2;
          border-radius: 2px;
        }
      }
      background: linear-gradient(180deg, rgba(83, 121, 252, 1) 0%, rgba(109, 141, 253, 1) 100%);
    }
    .custom-title {
      width: 100%;
      position: absolute;
      top: 0;
      right: -2px;
      height: 100%;
      z-index: 2;
      padding: 0 12px 0 16px;
      align-items: center;
      background: linear-gradient(180deg, rgba(109, 153, 220, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
      backdrop-filter: blur(64px);
      .left-text {
        font-size: 17px !important;
        font-family: TTTGB-Medium !important;
      }
    }
    .el-collapse-item__arrow {
      display: none;
    }
  }
}
</style>
