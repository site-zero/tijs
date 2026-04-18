<script lang="ts" setup>
  import {
    CssUtils,
    I18n,
    TiList,
    TiTags,
    useBoxAspect,
    useBoxDropList,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed, nextTick, useTemplateRef, watch } from "vue";
  import {
    MultiDroplistEmitter,
    MultiDroplistProps,
  } from "./ti-multi-droplist-types";
  import { useMultiDroplist } from "./use-multi-droplist";
  import { useMultiDroplistActions } from "./use-multi-droplist-actions";
  //-----------------------------------------------------
  const emit = defineEmits<MultiDroplistEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<MultiDroplistProps>(), {
    placeholder: "i18n:no-selected",
  });
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $tipcon = useTemplateRef<HTMLElement>("tipcon");
  //-----------------------------------------------------
  const api = useMultiDroplist(props, emit);
  //-----------------------------------------------------
  const _menu = computed(() => useMultiDroplistActions(props, api));
  //-----------------------------------------------------
  const Aspect = computed(() =>
    useBoxAspect(props, {
      getElement: () => $el.value,
      getDockingElement: () => $tipcon.value,
      isFocused: () => false,
      isTipBoxReady: api.isOptionsDataReady,
      isReadonly: () => api.isReadonly.value,
      autoFloatWhenTipReady: () => false,
    })
  );
  //-----------------------------------------------------
  const BoxDropList = computed(() =>
    useBoxDropList(props, {
      getTipContainer: () => $tipcon.value,
    })
  );
  //-----------------------------------------------------
  const TopClass = computed(() => {
    let readonly = api.isReadonly.value;
    return CssUtils.mergeClassName({
      "is-readonly": readonly,
      "is-editable": !readonly,
    });
  });
  //--------------------------------------------------
  const TopStyle = computed(() => {
    let re = _.assign({}, props.style);
    if (props.width) {
      re.width = props.width;
    }
    return CssUtils.toStyle(re);
  });
  //-----------------------------------------------------
  const TagActions = computed(() => _menu.value.getBoxActionBarProps());
  //-----------------------------------------------------
  function onClickMask() {
    api.tryNotifyChange();
    api.clearOptionsData();
    api.setOptionsStatus("hide");
  }
  //-----------------------------------------------------
  watch(
    () => [props.value, props.options],
    () => {
      nextTick(() => {
        api.onPropsValueChange();
      });
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-multi-droplist" :class="TopClass" :style="TopStyle">
    <div
      :tabindex="api.isReadonly.value ? undefined : '0'"
      class="part-main"
      :style="props.style"
      ref="el"
      @click.left="api.openOptions()">
      <TiTags
        :style="props.tagsStyle"
        :placeholder="props.placeholder"
        default-tag-type="primary"
        :editable="api.isReadonly.value ? false : true"
        :actions="TagActions"
        :nowrap="props.nowrap"
        v-bind="props.tags"
        :value="api.TagItems.value"
        @remove="api.removeItem($event)"
        @sorted="api.changeItems" />
    </div>
    <template v-if="api.isOptionsDataShow.value">
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div class="part-mask" @click.left.stop="onClickMask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div class="part-options" :style="Aspect.BoxTipWrapperStyle.value">
        <div class="part-options-con" ref="tipcon">
          <TiList
            v-bind="BoxDropList.value"
            :multi="true"
            :can-select="true"
            :showChecker="true"
            :checked-ids="api.TagValues.value"
            :data="api.FilteredOptionsData.value"
            @select="api.onOptionSelect" />
        </div>
        <footer>
          <a @click.left="api.tryNotifyChange(null)">
            <i class="zmdi zmdi-delete"></i><span>{{ I18n.get("clear") }}</span>
          </a>
          <hr />
          <a @click.left="api.cancelChange()">
            <span>{{ I18n.get("cancel") }}</span>
          </a>
        </footer>
      </div>
    </template>
  </div>
</template>
<style lang="scss">
  @use "./ti-multi-droplist.scss";
</style>
