<script lang="ts" setup>
  import _ from "lodash";
  import { watch } from "vue";
  import { ListSelectEmitInfo, TiList } from "../../";
  import { LogicType, Vars } from "../../../_type";
  import { CheckListEmitter, CheckListProps } from "./ti-check-list-types";
  import { useChecklist } from "./use-checklist";
  //-----------------------------------------------------
  const emit = defineEmits<CheckListEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<CheckListProps>(), {
    textAsHtml: true,
    borderStyle: "solid",
    highlightChecked: false,
    canHover: true,
  });
  //-----------------------------------------------------
  const _list = useChecklist(props);
  //-----------------------------------------------------
  function onSelect(payload: ListSelectEmitInfo) {
    let ids = payload.checkedIds;
    let val = _.uniq(_.concat([], ids, props.fixedValues ?? []));
    console.log("onSelect", ids, val, "value=", props.value);
    if (!_.isEqual(val, props.value)) {
      emit("change", val);
    }
  }
  //-----------------------------------------------------
  function getRowType(data: Vars): LogicType | undefined {
    if (props.fixedValues) {
      if (props.fixedValues.indexOf(data.value) >= 0) {
        return "track";
      }
    }
    return;
  }
  //-----------------------------------------------------
  watch(
    () => props.options,
    (newVal, oldVal) => {
      // console.log(
      //   'CheckList options changed',
      //   _.isEqual(newVal, oldVal),
      //   newVal
      // );
      if (!_.isEqual(newVal, oldVal)) {
        _list.reloadOptions();
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <TiList
    v-bind="_list.ListConfig.value"
    :multi="true"
    :data="_list.optionsData.value"
    :max-checked="props.maxChecked"
    :min-checked="props.minChecked"
    :can-select="true"
    :showChecker="true"
    :get-row-type="getRowType"
    :checked-ids="props.value"
    @select="onSelect" />
</template>
