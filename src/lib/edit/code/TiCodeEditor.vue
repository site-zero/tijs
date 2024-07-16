<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue';
  import { CodeEditorEmitter, CodeEditorProps } from './ti-code-editor-types';
  import { useCodeAce } from './use-code-ace';
  import { CssUtils } from '../../../core';
  //-----------------------------------------------------
  const emit = defineEmits<CodeEditorEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<CodeEditorProps>(), {
    theme: 'auto',
    editorStyle: () => ({
      fontFamily: "Consolas, 'Courier New', monospace",
      lineHeight: '1.5em',
      fontSize: '14px',
    }),
    editorOptions: () => ({
      useSoftTabs: true,
      tabSize: 2,
    }),
  });
  const $main = ref<HTMLElement>();
  //-----------------------------------------------------
  const Ace = computed(() => useCodeAce(props, emit));
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  const TopStyle = computed(() => CssUtils.mergeStyles(props.style ?? {}));
  //-----------------------------------------------------
  watch(
    () => Ace.value.EditorTheme.value,
    () => {
      Ace.value.updateEditorTheme();
    }
  );
  //-----------------------------------------------------
  watch(
    () => [props.type, props.mime],
    () => {
      Ace.value.updateEditorMode();
    }
  );
  //-----------------------------------------------------
  watch(
    () => props.editorOptions,
    () => {
      Ace.value.updateEditorOptions();
    }
  );
  //-----------------------------------------------------
  watch(
    () => props.value,
    () => {
      Ace.value.updateEditorValue();
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    Ace.value.setupEditor($main.value!);
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-code-editor"
    :class="TopClass"
    :style="TopStyle">
    <main
      ref="$main"
      class="fit-parent"
      :style="Ace.EditorStyle">
      {{ Ace.version }}
    </main>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-code-editor.scss';
</style>
