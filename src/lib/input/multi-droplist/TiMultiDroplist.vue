<script lang="ts" setup>
  import {
    CssUtils,
    I18n,
    TiList,
    TiTags,
    useBoxAspect,
    useBoxComposition,
    useBoxDropList,
  } from "@site0/tijs";
  import _ from "lodash";
  import { computed, nextTick, useTemplateRef, watch } from "vue";
  import {
    MultiDroplistEmitter,
    MultiDroplistProps,
  } from "./ti-multi-droplist-types";
  import { useMultiDroplistActions } from "./use-multi-droplist-actions";
  import { useMultiDroplist } from "./use-multi-droplist-api";
  //-----------------------------------------------------
  const emit = defineEmits<MultiDroplistEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<MultiDroplistProps>(), {
    placeholder: "i18n:no-selected",
    showOptionKeyword: 7,
    lookup: () => ["*~value", "*~text"],
  });
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>("el");
  const $tipcon = useTemplateRef<HTMLElement>("tipcon");
  //-----------------------------------------------------
  const api = useMultiDroplist(props, emit);
  //-----------------------------------------------------
  const Compose = computed(() => {
    return useBoxComposition(
      { canInput: true },
      {
        isReadonly: () => api.isReadonly.value,
        onChange: (val: string) => {
          api.setKeyword(val);
        },
      }
    );
  });
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
        <header v-if="api.isShowOptionKeyword.value">
          <div class="keyword">
            <input
              :placeholder="I18n.text('i18n:ti-multi-droplist-keyword-placeholder')"
              @keyup="Compose.onKeyUp"
              @keydown="Compose.onKeyDown"
              @beforeinput="Compose.onBeforeInput"
              @compositionstart="Compose.onStart"
              @compositionend="Compose.onEnd" />
          </div>
        </header>
        <div class="part-options-con" ref="tipcon">
          <TiList
            v-bind="BoxDropList.value"
            :multi="true"
            :can-select="true"
            :showChecker="true"
            :checked-ids="api.TagValues.value"
            :data="api.DisplayOptionsData.value"
            @select="api.onOptionSelect" />
        </div>
        <footer>
          <a @click.left="api.tryNotifyChange(null)">
            <i class="zmdi zmdi-delete"></i><span>{{ I18n.get("clear") }}</span>
          </a>
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
