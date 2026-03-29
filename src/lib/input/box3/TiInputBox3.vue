<script lang="ts" setup>
  import { TiInputBox3Emitter, TiInputBox3Props } from "./ti-input-box3-types";
  import { useTiInputBox3Api } from "./use-ti-input-box3-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiInputBox3Emitter>();
  const props = withDefaults(defineProps<TiInputBox3Props>(), {});
  const _api = useTiInputBox3Api(props, { emit });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-box3">This is TiInputBox3</div>
</template>
<style lang="scss">
  @use "./ti-input-box3.scss";
</style>
