<script lang="ts" setup>
import { Callback, CssUtils, Util } from "../../../core";
import { BUS_KEY, TiEvent } from "../../";
import { useBusEmit } from "../../features";
import { computed, inject, onMounted, provide, reactive, ref } from "vue";
import BarItemChildren from "./BarItemChildren.vue";
import {
  BAR_SUPPORT,
  BarItemOpenStatus,
  BarState,
  COM_TYPE
} from "./action-bar-type";
import { TiActionBarInfo } from "./ti-action-bar-index";
import { ActionBarProps, useActionBar } from "./use-action-bar";
import _ from "lodash";
/*-------------------------------------------------------

                   Com Options

-------------------------------------------------------*/
defineOptions({
  name: COM_TYPE,
  inheritAttrs: false
});
/*-------------------------------------------------------

                    State

-------------------------------------------------------*/
const state = reactive({
  opened: new Map(),
  vars: {}
} as BarState);
const $root = ref<HTMLElement>();
/*-------------------------------------------------------

                      Props

-------------------------------------------------------*/
let props = withDefaults(defineProps<ActionBarProps>(), {
  emitMode: "auto"
});
/*-------------------------------------------------------

                  Events

-------------------------------------------------------*/
let emit = defineEmits<(event: string, payload: TiEvent<any>) => void>();
let bus = inject(BUS_KEY);
let notify = useBusEmit(TiActionBarInfo, props, emit, bus);

let Bar = computed(() =>
  useActionBar(state, props, {
    getRootElement: function () {
      return $root.value;
    },
    notify,
    parseAction: (action, state): Callback => {
      return Util.genInvoking(action, {
        context: state.vars,
        dft: () => {
          throw new Error("fail to parse: " + action);
        }
      }) as Callback;
    }
  })
);

// 注册一个总线，给所有的子元素用来控制显示隐藏
// let busName = COM_TYPE;
// if (props.name) {
//   busName += `[${props.name}]`;
// }
// let barBus: TiBus<BuiltedBarItem> = createBus<BuiltedBarItem>(busName);
// provide(BAR_BUS_KEY, barBus);
// barBus.on("click", (msg) => {
//   Bar.value.OnClickBarItem(msg.data);
// });
/*-------------------------------------------------------

                  Features

 -------------------------------------------------------*/

/*-------------------------------------------------------

                  Computed

-------------------------------------------------------*/
const TopClass = computed(() =>
  CssUtils.mergeClassName(props.className, {
    "show-click-mask": Bar.value.hasOpenedGroup
  })
);
/*-------------------------------------------------------

                  Methods

-------------------------------------------------------*/
function OnClickMask() {
  state.opened.clear();
}

provide(BAR_SUPPORT, {
  MENU_SPACE: 10,
  makeSureOpen(uniqKey: string | string[]) {
    let uniqKeys = _.concat(uniqKey);
    //console.log("makeSureOpen", uniqKey, state.opened);
    for (let uk of uniqKeys) {
      if (!state.opened.get(uk)) {
        state.opened.set(uk, "open");
      }
    }
  },
  setBarOpenState(
    uniqKey: string | string[],
    status: BarItemOpenStatus | null
  ) {
    let uniqKeys = _.concat(uniqKey);
    if (!status) {
      for (let uk of uniqKeys) {
        state.opened.delete(uk);
      }
    } else {
      for (let uk of uniqKeys) {
        state.opened.set(uk, status);
      }
    }
  },
  clearBarOpenState(...uniqKeys: string[]) {
    if (_.isEmpty(uniqKeys)) {
      state.opened.clear();
    } else {
      for (let uniqKey of uniqKeys) {
        state.opened.delete(uniqKey);
      }
    }
  },
  clearBarOpenStateExcept(...uniqKeys: string[]) {
    if (_.isEmpty(uniqKeys)) {
      state.opened.clear();
    } else {
      let ignore_keys = new Map<string, boolean>();
      for (let uniqKey of uniqKeys) {
        ignore_keys.set(uniqKey, true);
      }
      for (let en of state.opened.entries()) {
        let [k] = en;
        if (!ignore_keys.get(k)) {
          state.opened.delete(k);
        }
      }
    }
  }
});
/*-------------------------------------------------------

                Life Hooks

-------------------------------------------------------*/
onMounted(() => {
  console.log("bar mounted!");
  state.opened.clear();
});
</script>
<template>
  <div class="ti-actionbar" :class="TopClass" ref="$root">
    <div class="bar-mask" v-if="Bar.hasOpenedGroup" @click.left="OnClickMask">
    </div>
    <BarItemChildren uniqKey="_ROOT_" type="inline-group" :index="0" :depth="0"
      :className="Bar.className" :items="Bar.items" :ancestors="Bar.ancestors" />
  </div>
</template>
<style lang="scss">
@use "../../../assets/style/_all.scss" as *;
@import "./ti-action-bar.scss";
</style>