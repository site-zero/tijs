<script setup lang="ts">
  import _ from "lodash";
  import { computed } from "vue";
  import { TiIcon } from "../../";
  import { CssUtils, I18n } from "../../../";
  import { ButtonProps } from "./ti-button-types";
  const emit = defineEmits<{
    (event: string, payload: any): void;
  }>();

  const props = withDefaults(defineProps<ButtonProps>(), {
    autoI18n: true,
    text: "Button",
    boxFontSize: "m",
    boxRadius: "m",
    boxPadding: "m",
    showBorder: true,
    align: "center",
    type: "primary",
    colorMode: "box",
    action: "click",
  });

  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  const TopStyle = computed(() => {
    let re = CssUtils.toStyle(props.style);
    if (props.width) {
      re.width = props.width;
    }
    if (props.minWidth) {
      re.minWidth = props.minWidth;
    }
    _.assign(re, {
      "--box-color-hover-icon": "var(--ti-color-primary-r)",
      "--box-color-hover-icon-bg": "var(--ti-color-primary)",
    });
    if (props.boxFontSize) {
      re["--box-fontsz"] = `var(--ti-fontsz-${props.boxFontSize})`;
    }
    if (props.boxPadding) {
      re["--box-padding"] = `var(--ti-box-pad-${props.boxPadding})`;
    }
    if (props.boxRadius) {
      re["--box-radius"] = `var(--ti-measure-r-${props.boxRadius})`;
    }
    if (props.align) {
      re["--box-align"] = props.align;
    }
    if (props.showBorder) {
      if (_.isBoolean(props.showBorder)) {
        re["--box-border"] = "1px";
      } else if (_.isNumber(props.showBorder)) {
        re["--box-border"] = `${props.showBorder}px`;
      } else {
        re["--box-border"] = props.showBorder;
      }
    }
    if (props.type) {
      // 指定主颜色在背景上
      if ("box" == props.colorMode) {
        _.assign(re, {
          "--box-color-border": `var(--ti-color-${props.type}-b)`,
          "--box-color-text": `var(--ti-color-${props.type}-r)`,
          "--box-color-bg": `var(--ti-color-${props.type})`,
          "--box-color-hover-text": `var(--ti-color-${props.type})`,
          "--box-color-hover-bg": `var(--ti-color-${props.type}-r)`,
        });
      }
      // 默认主颜色在文字上
      else {
        _.assign(re, {
          "--box-color-border": `var(--ti-color-${props.type}-b)`,
          "--box-color-text": `var(--ti-color-${props.type})`,
          "--box-color-bg": `var(--ti-color-${props.type}-r)`,
          "--box-color-hover-text": `var(--ti-color-${props.type}-r)`,
          "--box-color-hover-bg": `var(--ti-color-${props.type})`,
        });
      }
    } else {
      _.assign(re, {
        "--box-color-border": "var(--ti-color-border-dark)",
      });
    }
    return re;
  });

  const ButtonText = computed(() => {
    if (props.autoI18n) {
      return I18n.text(props.text);
    }
    return props.text;
  });

  const onClick = () => {
    if (_.isString(props.action)) {
      emit(props.action, props.payload);
    } else if (_.isFunction(props.action)) {
      props.action(props.payload);
    }
  };
</script>

<template>
  <a
    href="javascript:void(0)"
    class="ti-button"
    :class="TopClass"
    :style="TopStyle"
    @click="onClick">
    <div class="part-icon" v-if="props.icon">
      <TiIcon :value="props.icon" />
    </div>
    <div class="part-text">{{ ButtonText }}</div>
  </a>
</template>

<style lang="scss" scoped>
  @use "@site0/tijs/sass/_all.scss" as *;
  a.ti-button {
    @include flex-align-nowrap($ai: center);
    text-decoration: none;
    cursor: pointer;
    background-color: var(--box-color-bg);
    color: var(--box-color-text);
    font-size: var(--box-fontsz);
    padding: var(--box-padding);
    border-radius: var(--box-radius);
    border-width: var(--box-border);
    border-style: solid;
    border-color: var(--box-color-border);
    &:hover {
      background-color: var(--box-color-hover-bg);
      color: var(--box-color-hover-text);
    }
    > .part-icon {
      @include flex-center;
      font-size: 1.3em;
      margin-right: 0.5em;
    }
    > .part-text {
      flex: 1 1 auto;
      text-align: var(--box-align);
      line-height: 1em;
    }
  }
</style>
