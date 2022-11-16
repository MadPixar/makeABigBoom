<template>
  <div class="pad-sidebar">
    <div class="avatar common-height">avatar</div>
    <div class="dashboard common-height">dashboard</div>
    <div class="menu-wrapper">
      <div class="menu">
        <div v-for="item in 30" :key="item" class="common-height">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'Sidebar'
})
export default class Sidebar extends Vue {}
</script>

<style lang="scss" scoped>
.pad-sidebar {
  width:350px;
  display:flex;
  flex-direction: column;
  flex-shrink: 0;
  .common-height {
    height: 85px;
  }
  .menu-wrapper {
    flex:1;
    overflow: hidden;
    .menu {
      height: 100%;
      overflow: scroll;
    }
  }
}
</style>
