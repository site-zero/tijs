<script lang="ts" setup>
  import { TiLayoutGrid } from "@site0/tijs";
  import { computed } from "vue";
  import { EditPairsEmitter, EditPairsProps } from "./edit-pairs-types";
  import { useEditPairsLayout } from "./gui-edit-pairs-layout";
  import { useEditPairsSchema } from "./gui-edit-pairs-schema";
  import { get_tab_items } from "./support/";
  import { useTiEditPairsApi } from "./use-edit-pairs-api";
  //-----------------------------------------------------
  const emit = defineEmits<EditPairsEmitter>();
  const props = withDefaults(defineProps<EditPairsProps>(), {
    valueType: "auto",
    valueMode: "flat",
    formMode: "simple",
  });
  //-----------------------------------------------------
  const api = useTiEditPairsApi(props, emit);
  //-----------------------------------------------------
  const GUILayout = computed(() => useEditPairsLayout(props, api));
  const GUISchema = computed(() => useEditPairsSchema(props, api));
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-pairs">
    <TiLayoutGrid v-bind="GUILayout" :schema="GUISchema" />
  </div>
</template>
<style lang="sass" scoped>
  @use "./edit-pairs.scss";
</style>
