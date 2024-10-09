<script setup lang="ts">
  import { CssUtils } from '../../../core';
  import { HtmlPageProps } from './html-page-types';
  import { RenderPage } from './render-page';
  
  //-----------------------------------------------------
  const props = defineProps<HtmlPageProps>();
  //-----------------------------------------------------
  const TopClass = CssUtils.mergeClassName(props.className);
  const TopStyle = CssUtils.toStyle(props.style);
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-html-page"
    :class="TopClass"
    :style="TopStyle">
    <RenderPage :content="props.content" />
  </div>
</template>
