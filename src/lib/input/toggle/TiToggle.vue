<script lang="ts" setup>
  import {
    BooleanEmitter,
    CssUtils,
    toLogicColor,
    useBooleanInput,
    Vars,
    TiIcon,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { ToggleProps } from "./ti-toggle-types";
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ToggleProps>(), {
    value: false,
    //values: () => [false, true] as [any, any],
  });
  //-----------------------------------------------------
  const emit = defineEmits<BooleanEmitter>();
  //-----------------------------------------------------
  const Bool = useBooleanInput(props, { emit });
  //-----------------------------------------------------
  const TopClass = computed(() => {
    let yes = Bool.Yes.value;
    return CssUtils.mergeClassName(props.className, {
      "is-on": yes,
      "is-off": !yes,
    });
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let re = {} as Vars;
    if (props.type) {
      _.assign(re, {
        "--color-on": toLogicColor(props.type),
      });
    }
    if (props.width) {
      _.assign(re, {
        width: props.width,
      });
    }
    return re;
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-toggle" :class="TopClass" :style="TopStyle">
    <aside @click.left="Bool.emitToggle">
      <b>
        <TiIcon v-if="props.btnIcon" :value="props.btnIcon" />
      </b>
    </aside>
    <span v-if="Bool.Text">{{ Bool.Text }}</span>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-toggle.scss";
</style>
