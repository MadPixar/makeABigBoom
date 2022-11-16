<template>
  <div class="pad-layout">
    <Sidebar></Sidebar>
    <Main></Main>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Sidebar from './Sidebar.vue'
import Main from './Main.vue'
@Component({
  name: 'Pad',
  components: {Sidebar,Main}
})
export default class Pad extends Vue {}
</script>

<style lang="scss" scoped>
.pad-layout {
  display:flex;
  height: 100%;
}
</style>
