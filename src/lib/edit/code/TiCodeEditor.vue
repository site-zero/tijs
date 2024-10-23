<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, watch } from 'vue';
  import { Vars } from '../../../_type';
  import { CssUtils, Icons } from '../../../core';
  import { RoadblockProps, TiLoading, TiRoadblock } from '../../../lib';
  import { CodeEditorEmitter, CodeEditorProps } from './ti-code-editor-types';
  import { useCodeAce } from './use-code-ace';
  //-----------------------------------------------------
  const emit = defineEmits<CodeEditorEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<CodeEditorProps>(), {
    theme: 'auto',
    editorStatus: 'ready',
    editorStyle: () => ({
      fontFamily: "Consolas, 'Courier New', monospace",
      lineHeight: '1.5em',
      fontSize: '14px',
    }),
    editorOptions: () => ({
      useSoftTabs: true,
      tabSize: 2,
    }),
    editorTheme: () => ({
      light: 'tomorrow',
      dark: 'tomorrow_night_bright',
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
  const EditorStyle = computed(() => {
    let _css = [props.editorStyle ?? {}] as Vars[];
    if (_.isNil(props.editorStatus) || 'empty' == props.editorStatus) {
      _css.push({ display: 'none' });
    }
    return CssUtils.mergeStyles(_css);
  });
  //-----------------------------------------------------
  const EditorIcon = computed(() => {
    return Icons.getIcon(
      {
        mime: props.mime,
        type: props.type,
      },
      'far-file'
    );
  });
  const EmptyRoadblockConfig = computed(() => {
    return _.assign(
      {
        class: 'is-disable-r',
        mode: 'cover',
        layout: 'A',
        size: 'normal',
        opacity: 1,
        text: 'i18n:nil-content',
        icon: EditorIcon.value,
      } as RoadblockProps,
      props.emptyRoadblock
    );
  });
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
    <div class="editor-wrapper">
      <main
        ref="$main"
        class="fit-parent"
        :style="EditorStyle">
        {{ Ace.version }}
      </main>
      <!-----< tip >------->
      <!--aside>{{ editorStatus }}</aside-->
      <!-----< loading >------->
      <TiLoading
        v-if="'loading' == props.editorStatus"
        mode="cover"
        layout="A"
        size="normal"
        :opacity="0.4" />
      <!-----< saving >------->
      <TiLoading
        v-else-if="'saving' == props.editorStatus"
        class-name="is-info"
        mode="cover"
        layout="A"
        size="normal"
        :opacity="0.4"
        icon="fas-gear fa-spin"
        text="i18n:saving" />
      <!-----< loading >------->
      <TiRoadblock
        v-else-if="'empty' == props.editorStatus"
        v-bind="EmptyRoadblockConfig" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-code-editor.scss';
</style>
