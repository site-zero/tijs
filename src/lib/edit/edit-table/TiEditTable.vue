<script lang="ts" setup>
import { TiLayoutGrid } from "@site0/tijs";
import { computed, watch, onMounted } from "vue";
import { EditTableProps, EditTableEmitter } from "./edit-table-types";
import { useEditTableApi } from "./use-edit-table-api";
//-----------------------------------------------------
const emit = defineEmits<EditTableEmitter>();
const props = withDefaults(defineProps<EditTableProps>(), {});
const _api = useEditTableApi(props, {emit});
//-----------------------------------------------------
  onMounted(async () => {
    await _api.refresh();
  });
//-----------------------------------------------------
</script>
<template>
  <div class="ti-edit-table">This is TiEditTable</div>
</template>
