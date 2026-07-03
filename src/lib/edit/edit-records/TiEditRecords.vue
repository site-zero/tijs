<script lang="ts" setup>
  import { TiTable } from "@site0/tijs";
  import { computed, watch } from "vue";
  import { EditRecordsEmitter, EditRecordsProps } from "./edit-records-types";
  import { useTiEditRecordsTableConfig } from "./gui-edit-records-table";
  import { useEditRecordsApi } from "./use-edit-records-api";
  //-----------------------------------------------------
  const emit = defineEmits<EditRecordsEmitter>();
  const props = withDefaults(defineProps<EditRecordsProps>(), {});
  const api = useEditRecordsApi(props, emit);
  //-----------------------------------------------------
  const TableConfig = computed(() => useTiEditRecordsTableConfig(props, api));
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
  <TiTable v-bind="TableConfig" />
</template>
