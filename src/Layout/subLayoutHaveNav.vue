<template>
  <div class="subLayoutHaveNav fill-height">
    <div class="topNavbar">
      <Navbar />
    </div>
    <div class="topTagViews">
      <TagViews></TagViews>
    </div>
    <div class="mainContent">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from './navbar.vue'
import TagViews from './tagViews.vue'

@Component({ name: '', components: { Navbar, TagViews } })
export default class Index extends Vue {
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {}
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>

<style lang="scss" scoped>
.subLayoutHaveNav {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .mainContent {
    flex-grow: 1;
    overflow: auto;
    position: relative;
  }
}
</style>
