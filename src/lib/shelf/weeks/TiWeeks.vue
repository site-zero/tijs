<script lang="ts" setup>
import { ActionBarEvent, TiLayoutGrid } from "@site0/tijs";
import { computed, watch } from "vue";
import { TiWeeksProps, TiWeeksEmitter } from "./ti-weeks-types";
import { useTiWeeksApi } from "./use-ti-weeks-api";
//-----------------------------------------------------
const emit = defineEmits<TiWeeksEmitter>();
const props = withDefaults(defineProps<TiWeeksProps>(), {});
const _api = useTiWeeksApi(props, emit);
//-----------------------------------------------------
</script>
<template>
  <div class="ti-weeks">This is TiWeeks</div>
</template>
<style lang="scss">
@use "./ti-weeks.scss";
</style>
