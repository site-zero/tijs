<script setup lang="ts">
import JSON5 from 'json5';
import { Ref, computed, ref, watch } from 'vue';
import { TiBlock, tiCheckComponent } from '../../../lib';
import TiLayoutGrid from '../layout/grid/TiLayoutGrid.vue';
import PlayConf from './PlayConf.vue';
import PlayLive from './PlayLive.vue';
import PlayTabs from './PlayTabs.vue';
import { useGridLayout } from './use-play-layout';
import { LiveBgMode, PlayLayoutMode, loadLiveBgMode, loadPlayLayoutMode } from './use-play-mode';
import { ExampleState, PlaygroundProps, loadLocalSetting, selectExample } from './use-playground';
/**
 * 指明当前的控件对象要展示的示例配置信息
 */
const _example = ref({} as ExampleState);

/*
 * 指明布局显示模式
 */
const _play_mode: Ref<PlayLayoutMode> = ref(loadPlayLayoutMode())
/**
 * 指明控件演示区的布局模式
 */
const _live_bg_mode: Ref<LiveBgMode> = ref(loadLiveBgMode())


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

const Grid = computed(() => useGridLayout(_play_mode.value))

function OnSelectExample(name: string) {
  let ex = _example.value;
  ex.name = name;
  ex.comConf = loadLocalSetting(PlayCom.value, ex.name);
  ex.text = JSON5.stringify(ex.comConf, null, 2);
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
</script>

<template>
  <div class="ti-playground" :mode="_play_mode">
    <!--
    <section class="part-tabs">
      <PlayTabs :com="PlayCom" :current-example="_example.name" :mode="_play_mode"
        :example-as-router-link="exampleAsRouterLink" @change="OnSelectExample" />
    </section>
    <section class="part-arena">
      <TiBlock>
        <PlayLive :play-com="PlayCom" :play-conf="_example.comConf"
          :mode="_live_bg_mode" />
      </TiBlock>
    </section>
    -->
    <TiLayoutGrid v-bind="Grid" :style="{
      flex: '1 1 auto',
      padding: '10px',
    }">
      <template v-slot="{ item }">
        <!--
            Tabs
        -->
        <TiBlock v-if="'tabs' == item.name">
          <PlayTabs :com="PlayCom" :current-example="_example.name"
            :mode="_play_mode" :example-as-router-link="exampleAsRouterLink"
            @change="OnSelectExample" />
        </TiBlock>
        <!--
          Live
        -->
        <TiBlock v-else-if="'live' == item.name">
          <PlayLive :play-com="PlayCom" :play-conf="_example.comConf"
            :mode="_live_bg_mode" />
        </TiBlock>
        <!--
          Conf
        -->
        <TiBlock v-else>
          <PlayConf />
        </TiBlock>

      </template>
    </TiLayoutGrid>
  </div>
</template>

<style  lang="scss" scoped>
@use '../../../assets/style/_all.scss' as *;
@import './playground.scss';
</style>
