<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import { TiGridFields } from "../../";
  import { Vars } from "../../../_type";
  import { GridFieldsInput } from "../../shelf/grid-fields/ti-grid-fields-types";
  import { InputGroupProps } from "./ti-input-group-types";

  const emit = defineEmits<{
    (eventName: "change", payload: Vars): void;
  }>();

  const props = withDefaults(defineProps<InputGroupProps>(), {
    bodyPartGap: "s",
    maxFieldNameWidth: "auto",
    fieldLayoutMode: "h-title-icon-suffix",
    defaultComType: "TiInput",
    ignoreNil: false,
    changeMode: "all",

    fields: () => [] as GridFieldsInput[],
  });

  const FormProps = computed(() => _.omit(props, "data", "value"));

  const LayoutHint = computed(() => (props.fields ? props.fields.length : 0));

  function onValueChange(change: Vars) {
    let delta = _.cloneDeep(change);
    if ("all" == props.changeMode) {
      let old = _.cloneDeep(props.value);
      delta = _.assign(old, delta);
    }

    if (props.ignoreNil) {
      let v2 = {};
      _.forEach(delta, (v, k) => {
        if (!_.isNil(v)) {
          _.set(v2, k, v);
        }
      });
      delta = v2;
    }
    //console.log('onValueChange', change, val);
    emit("change", delta);
  }
</script>
<template>
  <TiGridFields
    v-bind="FormProps"
    class="ti-input-group no-body-padding"
    :data="props.value"
    :layout-hint="LayoutHint"
    @change="onValueChange" />
</template>
