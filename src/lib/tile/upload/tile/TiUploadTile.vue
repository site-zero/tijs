<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, useTemplateRef } from 'vue';
  import { ActionBarEvent, TiThumb } from '../../../';
  import { CssUtils } from '../../../../core';
  import { useDropping } from '../../../_features';
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
    uploadButton: true,
    clearButton: false,
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
      [`is-${props.type}`]: !!props.type,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //-----------------------------------------------------
  let $file = useTemplateRef<HTMLInputElement>('file');
  //-----------------------------------------------------
  function onActionFire(event: ActionBarEvent) {
    let fn = {
      'choose-file': () => {
        if ($file.value) {
          $file.value.click();
        }
      },
      'clear': () => {
        emit('clear');
      },
    }[event.name as string];
    if (fn) {
      fn();
    } else {
      emit('fire', event.payload);
    }
  }
  //-----------------------------------------------------
  function onSelectLocalFilesToUpload(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
      let f = _.first(files);
      if (f) {
        emit('upload', f);
      }
    }
  }
  //-----------------------------------------------------
  const _drag_enter = ref(false);
  const $main = useTemplateRef<HTMLElement>('main');
  const dropping = computed(() =>
    useDropping({
      target: () => $main.value,
      enter: () => {
        _drag_enter.value = true;
      },
      over: () => {
        _drag_enter.value = true;
      },
      leave: () => {
        _drag_enter.value = false;
      },
      drop: (files) => {
        //console.log(files);
        let f = _.first(files);
        if (f) {
          emit('upload', f);
        }
      },
    })
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
    <main ref="main">
      <TiThumb v-bind="_tile.ObjThumb.value" />
    </main>
  </div>
</template>
<style lang="scss">
  @use './ti-upload-tile.scss';
</style>
