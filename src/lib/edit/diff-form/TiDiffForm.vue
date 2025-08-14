<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { TiDiffFormProps, TiDiffFormEmitter } from "./ti-diff-form-types";
import { useTiDiffFormApi } from "./use-ti-diff-form-api";
//-----------------------------------------------------
const emit = defineEmits<TiDiffFormEmitter>();
const props = withDefaults(defineProps<TiDiffFormProps>(), {});
const _api = useTiDiffFormApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="ti-diff-form">This is TiDiffForm</div>
</template>
