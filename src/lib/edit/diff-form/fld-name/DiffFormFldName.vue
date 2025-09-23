<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { DiffFormFldNameProps, DiffFormFldNameEmitter } from "./diff-form-fld-name-types";
import { useDiffFormFldNameApi } from "./use-diff-form-fld-name-api";
//-----------------------------------------------------
const emit = defineEmits<DiffFormFldNameEmitter>();
const props = withDefaults(defineProps<DiffFormFldNameProps>(), {});
const _api = useDiffFormFldNameApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="diff-form-fld-name">This is DiffFormFldName</div>
</template>
