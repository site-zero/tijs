<script setup lang="ts">
  import { computed } from 'vue';
  import { CssUtils, TiCom, Vars } from '../../../core';
  import { LiveBgMode } from './use-play-mode';

  /**
   * 本控件要接入的属性
   */
  const props = defineProps<{
    playCom: TiCom;
    playConf?: Vars;
    mode: LiveBgMode;
  }>();

  const PlayLiveStyle = computed(() => {
    let { race, liveStyle } = props.playCom;
    if (liveStyle) {
      return CssUtils.toStyle(liveStyle);
    }
    // 根据模式给个默认
    else if (/^(SHELF|VIEW)$/.test(race)) {
      return {
        position: 'absolute',
        inset: 0,
      };
    }
    // 其他的稍微靠上一点
    else {
      return {
        paddingBottom: '30%',
      };
    }
  });

  const emit = defineEmits<{
    (event: 'sub-event', name: string, args: any[]): void;
  }>();

  // Get current component instance to access context
  function onSubEvents(event: string, args: any[]) {
    console.log('onSubEvents:', event, args);
    emit('sub-event', event, args);
  }

  const OnAllEvents = computed(() => {
    //console.log(props.playCom.events);
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
      <div
        class="live-com-wrap"
        :style="PlayLiveStyle">
        <component
          :is="playCom.com"
          v-bind="playConf"
          v-on="OnAllEvents" />
      </div>
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
    @include flex-center;
  }
</style>
