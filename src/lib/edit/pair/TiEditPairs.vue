<script lang="ts" setup>
  import { TiEditPairsEmitter, TiEditPairsProps } from "./edit-pairs-types";
  import { useTiEditPairsApi } from "./use-edit-pairs-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiEditPairsEmitter>();
  const props = withDefaults(defineProps<TiEditPairsProps>(), {});
  const api = useTiEditPairsApi(props, emit);
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-pairs">This is TiEditPair</div>
</template>
<style lang="sass" scoped>
  @use "./edit-pairs.scss";
</style>
