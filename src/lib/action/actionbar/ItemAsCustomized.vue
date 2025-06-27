<script lang="ts" setup>
  import _ from "lodash";
  import { computed, inject } from "vue";
  import { useFieldCom } from "../../";
  import { BUS_KEY } from "../../../_type";
  import { ABAR_STATE, ABarUsedItem } from "./ti-action-bar-types";
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  let props = withDefaults(defineProps<ABarUsedItem>(), {});
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  const bus = inject(BUS_KEY);
  //-------------------------------------------------------
  const ItemContext = computed(() => {
    let ctx = _.cloneDeep(state?.vars ?? {});
    _.assign(ctx, props.vars);
    return ctx;
  });
  //-------------------------------------------------------
  const Com = computed(() => {
    let _com = useFieldCom({
      ...props,
      autoValue: null,
      dynamic: true,
      activatedComType: null,
      activatedComConf: undefined,
    });

    // 解释控件
    return _com.autoGetCom({ readonly: props.disabled }, ItemContext.value);
  });
  //-------------------------------------------------------
  const onValueChange = computed(() => {
    let key = props.changeEventName ?? "change";
    return {
      [key]: (val: any) => {
        // console.log("value-chagne!!!", val);
        if (props.action) {
          props.action(val, ItemContext.value, bus);
        }
      },
    };
  });
  //-------------------------------------------------------
</script>
<template>
  <div class="bar-item as-customized">
    <component :is="Com.rawCom" v-bind="Com.comConf" v-on="onValueChange" />
  </div>
</template>
