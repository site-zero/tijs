<script lang="ts" setup>
  import { CssUtils } from "@site0/tijs";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import { TiHtmlFrameEmitter, TiHtmlFrameProps } from "./ti-html-frame-types";
  //-----------------------------------------------------
  defineOptions({ inheritAttrs: false });
  //-----------------------------------------------------
  const $iframe = useTemplateRef<HTMLIFrameElement>("iframe");
  const _frame_ready = ref(false);
  //-----------------------------------------------------
  const emit = defineEmits<TiHtmlFrameEmitter>();
  const props = withDefaults(defineProps<TiHtmlFrameProps>(), {});
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  const FrameClass = computed(() => CssUtils.mergeClassName(props.frameClass));
  const FrameStyle = computed(() => CssUtils.toStyle(props.frameStyle));
  //-----------------------------------------------------
  function updateFrameContent() {
    // 防守
    if (!_frame_ready.value || !$iframe.value) return;
    let frm = $iframe.value;

    // 更新内容
    let frm_doc = frm.contentDocument || frm.contentWindow?.document;
    if (frm_doc) {
      frm_doc.body.innerHTML = props.value || "&nbsp;";
    }
    // 警告一下
    else {
      console.warn("iframe fail to get contentDocument");
    }
  }
  //-----------------------------------------------------
  watch(
    () => props.value,
    (newv, oldv) => {
      if (newv != oldv) {
        updateFrameContent();
      }
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    if ($iframe.value) {
      $iframe.value.addEventListener("load", (_a) => {
        // console.log('iframe loade d', a.target);
        _frame_ready.value = true;
        // 尝试更新
        updateFrameContent();
      });
    }
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-html-frame fit-parent" :class="TopClass" :style="TopStyle">
    <iframe
      width="100%"
      height="100%"
      frameborder="0"
      ref="iframe"
      :class="FrameClass"
      :style="FrameStyle"></iframe>
  </div>
</template>
<style lang="scss">
  @use "./ti-html-frame.scss";
</style>
