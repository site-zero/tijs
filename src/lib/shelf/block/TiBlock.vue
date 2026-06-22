<script lang="ts" setup>
  import {
    BlockProps,
    EmitAdaptorOptions,
    TiActionBar,
    TiIcon,
    useEmitAdaptor,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed, onUnmounted, useTemplateRef } from "vue";
  import { EmitAdaptorEvent } from "../../../_type";
  import { COM_TYPES } from "../../lib-com-types";
  import { BlockEmitter, BlockEvent } from "./ti-block-types";
  import { useBlock } from "./use-block";
  const COM_TYPE = COM_TYPES.Block;

  defineOptions({
    inheritAttrs: false,
    nameWidth: 0,
  });
  let props = withDefaults(defineProps<BlockProps>(), {});
  const $com = useTemplateRef("com");
  //
  //  Features
  //
  const Block = computed(() => useBlock(props, {}));
  let emit = defineEmits<BlockEmitter>();
  const OnAllEvents = computed(() =>
    useEmitAdaptor(COM_TYPE, props, {
      handler: (payload: EmitAdaptorEvent) => {
        //console.log('OnAllEvents.handler', payload);
        emit("happen", {
          ...payload,
          block: _.pick(props, "title", "name"),
        });
      },
    } as EmitAdaptorOptions)
  );

  function onBlock(event: BlockEvent) {
    emit("happen", event);
  }

  //
  // Life Hooks
  //
  onUnmounted(() => {});

  //
  // Export API
  //
  defineExpose({
    getCom<T>() {
      if ($com.value) {
        return $com.value as unknown as T;
      }
    },
    isMyName(name: string) {
      return props.name == name;
    },
  });
</script>

<template>
  <div class="ti-block" :class="Block.TopClass" :style="Block.TopStyle">
    <!--Block:Head-->
    <header
      v-if="Block.showHeadBar"
      :class="Block.HeadClass"
      :style="Block.HeadStyle">
      <!---------Icon------------>
      <div class="as-icon" v-if="Block.BlockIcon">
        <TiIcon class="s16" :value="Block.BlockIcon" />
      </div>
      <!--------Title----------->
      <div class="as-title" v-if="Block.BlockTitle" :style="Block.TitleStyle">
        {{ Block.BlockTitle }}
      </div>
      <!--------ActionBar--------->
      <TiActionBar
        v-if="!_.isEmpty(Block.HeadActions)"
        v-bind="Block.HeadActions"
        :topItemMinWidth="null"
        @fire="emit('fire', $event)" />
    </header>
    <!--Block:Main-->
    <div
      class="block-main-body-wrapper"
      :class="Block.BodyClass"
      :style="Block.BodyStyle">
      <main :class="Block.MainClass" :style="Block.MainStyle">
        <slot>
          <component
            ref="com"
            :is="Block.BlockComType"
            v-bind="Block.BlockComConf"
            @_sub_block="onBlock"
            v-on="OnAllEvents" />
        </slot>
      </main>
    </div>
  </div>
</template>

<style lang="scss">
  @use "./ti-block.scss";
</style>
