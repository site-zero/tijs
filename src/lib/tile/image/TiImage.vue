<script lang="ts" setup>
  import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
  import { CssUtils, IconObj } from '../../../';
  import { ImageProps } from './ti-image-types';
  import { useDropping } from './use-dropping';
  import { ImageState, useImage } from './use-image';
  import _ from 'lodash';
  //-----------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: File): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ImageProps>(), {
    canDropFile: true,
    dftSrc: () =>
      ({
        type: 'font',
        value: 'far-image',
        style: {
          fontSize: '64px',
          color: 'var(--ti-color-mask-thin)',
        },
      } as IconObj),
  });
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
      target: () => $img.value as unknown as HTMLElement,
      enter: () => {
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
      <img
        :style="ImageStyle"
        :src="_img.imgSrc"
        @load="_img.loading = false" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-image.scss';
</style>
