<script lang="ts" setup>
  import {
    CssUtils,
    toAspectFontSize,
    toAspectGap,
    toLogicColor,
    Vars,
  } from "@site0/tijs";
  import { computed, useTemplateRef } from "vue";
  import { ScoreEmitter, ScoreProps } from "./ti-score-types";
  import { useScoreApi } from "./use-score-api";
  //-----------------------------------------------------
  const emit = defineEmits<ScoreEmitter>();
  const $ul = useTemplateRef("ul");
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ScoreProps>(), {
    value: 0,
    minValue: 0,
    maxValue: 10,
    starts: 5,
    allowHalfStart: true,
  });
  //-----------------------------------------------------
  const api = useScoreApi(props, () => $ul.value, emit);
  //-----------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let re = CssUtils.mergeStyles([
      props.style,
      {
        "--star-fontsz": toAspectFontSize(props.starFontSize),
        "--star-gap": toAspectGap(props.starGap),
        "--star-item-padding": toAspectGap(props.starItemPadding),
        "--star-color": toLogicColor(
          props.starColorType,
          props.starColorSuffix
        ),
        "--star-border-color": toLogicColor(
          props.starBorderColorType,
          props.starBorderColorSuffix
        ),
      } as Vars,
    ]);
    return re;
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-score" :class="TopClass" :style="TopStyle">
    <ul ref="ul">
      <li
        v-for="(item, index) in api.Starts.value.list"
        :key="index"
        :data-index="index"
        class="score-start"
        :style="starStyle"
        @click="api.onClickStar(index, $event)">
        <!-- 满星 -->
        <i
          v-if="item === 'full'"
          class="fas fa-star"
          :style="starIconStyle"></i>
        <!-- 半星 -->
        <i
          v-else-if="item === 'half'"
          class="fas fa-star-half-alt"
          :style="starIconStyle"></i>
        <!-- 空星 -->
        <i v-else class="far fa-star" :style="starIconStyle"></i>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-score.scss";
</style>
