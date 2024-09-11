<script lang="ts" setup>
  import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
  import { CssUtils, Dom } from '../../../';
  import { ImageProps } from './ti-image-types';
  import { useDropping } from './use-dropping';
  import { ImageState, useImage } from './use-image';

  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const props = defineProps<ImageProps>();
  //const $draw = useTemplateRef<HTMLDivElement>('draw');
  const _img: ImageState = reactive({
    imgSrc: '',
    mode: 'img',
    iconHtml: undefined,
  });
  //-----------------------------------------------------
  const Img = useImage(props, _img);
  const _drag_enter = ref(true);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      'drag-enter': _drag_enter.value,
      'is-loading': _img.loading,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle({
      ...(props.style ?? {}),
      width: props.width,
      height: props.height,
    });
  });
  //-----------------------------------------------------
  const ImageStyle = computed(() => {
    return CssUtils.toStyle({
      ...(props.imgStyle ?? {}),
      objectFit: props.objectFit,
    });
  });
  //-----------------------------------------------------
  const $img = useTemplateRef('img');
  const dropping = computed(() =>
    useDropping({
      target: $img,
      enter: () => {
        _drag_enter.value = true;
      },
      leave: () => {
        _drag_enter.value = false;
      },
      drop: (files) => {
        console.log(files);
      },
    })
  );
  watch(
    () => $img.value,
    () => {
      dropping.value();
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
    <img
      :style="ImageStyle"
      :src="_img.imgSrc"
      @load="_img.loading = false" />
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-image.scss';
</style>
