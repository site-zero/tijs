<script lang="ts" setup>
  import { computed } from "vue";
  import { BooleanEmitter, TiIcon, useBooleanInput } from "../../";
  import { IconInput } from "../../../_type";
  import { CssUtils, I18n } from "../../../core";
  import { CheckProps } from "./ti-check-types";

  const props = withDefaults(defineProps<CheckProps>(), {
    value: false,
    icons: () =>
      ["zmdi-square-o", "zmdi-check-square"] as [IconInput, IconInput],
    text: "i18n:yes",
    //values: () => [false, true] as [any, any],
    tipMaxWidth: "640px",
    tipContentType: "text",
    tipDockMode: "V",
  });
  const emit = defineEmits<BooleanEmitter>();
  const Bool = computed(() => useBooleanInput(props, { emit }));

  const TopClass = computed(() => {
    let yes = Bool.value.yes;
    return CssUtils.mergeClassName(props.className, {
      "is-on": yes,
      "is-off": !yes,
    });
  });

  const TopStyle = computed(() => CssUtils.toStyle(props.style));

  const CheckIcon = computed(() => {
    let II = Bool.value.yes ? 1 : 0;
    return props.icons[II];
  });
</script>
<template>
  <div
    class="ti-check"
    :class="TopClass"
    :style="TopStyle"
    @click.stop="Bool.emitToggle">
    <div
      class="check-con"
      :data-tip="props.tip"
      :data-tip-max-width="props.tipMaxWidth"
      :data-tip-content-type="props.tipContentType"
      :data-tip-dock-mode="props.tipDockMode"
      :data-tip-type="props.tipType">
      <div class="part-icon"><TiIcon :value="CheckIcon" /></div>
      <div class="part-text" v-if="props.text">
        {{ I18n.text(props.text) }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  @use "../../../assets/style/_all.scss" as *;
  .ti-check {
    > .check-con {
      @include flex-align-nowrap;
      cursor: pointer;
      user-select: none;
      > .part-icon {
        font-size: 1.2em;
      }
      > .part-text {
        margin-left: 0.5em;
      }
      &:hover {
        color: var(--ti-color-link-hover);
      }
    }
  }
</style>
