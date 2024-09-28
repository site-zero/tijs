<script lang="ts" setup>
  import { WallProps } from './ti-wall-types';
  import { useWall } from './use-wall';
  //-----------------------------------------------------
  const props = defineProps<WallProps>();
  //-----------------------------------------------------
  const Wall = useWall(props);
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-wall"
    :class="Wall.TopClass.value"
    :style="Wall.TopStyle.value">
    <div
      class="wall-con fit-parent"
      :style="Wall.ConStyle.value">
      <div
        v-for="wit in Wall.Items.value"
        class="wall-item"
        :class="wit.className"
        :style="wit.style"
        :it-index="wit.index"
        :it-type="wit.type">
        <component
          :is="wit.comType"
          v-bind="wit.comConf" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-wall.scss';
</style>
