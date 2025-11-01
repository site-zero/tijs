<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { CrumbProps, CrumbEmitter } from "./ti-crumb-types";
import { useTiCrumbApi } from "./use-ti-crumb-api";
//-----------------------------------------------------
const emit = defineEmits<CrumbEmitter>();
const props = withDefaults(defineProps<CrumbProps>(), {});
const _api = useTiCrumbApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="ti-crumb">This is TiCrumb</div>
</template>
