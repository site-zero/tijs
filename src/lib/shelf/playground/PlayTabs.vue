<script setup lang="ts">
  import { computed } from 'vue';
  import { TiCom } from '../../../core';
  import { TiIcon } from '../../../lib';
  import { LiveBgMode, PlayLayoutMode } from './use-play-mode';
  import { getExampleList } from './use-playground';

  const emit = defineEmits<{
    (event: 'change' | 'mode:layout' | 'mode:live_bg', payload: string): void;
    (event: 'toggle:conf'): void;
  }>();
  /**
   * 本控件要接入的属性
   */
  const props = defineProps<{
    com: TiCom;
    currentExample?: string;
    playLayoutMode?: PlayLayoutMode;
    liveBgMode?: LiveBgMode;
    exampleAsRouterLink: boolean;
  }>();

  const PlayLayoutModeIcon = computed(() => {
    switch (props.playLayoutMode) {
      case 'H':
        return 'fas-table-columns';
      case 'V':
        return 'zmdi-view-quilt';
      case 'F':
        return 'zmdi-view-day';
    }
    return 'zmdi-view-day';
  });

  const LiveBgModeIcon = computed(() => {
    switch (props.liveBgMode) {
      case 'fill':
        return 'fas-fill';
      case 'none':
        return 'fas-chess-board';
    }
    return 'fas-chess-board';
  });

  const ConfPanelStatusIcon = computed(() => {
    return 'zmdi-code-setting';
  });

  const ExampleList = computed(() => {
    return getExampleList(props.com, props.currentExample);
  });

  function OnToggleLiveBgMode() {
    let lvmode = props.liveBgMode || 'fill';
    let nextMode = {
      none: 'fill',
      fill: 'none',
    }[lvmode];
    emit('mode:live_bg', nextMode);
  }

  function OnToggleLayoutMode() {
    let lymode = props.playLayoutMode || 'F';
    let nextMode = {
      H: 'V',
      V: 'F',
      F: 'H',
    }[lymode];
    emit('mode:layout', nextMode);
  }
</script>

<template>
  <div
    class="play-tabs"
    :mode="playLayoutMode">
    <ul>
      <li
        v-for="ex in ExampleList"
        :class="ex.className">
        <RouterLink
          v-if="props.exampleAsRouterLink"
          :to="ex.href"
          >{{ ex.text }}
        </RouterLink>
        <a
          v-else
          @click="emit('change', ex.name)"
          >{{ ex.text }}</a
        >
      </li>
    </ul>
    <div class="as-actions">
      <b @click="OnToggleLiveBgMode">
        <TiIcon :value="LiveBgModeIcon" />
      </b>
      <b @click="OnToggleLayoutMode">
        <TiIcon :value="PlayLayoutModeIcon" />
      </b>
      <b
        v-if="'F' == playLayoutMode"
        @click="emit('toggle:conf')">
        <TiIcon :value="ConfPanelStatusIcon" />
      </b>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;

  .play-tabs {
    position: relative;
    padding: 0.2em SZ(42) 0.2em 0.2em;

    > .as-actions {
      @include flex-align-nowrap($ai: center);
      @include pos-abs($t: 0, $b: 0, $r: 0);
      padding: 0.3em;

      b {
        display: block;
        padding: 0.32em;
        margin: 0.1em 0 0.1em auto;
        cursor: pointer;

        &:hover {
          background-color: var(--ti-color-primary);
          color: var(--ti-color-primary-r);
          border-radius: var(--ti-measure-r-s);
        }
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li > a {
    display: block;
    border: 1px solid var(--ti-color-border-shallow);
    color: var(--ti-color-tab-f);
    background-color: var(--ti-color-tab);
    padding: SZ(8) SZ(10);
    border-radius: SZ(4);
    margin: SZ(3);
    cursor: pointer;
  }

  li.is-highlight > a {
    color: var(--ti-color-primary-r);
    background-color: var(--ti-color-primary);
    cursor: default;
  }

  .play-tabs[mode='H'],
  .play-tabs[mode='F'] {
    > ul {
      @include flex-align($ai: stretch, $ac: stretch);
    }
  }

  .play-tabs[mode='V'] {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 0;

    > ul {
      padding: 0.2em;
    }

    > .as-actions {
      top: unset;
    }
  }
</style>
