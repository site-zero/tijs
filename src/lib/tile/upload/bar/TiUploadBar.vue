<script lang="ts" setup>
  import { computed, onMounted, ref, useTemplateRef } from "vue";
  import { ActionBarEvent, TiActionBar } from "../../../";
  import { Vars } from "../../../../_type";
  import { CssUtils } from "../../../../core";
  import { TiImage, TiProgressBar, TiTextSnippet } from "../../../../lib";
  import { onUploadActionFire, useUploadDropping } from "../use-uploader";
  import { UploadBarEmitter, UploadBarProps } from "./ti-upload-bar-types";
  import { useUploadBar } from "./use-upload-bar";
  //-----------------------------------------------------
  const emit = defineEmits<UploadBarEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<UploadBarProps>(), {
    textSize: "s",
    textPadding: "s",
    textAlign: "center",
    boxRadius: "s",
    uploadButton: true,
    clearButton: false,
    // tip: '点击或拖拽文件到此处上传',
    // type: 'danger',
  });
  //-----------------------------------------------------
  const _bar = useUploadBar(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      "drag-enter": _drag_enter.value,
      "nil-value": props.nilValue,
      "in-progress": _bar.InProgress.value,
      [`is-${props.type}`]: !!props.type,
    })
  );
  //-----------------------------------------------------
  const TopStyle = computed(() => {
    let colorTheme: Vars = {
      "--bar-c0": "var(--ti-color-border-thin)",
      "--bar-bg": "var(--ti-color-border-shallow)",
      "--bar-action": "var(--ti-color-primary)",
      "--bar-action-r": "var(--ti-color-primary-r)",
    };
    if (props.type) {
      colorTheme = {
        "--bar-c0": `var(--ti-color-${props.type})`,
        "--bar-c1": `var(--ti-color-${props.type})`,
        "--bar-bg": `var(--ti-color-${props.type}-r)`,
        "--bar-action": `var(--ti-color-${props.type})`,
        "--bar-action-r": `var(--ti-color-${props.type}-r)`,
      };
    }
    return CssUtils.mergeStyles([colorTheme, props.style]);
  });
  //-----------------------------------------------------
  const ConClass = computed(() =>
    CssUtils.mergeClassName(
      {
        "hover-prefix-for-clear": _bar.isPrefixForClean.value,
      },
      `bar-pad-${props.textPadding}`,
      `text-size-${props.textSize}`,
      `text-align-${props.textAlign}`,
      `bar-radius-${props.boxRadius}`
    )
  );
  //-----------------------------------------------------
  const ConStyle = computed(() => {
    return CssUtils.mergeStyles([
      CssUtils.toStyle({ width: props.width, height: props.height }),
      props.conStyle,
    ]);
  });
  //-----------------------------------------------------
  function onActionFire(event: ActionBarEvent) {
    onUploadActionFire(props, event, emit);
  }
  //-----------------------------------------------------
  const _drag_enter = ref(false);
  const $bar = useTemplateRef("bar");
  const dropping = computed(() =>
    useUploadDropping(_drag_enter, $bar, emit, _bar.InProgress)
  );
  //-----------------------------------------------------
  onMounted(() => {
    dropping.value();
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-upload-bar" :class="TopClass" :style="TopStyle">
    <div class="bar-con" :class="ConClass" :style="ConStyle" ref="bar">
      <!--============= Preview =============-->
      <div class="part-icon" :title="props.tip">
        <TiImage v-bind="_bar.Preview.value" />
        <div
          v-if="_bar.isPrefixForClean.value && !props.nilValue"
          class="prefix-cleaner"
          @click.left="emit('clear')">
          <i class="zmdi zmdi-close"></i>
        </div>
      </div>
      <!--============= Text =============-->
      <TiTextSnippet class="part-text" v-bind="_bar.Text.value" />
      <!--============= Actions =============-->
      <TiActionBar
        v-if="_bar.ActionBar.value"
        item-size="t"
        bar-pad="s"
        :top-item-min-width="null"
        v-bind="_bar.ActionBar.value"
        class="part-actions"
        @fire="onActionFire" />
      <!--============= Processor =============-->
      <div class="part-progress" v-if="props.progress">
        <TiProgressBar v-bind="props.progress" :type="props.type" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @use "./ti-upload-bar.scss";
</style>
