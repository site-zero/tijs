<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch, onMounted } from "vue";
import { BatchFormNameProps, BatchFormNameEmitter } from "./batch-form-name-types";
import { useBatchFormNameApi } from "./use-batch-form-name-api";
//-----------------------------------------------------
const emit = defineEmits<BatchFormNameEmitter>();
const props = withDefaults(defineProps<BatchFormNameProps>(), {});
const _api = useBatchFormNameApi(props, emit);
//-----------------------------------------------------
  onMounted(async () => {
    
  });
//-----------------------------------------------------
</script>
<template>
  <div class="batch-form-name">This is BatchFormName</div>
</template>
