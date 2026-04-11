<script lang="ts" setup>
  import { computed, onMounted, useTemplateRef, watch } from "vue";

  import {
    ListSelectEmitInfo,
    TiIcon,
    TiList,
    useBoxAspect,
    useBoxDropList,
  } from "@site0/tijs";
  import { DropTagEmitter, DropTagProps } from "./ti-drop-tag-types";
  import { useDropTagApi } from "./use-drop-tag-api";
  //-----------------------------------------------------
  defineOptions({ inheritAttrs: false });
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $tipcon = useTemplateRef<HTMLElement>("tipcon");
  //-----------------------------------------------------
  const emit = defineEmits<DropTagEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<DropTagProps>(), {
    canInput: true,
    value: "",
    valueType: "val",
    autoI18n: true,
    tipShowTime: "focus",
    tipShowDelay: 500,
    tipUseHint: false,
    trimed: true,
    flexAuto: true,
    // autoSelect: true,
    // autoFocus: true,
    // boxFontSize: "m",
    // boxPadding: "m",
    // boxRadius: "s",
  });
  //-----------------------------------------------------
  const api = useDropTagApi(props, {
    emit,
    getElement: () => $el.value,
  });
  //-----------------------------------------------------
  const Aspect = computed(() =>
    useBoxAspect(props, {
      getElement: () => $el.value,
      getDockingElement: () => $tipcon.value,
      isFocused: () => false,
      isTipBoxReady: computed(() => false),
      isReadonly: () => false,
    })
  );
  //-----------------------------------------------------
  const BoxDropList = computed(() =>
    useBoxDropList(props, {
      getTipContainer: () => $tipcon.value,
    })
  );
  //-----------------------------------------------------
  async function on_click_top() {
    await api.tryReloadOptionsData();
  }
  //-----------------------------------------------------
  function on_click_mask() {
    api.setOptionsStatus("hide");
  }
  //-----------------------------------------------------
  function on_select_item(payload: ListSelectEmitInfo) {
    api.setOptionsStatus("hide");
    api.setCurrentItem(payload.current);
  }
  //-----------------------------------------------------
  watch(
    () => [props.value, props.options],
    async () => {
      await api.reloadCurrentItem();
    }
  );
  //-----------------------------------------------------
  onMounted(async () => {
    await api.reloadCurrentItem();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input-box3"
    :class="Aspect.TopClass.value"
    :style="Aspect.TopStyle.value">
    <div
      ref="el"
      class="part-main"
      :class="Aspect.PartMainClass.value"
      :style="Aspect.PartMainStyle.value"
      @click.stop="on_click_top">
      <!----------|> MAIN PART: BODY |---------->
      <div class="main-body">
        <!--|> MAIN PART: BODY > Icon |-->
        <TiIcon
          v-if="api.CurrentItemIcon.value"
          :value="api.CurrentItemIcon.value" />

        <!--|> MAIN PART: BODY > Text |-->
        <span class="as-text" v-if="api.CurrentItemText.value">{{
          api.CurrentItemText.value
        }}</span>

        <!--|> MAIN PART: BODY > Tip |-->
        <span class="as-tip" v-if="api.CurrentItemTip.value">{{
          api.CurrentItemTip.value
        }}</span>
      </div>
    </div>
    <!--=========| TIP OPTIONS PART |============-->
    <template v-if="api.isOptionsDataShow.value">
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div class="part-mask" @click.left.stop="on_click_mask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div class="part-options" :style="Aspect.BoxTipWrapperStyle.value">
        <div class="part-options-con" ref="tipcon">
          <TiList
            v-bind="BoxDropList.value"
            :currentId="api.CurrentItemValue.value"
            :data="api.FilteredOptionsData.value"
            @select="on_select_item" />
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-drop-tag.scss";
</style>
