<script lang="ts" setup>
  import _ from "lodash";
  import { inject, ref } from "vue";
  import { BUS_KEY } from "../../../_type";
  import BarItemTmpl from "./BarItemTmpl.vue";
  import { ABAR_STATE, ABarUsedItem } from "./ti-action-bar-types";
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  const bus = inject(BUS_KEY);
  //-------------------------------------------------------
  let props = withDefaults(defineProps<ABarUsedItem>(), {});
  //-------------------------------------------------------
  // 阻止用户频繁点击
  const _last_click = ref(0);
  const _in_action = ref(false);

  //-------------------------------------------------------
  async function OnFireAction() {
    // 上一个动作还未执行完毕
    if(_in_action.value){
      return;
    }

    // 1秒只能点击一次
    let du = Date.now() - _last_click.value;
    if (du < 1000) {
      return;
    }
    _last_click.value = Date.now();

    //console.log("OnFireAction", props)
    if (_.isFunction(props.action)) {
      _in_action.value = true
      await props.action(props.uniqKey, state?.vars || {}, bus);
      _in_action.value = false;

    }
    state?.opened.clear();
  }
  //-------------------------------------------------------
</script>
<template>
  <BarItemTmpl v-bind="props" @click="OnFireAction" />
</template>
