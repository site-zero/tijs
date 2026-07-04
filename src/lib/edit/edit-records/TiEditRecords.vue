<script lang="ts" setup>
  import { TiActionBar, TiTable } from "@site0/tijs";
  import { computed, watch } from "vue";
  import { EditRecordsEmitter, EditRecordsProps } from "./edit-records-types";
  import { useTiEditRecordsTableConfig } from "./gui-edit-records-table";
  import { useTiEditRecordsActions } from "./use-edit-records-actions";
  import { useEditRecordsApi } from "./use-edit-records-api";
  //-----------------------------------------------------
  const emit = defineEmits<EditRecordsEmitter>();
  const props = withDefaults(defineProps<EditRecordsProps>(), {});
  const api = useEditRecordsApi(props, emit);
  //-----------------------------------------------------
  const TableConfig = computed(() => useTiEditRecordsTableConfig(props, api));
  const ActionConfig = computed(() => useTiEditRecordsActions(props, api));
  //-----------------------------------------------------
  watch(
    () => props.value,
    () => {
      api.initData();
    },
    { immediate: true, deep: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <TiTable v-bind="TableConfig">
    <template #head>
      <TiActionBar v-bind="ActionConfig" />
    </template>
  </TiTable>
</template>
