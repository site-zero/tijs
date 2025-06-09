<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { TinyMCEditorEmitter, TinyMCEditorProps } from "./ti-tiny-mc-editor-types";
import { useTinyMCEditorLayout } from "./use-tiny-mc-editor-layout";
import { useTinyMCEditorSchema } from "./use-tiny-mc-editor-schema";
import tinymce from 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/skins/ui/oxide/skin.min.css';

const emit = defineEmits<TinyMCEditorEmitter>();
const props = withDefaults(defineProps<TinyMCEditorProps>(), {});

const editorRef = ref<HTMLDivElement | null>(null);
const editor = ref<any>(null);

onMounted(() => {
  if (editorRef.value) {
    tinymce.init({
      target: editorRef.value,
      plugins: 'paste link',
      toolbar: 'undo redo | bold italic | link',
      skin: false,
      content_css: false,
      init_instance_callback: (inst: any) => {
        editor.value = inst;
        if (props.initialValue) {
          editor.value.setContent(props.initialValue);
        }
        inst.on('change', () => {
          emit('change', inst.getContent());
        });
      }
    });
  }
});

const GUILayout = useTinyMCEditorLayout(props);
const GUISchema = useTinyMCEditorSchema(props);
</script>
<template>
  <div class="ti-tiny-mce-editor">
    <div ref="editorRef"></div>
  </div>
</template>
<style lang="scss">
@use "./ti-tiny-mc-editor.scss";
</style>