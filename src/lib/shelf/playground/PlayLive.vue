<script setup lang="ts">
  import { computed } from 'vue';
  import { TiCom } from '../../';
  import { Vars } from '../../../core';
  import { LiveBgMode } from './use-playground';

  /**
   * 本控件要接入的属性
   */
  const props = defineProps<{
    playCom: TiCom;
    playConf?: Vars;
    mode: LiveBgMode;
  }>();

  // Get current component instance to access context
  function onSubEvents(event: string, args: any[]) {
    console.log('onSubEvents:', event, args);
  }

  const OnAllEvents = computed(() => {
    console.log(props.playCom.events);
    let listens = {} as Record<string, Function>;
    if (props.playCom.events) {
      for (let event of props.playCom.events) {
        listens[event] = (...args: any[]) => {
          onSubEvents(event, args);
        };
      }
    }
    return listens;
  });
</script>

<template>
  <div
    class="play-live"
    :mode="mode"
    :com-race="playCom.race">
    <div class="play-live-con">
      <component
        :is="playCom.com"
        v-bind="playConf"
        v-on="OnAllEvents" />
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

    &[com-race='INPUT'],
    &[com-race='TILE'] {
      > .play-live-con {
        @include flex-center;
      }
    }

    &[com-race='INPUT'] > .play-live-con {
      > * {
        min-width: 200px;
      }
    }
  }

  .play-live-con {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
