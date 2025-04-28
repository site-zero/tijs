<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import { ActionBarEvent, TiActionBar, TiThumb } from '../../../';
  import { CssUtils } from '../../../../core';
  import { useDropping } from '../../../_features';
  import { onUploadActionFire, useUploadDropping } from '../use-uploader';
  import { UploadTileEmitter, UploadTileProps } from './ti-upload-tile-types';
  import { useUploadTile } from './use-upload-tile';
  //-----------------------------------------------------
  const emit = defineEmits<UploadTileEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<UploadTileProps>(), {
    textSize: 's',
    textPadding: 's',
    textAlign: 'center',
    boxRadius: 's',
    borderStyle: 'solid',
    uploadButton: true,
    clearButton: true,
    width: '120px',
    height: '120px',
    // tip: '点击或拖拽文件到此处上传',
    // type: 'danger',
  });
  //-----------------------------------------------------
  const _tile = useUploadTile(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'drag-enter': _drag_enter.value,
      'nil-value': props.nilValue,
      'in-progress': _tile.InProgress.value,
      [`is-${props.type}`]: !!props.type,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let css = {
      '--tile-color-border': `var(--ti-color-border-thin)`,
      '--tile-color-text': `var(--ti-color-card-f)`,
      '--tile-color-bg': `var(--ti-color-card)`,
    };
    if (props.type) {
      css['--tile-color-border'] = `var(--ti-color-${props.type})`;
      css['--tile-color-text'] = `var(--ti-color-${props.type})`;
      css['--tile-color-bg'] = `var(--ti-color-${props.type}-r)`;
    }
    return CssUtils.mergeStyles([css, props.style]);
  });
  //-----------------------------------------------------
  const MainStyle = computed(() => {
    return CssUtils.mergeStyles([
      {
        width: CssUtils.toSize(props.width) ?? '120px',
        height: CssUtils.toSize(props.height) ?? '120px',
      },
      props.style,
    ]);
  });
  //-----------------------------------------------------
  function onActionFire(event: ActionBarEvent) {
    onUploadActionFire(event, emit);
  }
  //-----------------------------------------------------
  const _drag_enter = ref(false);
  const $main = useTemplateRef<HTMLElement>('main');
  const dropping = computed(() =>
    useUploadDropping(_drag_enter, $main, emit, _tile.InProgress)
  );
  //-----------------------------------------------------
  onMounted(() => {
    dropping.value();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-upload-tile"
    :class="TopClass"
    :style="TopStyle">
    <main
      ref="main"
      :style="MainStyle"
      :border="props.borderStyle"
      :radius="props.boxRadius">
      <TiThumb v-bind="_tile.ObjThumb.value" />
      <div class="part-actions">
        <TiActionBar
          layout-mode="V"
          topItemAspectMode="button"
          item-size="t"
          v-bind="_tile.ActionBar.value"
          @fire="onActionFire" />
      </div>
    </main>
  </div>
</template>
<style lang="scss">
  @use './ti-upload-tile.scss';
</style>
