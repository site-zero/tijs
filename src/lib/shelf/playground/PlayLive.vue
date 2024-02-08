<script setup lang="ts">
import { Vars } from 'src/core';
import { TiCom } from '../../../lib';
import { LiveBgMode } from './use-playground';

/**
 * 本控件要接入的属性
 */
defineProps<{
  playCom: TiCom,
  playConf?: Vars,
  mode: LiveBgMode
}>();
</script>

<template>
  <div class="play-live" :mode="mode" :com-race="playCom.race">
    <div class="play-live-con">
      <component :is="playCom.com" v-bind="playConf" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/style/_all.scss' as *;

.play-live {
  @include pos-abs-full;

  &[mode='none'] {
    @include bg-chessboard;
  }

  &[mode='fill'] {
    background-color: var(--ti-color-card);
  }
}

.play-live-con {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
