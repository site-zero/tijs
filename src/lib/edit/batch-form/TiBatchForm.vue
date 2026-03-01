<script lang="ts" setup>
  import { TiForm } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { TiBatchFormEmitter, TiBatchFormProps } from "./ti-batch-form-types";
  import { useTiBatchFormApi } from "./use-ti-batch-form-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiBatchFormEmitter>();
  const props = withDefaults(defineProps<TiBatchFormProps>(), {});
  const _api = useTiBatchFormApi(props, emit);
  //-----------------------------------------------------
  const FormConfig = computed(() => {
    return _.omit(props, "defaultFieldTitleBy");
  });
  //-----------------------------------------------------
  function onNameChange(payload: any) {
    console.log("onNameChange", payload);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiForm
    v-bind="FormConfig"
    @name-change="onNameChange"
    @change="emit('change', $event)" />
</template>
