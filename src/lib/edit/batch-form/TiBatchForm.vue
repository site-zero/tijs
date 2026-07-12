<script lang="ts" setup>
  import { BatchFormNameProps, FormProps, TiForm } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { BatchFormEmitter, BatchFormProps } from "./ti-batch-form-types";
  import { useTiBatchFormApi } from "./use-ti-batch-form-api";
  //-----------------------------------------------------
  const emit = defineEmits<BatchFormEmitter>();
  const props = withDefaults(defineProps<BatchFormProps>(), {
    changeMode: "all",
  });
  //-----------------------------------------------------
  const api = useTiBatchFormApi(props, emit);
  //-----------------------------------------------------
  const FormConfig = computed(() => {
    const re: FormProps = {
      ..._.omit(props, "defaultFieldTitleBy", "changeMode"),
      // 表单仅仅给变化就好，自己来判断更稳妥
      changeMode: "diff",
    };
    const is_disable = (ctx: any) => {
      return api.isFieldDisabled(ctx);
    };
    re.overrideVisibility = "assign";
    re.disabled = is_disable;
    re.readonly = is_disable;
    re.defaultFieldTitleBy = {
      dynamic: true,
      comType: "BatchFormName",
      comConf: {
        title: "=title",
        name: "=name",
        checkedNames: api.CheckedNames.value,
      } as BatchFormNameProps,
    };
    return re;
  });

  //-----------------------------------------------------
</script>
<template>
  <TiForm
    v-bind="FormConfig"
    @name-change="api.onNameChange"
    @change="api.onFormChange" />
</template>
