<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, inject, onUnmounted, provide } from 'vue';
  import { BlockProps, TiActionBar, TiIcon, useEmitAdaptor } from '../../';
  import {
    BUS_KEY,
    Callback2,
    TiAppBus,
    TiAppEvent,
    createBus,
  } from '../../../core';
  import { COM_TYPE, useBlock, useBusAdaptor } from './use-block';

  defineOptions({
    name: COM_TYPE,
    inheritAttrs: false,
    nameWidth: 0,
  });
  let props = withDefaults(defineProps<BlockProps>(), {});
  //
  //  Bus & Notify & Emit
  //
  let parentBus = inject(BUS_KEY);
  //
  // 适配消息总线
  //
  if (parentBus) {
    let busName = COM_TYPE;
    if (props.name) {
      busName += `[${props.name}]`;
    }
    let blockBus: TiAppBus = createBus<TiAppEvent>(busName);
    useBusAdaptor(onUnmounted, parentBus, blockBus, props.name);
    provide(BUS_KEY, blockBus);
  }
  //
  //  Features
  //
  const Block = computed(() => useBlock(props, {}));
  let emit = defineEmits<Callback2<string, any>>();
  const OnAllEvents = useEmitAdaptor(COM_TYPE, props, emit);

  //
  // Life Hooks
  //
  onUnmounted(() => {});
</script>

<template>
  <div
    class="ti-block"
    :class="Block.TopClass"
    :style="Block.TopStyle">
    <!--Block:Head-->
    <header
      v-if="Block.showHeadBar"
      :style="Block.HeadStyle">
      <!---------Icon------------>
      <div
        class="as-icon"
        v-if="Block.BlockIcon">
        <TiIcon
          class="s16"
          :value="Block.BlockIcon" />
      </div>
      <!--------Title----------->
      <div
        class="as-title"
        v-if="Block.BlockTitle">
        {{ Block.BlockTitle }}
      </div>
      <!--------ActionBar--------->
      <TiActionBar
        v-if="!_.isEmpty(Block.HeadActions)"
        :items="Block.HeadActions" />
    </header>
    <!--Block:Main-->
    <main :style="Block.MainStyle">
      <slot>
        <component
          :is="Block.BlockComType"
          v-bind="Block.BlockComConf"
          v-on="OnAllEvents" />
      </slot>
    </main>
  </div>
</template>

<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-block.scss';
</style>
