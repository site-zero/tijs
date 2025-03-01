<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
  import { CssUtils } from '../../../core';
  import { useDropping } from '../../_features';
  import { ImageProps } from './ti-image-types';
  import { ImageState, useImage } from './use-image';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: File): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ImageProps>(), {
    canDropFile: false,
  });
  //-----------------------------------------------------
  //const $draw = useTemplateRef<HTMLDivElement>('draw');
  const _img: ImageState = reactive({
    imgSrc: '',
    mode: 'img',
    iconHtml: undefined,
    loading: false,
  });
  //-----------------------------------------------------
  const Img = useImage(props, _img);
  const _drag_enter = ref(false);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        'drag-enter': _drag_enter.value,
        'is-loading': _img.loading,
      },
      props.borderRadius ? `r-${props.borderRadius}` : undefined
    )
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle({
      width: props.width,
      height: props.height,
      ...(props.style ?? {}),
    });
  });
  //-----------------------------------------------------
  const ImageStyle = computed(() => {
    return CssUtils.toStyle({
      objectFit: props.objectFit,
      ...(props.imgStyle ?? {}),
    });
  });
  //-----------------------------------------------------
  const $img = useTemplateRef('img');
  const dropping = computed(() =>
    useDropping({
      target: () => $img.value as unknown as HTMLElement,
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
        _img.local_file = f ?? undefined;
        if (f) {
          emit('change', f);
        }
      },
    })
  );
  //-----------------------------------------------------
  watch(
    () => [$img.value, props.canDropFile],
    () => {
      if (props.canDropFile) {
        dropping.value();
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => props.src,
    () => {
      _img.local_file = undefined;
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => Img.Src.value,
    () => {
      Img.loadImageSrc();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    :class="TopClass"
    :style="TopStyle"
    class="ti-image"
    ref="img"
    :img-mode="_img.mode">
    <div class="image-con">
      <aside v-if="_img.loading">
        <i class="fas fa-cog fa-spin loading-icon"></i>
      </aside>
      <div
        class="as-icon"
        v-if="_img.iconHtml"
        v-html="_img.iconHtml"></div>
      <img
        v-else
        :style="ImageStyle"
        :src="_img.imgSrc"
        @load="_img.loading = false" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-image.scss';
</style>
