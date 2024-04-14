<script lang="ts" setup>
  import { computed, inject, onUnmounted, provide } from 'vue';
  import { BUS_KEY, BlockProps, TiAppBus, TiAppEvent, TiIcon } from '../../';
  import { createBus } from '../../../core';
  import { COM_TYPE, useBlock, useBusAdaptor } from './use-block';

  /*-------------------------------------------------------

                   Com Options

-------------------------------------------------------*/
  defineOptions({
    name: COM_TYPE,
    inheritAttrs: false,
    nameWidth: 0,
  });
  /*-------------------------------------------------------

                      Props

-------------------------------------------------------*/
  let props = withDefaults(defineProps<BlockProps>(), {});
  /*-------------------------------------------------------

                  Bus & Notify & Emit

-------------------------------------------------------*/
  //
  // 获取上层总线
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
  /*-------------------------------------------------------

                    Features

-------------------------------------------------------*/
  const Block = computed(() => useBlock(props, {}));

  /*-------------------------------------------------------

                Life Hooks

-------------------------------------------------------*/
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
      <TiIcon
        v-if="Block.BlockIcon"
        :value="Block.BlockIcon" />
      <div
        class="as-title"
        v-if="Block.BlockTitle">
        {{ Block.BlockTitle }}
      </div>
    </header>
    <!--Block:Main-->
    <main :style="Block.MainStyle">
      <slot>
        <component
          :is="Block.BlockComType"
          v-bind="Block.BlockComConf" />
      </slot>
    </main>
  </div>
</template>

<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-block.scss';
</style>
