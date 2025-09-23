<script lang="ts" setup>
  import { FormProps, TiForm } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { TiDiffFormEmitter, TiDiffFormProps } from "./ti-diff-form-types";
  import { useTiDiffFormApi } from "./use-ti-diff-form-api";
  //-----------------------------------------------------
  const emit = defineEmits<TiDiffFormEmitter>();
  const props = withDefaults(defineProps<TiDiffFormProps>(), {});
  const _api = useTiDiffFormApi(props, emit);
  //-----------------------------------------------------
  const FormConfig = computed(() => {
    return {
      ..._.omit(props, "referData"),
      defaultFieldTitleBy: {
        dynamic: true,
        comType: "DiffFormFldName",
        comConf: {
          title: "=title",
          name: "=name",
          delta: "=delta",
        },
      },
    } as FormProps;
  });
  //-----------------------------------------------------
</script>
<template>
  <TiForm v-bind="FormConfig" />
</template>
