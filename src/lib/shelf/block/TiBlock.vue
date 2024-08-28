<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onUnmounted } from 'vue';
  import { BlockProps, TiActionBar, TiIcon, useEmitAdaptor } from '../../';
  import { EmitAdaptorPayload } from '../../../_type';
  import { COM_TYPES } from '../../lib-com-types';
  import { BlockEmitter, BlockEvent } from './ti-block-types';
  import { useBlock } from './use-block';
  const COM_TYPE = COM_TYPES.Block;

  defineOptions({
    inheritAttrs: false,
    nameWidth: 0,
  });
  let props = withDefaults(defineProps<BlockProps>(), {});
  //
  //  Features
  //
  const Block = computed(() => useBlock(props, {}));
  let emit = defineEmits<BlockEmitter>();
  const OnAllEvents = computed(() =>
    useEmitAdaptor(COM_TYPE, props, {
      handler: (payload: EmitAdaptorPayload) => {
        //console.log('OnAllEvents.handler', payload);
        emit('happen', {
          ...payload,
          block: _.pick(props, 'title', 'name'),
        });
      },
    })
  );

  function onBlock(event: BlockEvent) {
    emit('happen', event);
  }

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
      :class="Block.HeadClass"
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
        :items="Block.HeadActions"
        :vars="props.actionVars"
        :className="props.actionClass"
        :style="props.actionStyle"
        @fire="emit('fire', $event)" />
    </header>
    <!--Block:Main-->
    <div class="block-main-body-wrapper">
      <main
        :class="Block.MainClass"
        :style="Block.MainStyle">
        <slot>
          <component
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
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-block.scss';
</style>
