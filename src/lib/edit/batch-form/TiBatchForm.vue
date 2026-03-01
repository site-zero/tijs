<script lang="ts" setup>
  import { BatchFormNameProps, FieldComProps, TiForm } from "@site0/tijs";
  import _ from "lodash";
  import { computed, ref } from "vue";
  import { TiBatchFormEmitter, TiBatchFormProps } from "./ti-batch-form-types";
  import { useTiBatchFormApi } from "./use-ti-batch-form-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiBatchFormEmitter>();
  const props = withDefaults(defineProps<TiBatchFormProps>(), {});
  const _api = useTiBatchFormApi(props, emit);
  //-----------------------------------------------------
  const _checked_name = ref<Record<string, boolean>>({});
  //-----------------------------------------------------
  const FormConfig = computed(() => {
    return _.omit(props, "defaultFieldTitleBy");
  });
  //-----------------------------------------------------
  const DefaultFieldTitleBy = computed((): FieldComProps => {
    return {
      dynamic: true,
      comType: "BatchFormName",
      comConf: {
        title: "=title",
        name: "=name",
        checkedNames: _checked_name.value,
      } as BatchFormNameProps,
    };
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
    :default-field-title-by="DefaultFieldTitleBy"
    @name-change="onNameChange"
    @change="emit('change', $event)" />
</template>
