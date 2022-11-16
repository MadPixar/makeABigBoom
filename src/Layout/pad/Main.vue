<template>
  <div class="pad-main">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  name: 'Main'
})
export default class Main extends Vue {}
</script>

<style lang="scss" scoped>
.pad-main {
  flex: 1;
}
</style>
