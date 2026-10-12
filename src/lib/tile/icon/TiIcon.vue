<script setup lang="ts">
  import _ from "lodash";
  import { computed } from "vue";
  import { LogicType } from "../../../_type/core-types";
  import { CssUtils, Icons } from "../../../core";
  import { IconEmitter, IconProps } from "./ti-icon-types";
  import { getIconStyle } from "./use-icon";
  //-----------------------------------------------------

  const emit = defineEmits<IconEmitter>();
  //-----------------------------------------------------
  const props = defineProps<IconProps>();
  //-----------------------------------------------------
  const Icon = computed(() => {
    return Icons.toIconObj(props.value ?? props.defaultValue);
  });
  //-----------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(
      props.className,
      `is-type-${Icon.value.type}`,
      {
        "can-hover": props.canHover,
      }
    );
  });
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let logicType: LogicType | undefined = props.logicType;
    if (props.value) {
      if (!_.isString(props.value) && props.value.logicType) {
        logicType = props.value.logicType;
      }
    }
    let re = CssUtils.mergeStyles([
      {},
      CssUtils.toStyle({
        width: props.width,
        height: props.height,
        opacity: props.opacity,
      }),
      props.style,
    ]);
    if (logicType) {
      re.color = `var(--ti-color-${logicType})`;
    }
    return re;
  });
  //-----------------------------------------------------
  const IconStyle = computed(() => getIconStyle(props, Icon));
  //-----------------------------------------------------
  function onClickTop() {
    let payload = props.vars || Icon.value;
    emit("click", payload);
  }
  //-----------------------------------------------------
</script>

<template>
  <div
    class="ti-icon"
    :class="TopClass"
    :style="TopStyle"
    :data-tip="props.tip"
    :data-tip-type="props.logicType"
    data-tip-font-size="m"
    @click="onClickTop">
    <!-- Emoji Icon-->
    <div
      class="part-main as-emoji"
      :style="IconStyle"
      v-if="'emoji' == Icon.type">
      <span>{{ Icon.value }}</span>
    </div>
    <!-- Font Icon-->
    <div
      class="part-main as-font"
      :style="IconStyle"
      v-else-if="'font' == Icon.type">
      <i :class="Icon.className"></i>
    </div>
    <!-- Image Icon-->
    <img v-else :src="Icon.src" class="part-main as-image" :style="IconStyle" />
  </div>
</template>
<style lang="scss">
  @use "./ti-icon.scss";
</style>
