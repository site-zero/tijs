<script lang="ts" setup>
  import { useTemplateRef } from "vue";
  import { FormProps, GridFieldsEmitter, TiGridFields } from "../..";
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<FormProps>(), {
    changeMode: "diff",
    allowUndefinedFields: true,
    makeVirtualField: true,
  });
  //-------------------------------------------------
  const $main = useTemplateRef<InstanceType<typeof TiGridFields>>("main");
  //-------------------------------------------------
  defineExpose({
    getUsedFields: function () {
      return $main.value?.getUsedFields();
    },
  });
  //-------------------------------------------------
</script>
<template>
  <TiGridFields
    ref="main"
    v-bind="props"
    @change="emit('change', $event)"
    @change-fields="emit('change-fields', $event)"
    @change-validate="emit('change-validate', $event)"
    @name-change="emit('name-change', $event)"
    @dom-ready="emit('dom-ready', $event)">
    <template v-slot:head>
      <slot name="head"></slot>
    </template>
  </TiGridFields>
</template>
<style lang="scss" scoped>
  @use "../../../assets/style/_all.scss" as *;
</style>
