<script lang="ts" setup>
  import { TiForm, TiTabsForm, Vars } from "@site0/tijs";
  import { computed } from "vue";
  import { EditPairsEmitter, EditPairsProps } from "./edit-pairs-types";
  import { useEditPairsForm } from "./gui-edit-pairs-form";
  import { useTiEditPairsApi } from "./use-edit-pairs-api";
  //-----------------------------------------------------
  const emit = defineEmits<EditPairsEmitter>();
  const props = withDefaults(defineProps<EditPairsProps>(), {
    valueType: "auto",
    valueMode: "flat",
    formMode: "form",
  });
  //-----------------------------------------------------
  const api = useTiEditPairsApi(props, emit);
  //-----------------------------------------------------
  const FormConfig = computed(() => useEditPairsForm(props, api));
  //-----------------------------------------------------
  function onFormChange(data: Vars) {
    emit("change", data);
  }
  //-----------------------------------------------------
</script>
<template>
  <TiTabsForm v-if="'tabs' == api.FormMode.value" v-bind="FormConfig" />
  <TiForm v-else v-bind="FormConfig" @change="onFormChange" />
</template>
<style lang="sass" scoped>
  @use "./edit-pairs.scss";
</style>
