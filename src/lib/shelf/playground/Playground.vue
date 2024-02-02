<script setup lang="ts">
import JSON5 from "json5";
import _ from "lodash";
import { Ref, computed, inject, onMounted, onUnmounted, provide, ref, watch } from "vue";
import { CssUtils, Rects, Size2D, Store, } from "../../../core"
import { AppEvents, BUS_KEY, TiIcon, createAppSubBus, makeAnonymouseEvent, tiCheckComponent } from "../../";
import {
  ExampleState,
  PlaygroundProps,
  SubComEvent,
  buildBusEventMessage,
  formatExampleText,
  getExample,
  getExampleList,
  listenInnerBus,
  loadLocalSetting,
  parseExampleComConf,
  removeLocalSetting,
  saveLocalSetting,
  watchProps
} from "./use-playground";
/*-------------------------------------------------------

                      State

-------------------------------------------------------*/
const _example = ref({} as ExampleState);

//
// 背景填充模式
type LiveBgMode = "none" | "fill";
let s = Store.local.getString("Ti-Demo-Live-Bg", "fill");
const _live_bg_mode: Ref<LiveBgMode> = ref(s as unknown as LiveBgMode);

//
// 自动尺寸
const _view_live = ref<Size2D>({ width: 0, height: 0 })
/*-------------------------------------------------------

                    Refer Elements

-------------------------------------------------------*/
const $root: Ref<HTMLElement> = ref() as Ref<HTMLElement>
const $live: Ref<HTMLElement> = ref() as Ref<HTMLElement>
/*-------------------------------------------------------

                        Bus

-------------------------------------------------------*/
const _bus_event: Ref<SubComEvent | undefined> = ref(undefined);
let outer_bus = inject(BUS_KEY);
if (!outer_bus) {
  throw 'impossiable!!!'
}
let inner_bus = createAppSubBus(outer_bus, "PLAYGROUND", onUnmounted)
provide(BUS_KEY, inner_bus);
/*-------------------------------------------------------

                      Props

-------------------------------------------------------*/
const props = withDefaults(defineProps<PlaygroundProps>(), {
  comType: "TiUnkown",
  example: "",
  exampleAsRouterLink: false
});

/*-------------------------------------------------------

                   Computed

-------------------------------------------------------*/
const hasSyntaxErr = computed(() => (_example.value.syntaxErr ? true : false));
const hasBusEvent = computed(() => (_bus_event.value ? true : false));
const showInfo = computed(() => {
  return hasSyntaxErr.value || hasBusEvent.value;
});
const foldConf = computed(() => {
  let example = getExample(PlayCom.value, _example.value.name)
  let expectWidth = example?.expectWidth || 0
  return _view_live.value.width > 0 && expectWidth > _view_live.value.width
})
const TopClass = computed(() => {
  return CssUtils.mergeClassName(
    props.className,
    {
      "is-syntax-error": hasSyntaxErr.value,
      "has-bus-event": hasBusEvent.value,
      "show-info": showInfo.value,
      "fold-conf": foldConf.value
    },
    `live-bg-${_live_bg_mode.value}`
  )
});
const PlayCom = computed(() => {
  return tiCheckComponent(props.comType);
});

const ExampleList = computed(() => {
  return getExampleList(_example.value, PlayCom.value);
});
const BusEventStr = computed(() => {
  return buildBusEventMessage(_bus_event.value?.event);
});
const isExampleChanged = computed(() => {
  let com = PlayCom.value;
  let ex = _example.value;
  let dftProps = com.checkProps(ex.name);
  return !_.isEqual(dftProps, ex.comConf);
});
const LiveComWrapClass = computed(() => {
  return _.kebabCase(`for-${PlayCom.value.race}`);
});
/*-------------------------------------------------------

                    Methods

-------------------------------------------------------*/
function OnSelectExample(name: string) {
  let ex = _example.value;
  ex.name = name;
  ex.comConf = loadLocalSetting(PlayCom.value, ex.name);
  ex.text = JSON5.stringify(ex.comConf, null, 2);
}

function OnResetLocalSetting() {
  let com = PlayCom.value;
  let ex = _example.value;
  let comConf = com.checkProps(ex.name);
  ex.text = JSON5.stringify(comConf, null, 2);
  ex.comConf = comConf;
  removeLocalSetting(PlayCom.value, ex);
}

function OnTextareaChanged() {
  let ex = _example.value;
  parseExampleComConf(ex);
  if (!ex.syntaxErr) {
    formatExampleText(ex);
    saveLocalSetting(PlayCom.value, ex);
  }
}

function ToggleLiveBgMode() {
  _live_bg_mode.value = "none" == _live_bg_mode.value ? "fill" : "none";
  Store.local.set("Ti-Demo-Live-Bg", _live_bg_mode.value);
}

function updateViewMeasure() {
  let rect = Rects.createBy($live.value)
  _view_live.value = rect.toSize2D()
}
/*-------------------------------------------------------

                    Watch

-------------------------------------------------------*/
listenInnerBus(PlayCom, _example.value, updateViewMeasure, _bus_event, inner_bus, outer_bus);
watchProps(props, PlayCom, _example.value);

watch(foldConf, function () {
  let evt = makeAnonymouseEvent(AppEvents.APP_RESIZE)
  if (outer_bus) {
    outer_bus.emit(evt.name, evt)
  }
})
/*-------------------------------------------------------

                  Life Hooks

-------------------------------------------------------*/
onMounted(() => {
  updateViewMeasure()
})
</script>

<template>
  <main class="demo-playground" :class="TopClass" ref="$root">
    <section class="header">
      <ul>
        <li v-for="ex in ExampleList" :class="ex.className">
          <RouterLink v-if="props.exampleAsRouterLink" :to="ex.href">{{ ex.text }}
          </RouterLink>
          <a v-else @click="OnSelectExample(ex.name)">{{ ex.text }}</a>
        </li>
      </ul>
    </section>
    <!--
        消息区
      -->
    <section v-if="showInfo" class="info">
      <!--语法错误提示-->
      <div v-if="hasBusEvent" class="bus-event">
        <TiIcon class="s24" value="zmdi-close" @click="_bus_event = undefined" />
        <span>{{ BusEventStr }}</span>
      </div>
      <!--显示事件消息-->
      <div v-if="hasSyntaxErr" class="syntax-error">
        {{ _example.syntaxErr }}
      </div>
    </section>
    <!--
        控件演示区
      -->
    <section class="com-live" ref="$live">
      <div class="com-live-wrapper" :class="LiveComWrapClass">
        <div class="com-live-con">
          <component :is="PlayCom.com" v-bind="_example.comConf" />
        </div>
      </div>
      <div class="live-mode" @click="ToggleLiveBgMode">
        <i v-if="'fill' == _live_bg_mode" class="fa-solid fa-fill"></i>
        <i v-else class="fa-solid fa-chess-board"></i>
      </div>
    </section>

    <!--配置区-->
    <section class="com-conf">
      <textarea spellcheck="false" v-model="_example.text"
        @change="OnTextareaChanged"></textarea>
      <button v-if="isExampleChanged" @click="OnResetLocalSetting">
        {{ "Reset" }}
      </button>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use "../../../assets/style/_all.scss" as *;
@import "./playground.scss";
</style>
