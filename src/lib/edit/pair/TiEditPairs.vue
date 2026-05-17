<script lang="ts" setup>
  import { computed } from "vue";
  import { TiEditPairsEmitter, TiEditPairsProps } from "./edit-pairs-types";
  import { get_tab_items } from "./support/";
  import { useTiEditPairsApi } from "./use-edit-pairs-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiEditPairsEmitter>();
  const props = withDefaults(defineProps<TiEditPairsProps>(), {
    valueType: "auto",
    valueMode: "flat",
    formMode: "simple",
  });
  const api = useTiEditPairsApi(props, emit);
  //-----------------------------------------------------
  const TabItems = computed(() => get_tab_items(props, api));
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-pairs">This is TiEditPair</div>
</template>
<style lang="sass" scoped>
  @use "./edit-pairs.scss";
</style>
