<script lang="ts" setup>
  import { useTemplateRef } from "vue";
  import { InputBox3Emitter, InputBox3Props } from "./ti-input-box3-types";
  import { useTiInputBox3Api } from "./use-ti-input-box3-api";
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $input = useTemplateRef<HTMLInputElement>("input");
  //-----------------------------------------------------
  const emit = defineEmits<InputBox3Emitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBox3Props>(), {});
  const _api = useTiInputBox3Api(props, {
    emit,
    getTopElement: () => $el.value,
    getInputElement: () => $input.value,
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-box3">This is TiInputBox3</div>
</template>
<style lang="scss">
  @use "./ti-input-box3.scss";
</style>
