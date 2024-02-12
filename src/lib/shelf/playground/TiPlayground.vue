<script setup lang="ts">
import _ from 'lodash';
import { Ref, computed, ref, watch } from 'vue';
import { Vars } from '../../../core';
import { tiCheckComponent } from '../../../lib';
import TiLayoutGrid from '../layout/grid/TiLayoutGrid.vue';
import PlayConf from './PlayConf.vue';
import PlayLive from './PlayLive.vue';
import PlayTabs from './PlayTabs.vue';
import { useGridLayout } from './use-play-layout';
import {
  LiveBgMode,
  PlayLayoutMode,
  loadLiveBgMode,
  loadPlayLayoutMode,
  saveLiveBgMode,
  savePlayLayoutMode,
} from './use-play-mode';
import {
  ExampleState,
  PlaygroundProps,
  saveLocalSetting,
  selectExample,
} from './use-playground';
/**
 * 指明当前的控件对象要展示的示例配置信息
 */
const _example = ref({} as ExampleState);

/*
 * 指明布局显示模式
 */
const _play_layout_mode: Ref<PlayLayoutMode> = ref(loadPlayLayoutMode());
/**
 * 指明控件演示区的布局模式
 */
const _live_bg_mode: Ref<LiveBgMode> = ref(loadLiveBgMode());
/**
 * 如果 play_mode == 'F' 那么需要指定是否隐藏显示 conf
 */
const _layout_shown: Ref<Record<string, boolean>> = ref({});

/**
 * 本控件要接入的属性
 */
const props = withDefaults(defineProps<PlaygroundProps>(), {
  comType: 'TiUnkown',
  example: '',
  exampleAsRouterLink: false,
});

/**
 * 指明当前的控件对象
 */
const PlayCom = computed(() => {
  return tiCheckComponent(props.comType);
});

const ExampleChanged = computed(() => {
  let dftComConf = PlayCom.value.checkProps(_example.value.name);
  return !_.isEqual(_example.value.comConf, dftComConf);
});

const Grid = computed(() => useGridLayout(_play_layout_mode.value));

function OnSelectExample(name: string) {
  selectExample(PlayCom.value, _example.value, name);
}

function OnConfReset() {
  let dftComConf = PlayCom.value.checkProps(_example.value.name);
  _example.value.comConf = dftComConf;
  saveLocalSetting(PlayCom.value, _example.value);
}

function OnConfChange(confData: Vars) {
  _example.value.comConf = confData;
  saveLocalSetting(PlayCom.value, _example.value);
}

function OnToggleConfShown() {
  console.log("OnToggleConfShown")
  if (_layout_shown.value.conf) {
    _layout_shown.value = {}
  } else {
    _layout_shown.value = { conf: true };
  }
}

watch(
  () => props.example,
  function (exampleName) {
    let com = PlayCom.value;
    selectExample(com, _example.value, exampleName);
  },
  {
    immediate: true,
  }
);

watch(
  () => [_live_bg_mode.value, _play_layout_mode.value],
  function (payload) {
    let [live_bg, play_layout] = payload;
    saveLiveBgMode(live_bg as LiveBgMode);
    savePlayLayoutMode(play_layout as PlayLayoutMode);
  }
);
</script>

<template>
  <div class="ti-playground" :mode="_play_layout_mode">
    <TiLayoutGrid v-bind="Grid" :style="{
      flex: '1 1 auto',
      padding: '10px',
    }" :shown="_layout_shown" @hide="OnToggleConfShown">
      <template v-slot="{ item }">
        <!--
            Tabs
        -->
        <template v-if="'tabs' == item.name">
          <PlayTabs :com="PlayCom" :current-example="_example.name"
            :play-layout-mode="_play_layout_mode" :live-bg-mode="_live_bg_mode"
            :example-as-router-link="exampleAsRouterLink"
            @change="OnSelectExample"
            @mode:layout="_play_layout_mode = $event as PlayLayoutMode"
            @mode:live_bg="_live_bg_mode = $event as LiveBgMode"
            @toggle:conf="OnToggleConfShown" />
        </template>
        <!--
          Live
        -->
        <template v-else-if="'live' == item.name">
          <PlayLive :play-com="PlayCom" :play-conf="_example.comConf"
            :mode="_live_bg_mode" />
        </template>
        <!--
          Conf
        -->
        <template v-else>
          <PlayConf :config-data="_example.comConf"
            :config-changed="ExampleChanged" @change="OnConfChange"
            @reset="OnConfReset" />
        </template>
      </template>

      <template name="panel" v-slot:panel="{ panel }">
        <template v-if="'conf' == panel.name">
          <PlayConf :config-data="_example.comConf"
            :config-changed="ExampleChanged" @change="OnConfChange"
            @reset="OnConfReset" />
        </template>
      </template>
    </TiLayoutGrid>
  </div>
</template>

<style lang="scss" scoped>
@use '../../../assets/style/_all.scss' as *;
@import './playground.scss';
</style>
