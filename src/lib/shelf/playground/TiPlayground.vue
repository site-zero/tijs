<script setup lang="ts">
  import _ from 'lodash';
  import { Ref, computed, onMounted, reactive, ref, watch } from 'vue';
  import {
    DateTime,
    TiComExampleModelTarget,
    Tmpl,
    Util,
    Vars,
  } from '../../../core';
  import { tiCheckComponent } from '../../../lib';
  import TiLayoutGrid from '../layout/grid/TiLayoutGrid.vue';
  import PlayConf from './PlayConf.vue';
  import PlayLive from './PlayLive.vue';
  import PlayTabs from './PlayTabs.vue';
  import { usePlaygroundLayout } from './use-play-layout';
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
  const _example = reactive({} as ExampleState);

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
    let dftComConf = PlayCom.value.checkProps(_example.name);
    return !_.isEqual(_example.comConf, dftComConf);
  });

  const Grid = computed(() => usePlaygroundLayout(_play_layout_mode.value));

  function OnSelectExample(name: string) {
    selectExample(PlayCom.value, _example, name);
  }

  function OnConfReset() {
    let dftComConf = PlayCom.value.checkProps(_example.name);
    _example.comConf = dftComConf;
    saveLocalSetting(PlayCom.value, _example);
  }

  function OnConfChange(confData: Vars) {
    console.log('OnConfChange!!!!', confData);
    _example.comConf = confData;
    saveLocalSetting(PlayCom.value, _example);
  }

  function OnPlayLayoutChange(mode: string) {
    _play_layout_mode.value = mode as PlayLayoutMode;
  }

  function OnLiveBgModeChange(mode: string) {
    _live_bg_mode.value = mode as LiveBgMode;
  }

  function OnToggleConfShown() {
    console.log('OnToggleConfShown');
    if (_layout_shown.value.conf) {
      _layout_shown.value = {};
    } else {
      _layout_shown.value = { conf: true };
    }
  }

  /**
   * 接收到子控件的消息
   */
  const _sub_event_msg: Ref<[string, any[], string]> = ref(['', [], '']);
  function OnSubEvents(eventName: string, args: any[]) {
    let ts = DateTime.format(new Date(), { fmt: 'HH:mm:ss.SSS' });
    _sub_event_msg.value = [eventName, args, ts];
    // 获取数据
    let payload: any = undefined;
    if (args.length == 1) {
      payload = args[0];
    } else if (args.length > 1) {
      payload = args;
    }
    // 适配模式
    let model = PlayCom.value.exampleModel ?? { change: 'value' };
    let target = model[eventName];
    if (target) {
      console.log(target);
      let targets: TiComExampleModelTarget[];
      if (_.isArray(target)) {
        targets = target;
      } else {
        targets = [target];
      }
      let comConf = _.cloneDeep(_example.comConf || {}) as Vars;
      for (let target of targets) {
        // {"change": "value"}
        if (_.isString(target)) {
          let key = Tmpl.exec(target, payload);
          _.set(comConf, key, payload);
        }
        // {"field-change": (val: any, comConf) => void}
        else if (_.isFunction(target)) {
          target(payload, comConf);
        }
        // {"field-change": {key:"data.${name}", value:"=value"}}
        else {
          let key = Tmpl.exec(target.key, payload);
          let val = Util.explainObj(payload, target.val);
          // 确保是普通 Js 对象
          if (val && val instanceof Map) {
            val = Util.mapToObj(val);
          }

          if ('assign' == target.mode) {
            _.assign(comConf[key], val);
          } else if ('merge' == target.mode) {
            _.merge(comConf[key], val);
          } else {
            _.set(comConf, key, val);
          }
        }
      }
      _example.comConf = comConf;
    }
  }
  function cleanSubEvents() {
    _sub_event_msg.value = ['', [], ''];
  }
  const hasSubEvent = computed(() => {
    return _sub_event_msg.value[0] ? true : false;
  });

  watch(
    () => [props.comType, props.example],
    function ([_comType, exampleName]) {
      let com = PlayCom.value;
      selectExample(com, _example, exampleName);
      cleanSubEvents();
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

  onMounted(() => {
    if (PlayCom.value) {
      selectExample(PlayCom.value, _example, props.example);
    }
  });
</script>

<template>
  <div
    class="ti-playground"
    :mode="_play_layout_mode">
    <TiLayoutGrid
      v-bind="Grid"
      :style="{ flex: '1 1 auto', padding: '10px' }"
      :shown="_layout_shown"
      @hide="OnToggleConfShown">
      <template v-slot="{ item }">
        <!--
            Tabs
        -->
        <template v-if="'tabs' == item.name">
          <PlayTabs
            :com="PlayCom"
            :current-example="_example.name"
            :play-layout-mode="_play_layout_mode"
            :live-bg-mode="_live_bg_mode"
            :example-as-router-link="exampleAsRouterLink"
            @change="OnSelectExample"
            @mode:layout="OnPlayLayoutChange"
            @mode:live_bg="OnLiveBgModeChange"
            @toggle:conf="OnToggleConfShown" />
        </template>
        <!--
          Live
        -->
        <template v-else-if="'live' == item.name">
          <PlayLive
            :play-com="PlayCom"
            :play-conf="_example.comConf"
            :mode="_live_bg_mode"
            @sub-event="OnSubEvents" />
        </template>
        <!--
          Conf
        -->
        <template v-else>
          <PlayConf
            :config-data="_example.comConf"
            :config-changed="ExampleChanged"
            @change="OnConfChange"
            @reset="OnConfReset" />
        </template>
      </template>

      <template
        name="panel"
        v-slot:panel="{ panel }">
        <template v-if="'conf' == panel.name">
          <PlayConf
            :config-data="_example.comConf"
            :config-changed="ExampleChanged"
            @change="OnConfChange"
            @reset="OnConfReset" />
        </template>
      </template>
    </TiLayoutGrid>

    <!--显示子控件消息-->
    <div
      v-if="hasSubEvent"
      class="part-sub-event">
      <div class="event-icon">
        <i class="zmdi zmdi-time"></i>
      </div>
      <div
        class="event-time"
        @click="cleanSubEvents">
        {{ _sub_event_msg[2] }}
      </div>
      <div class="event-name">{{ _sub_event_msg[0] }}</div>
      <div class="event-args">{{ _sub_event_msg[1] }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './playground.scss';
</style>
