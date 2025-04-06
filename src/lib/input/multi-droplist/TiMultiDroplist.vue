<script lang="ts" setup>
  import { computed, nextTick, useTemplateRef, watch } from 'vue';
  import { TiList, TiTags } from '../../';
  import { CssUtils, I18n } from '../../../';
  import { Rect } from '../../../_type';
  import { useBoxTips } from '../box2/use-box-tips';
  import { useTipList } from '../box2/use-tip-list';
  import {
    MultiDroplistEmitter,
    MultiDroplistProps,
  } from './ti-multi-droplist-types';
  import { useMultiDroplist } from './use-multi-droplist';
  import { useMultiDroplistActions } from './use-multi-droplist-actions';
  //-----------------------------------------------------
  const emit = defineEmits<MultiDroplistEmitter>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<MultiDroplistProps>(), {
    placeholder: 'i18n:no-selected',
  });
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>('el');
  const _api = computed(() => useMultiDroplist(props, emit));
  const _menu = computed(() => useMultiDroplistActions(props, _api.value));
  //-----------------------------------------------------
  const _tip_list = computed(() => useTipList(props));
  const _tip_box = computed(() =>
    useBoxTips({
      getElement: () => $el.value,
      hideBoxTip: () => _api.value.clearOptionsData(),
      getTipBoxDockStyle: (box: Rect) => {
        return {
          minWidth: props.tipListMinWidth ?? `${box.width}px`,
          width: props.tipListWidth,
        };
      },
    })
  );
  //-----------------------------------------------------
  const TopClass = computed(() => {
    let readonly = _api.value.isReadonly.value;
    return CssUtils.mergeClassName({
      'is-readonly': readonly,
      'is-editable': !readonly,
    });
  });
  //-----------------------------------------------------
  const TagActions = computed(() => _menu.value.getBoxActionBarProps());
  //-----------------------------------------------------
  function onClickMask() {
    _api.value.tryNotifyChange();
    _api.value.clearOptionsData();
  }
  //-----------------------------------------------------
  watch(
    () => _api.value.hasTips.value,
    (visible) => {
      _tip_box.value.whenTipBoxVisibleChange(visible);
    }
  );
  //-----------------------------------------------------
  watch(
    () => [props.value, props.options],
    () => {
      nextTick(() => {
        _api.value.onPropsValueChange();
      });
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-multi-droplist"
    :class="TopClass">
    <div
      :tabindex="_api.isReadonly.value ? undefined : '0'"
      class="part-main"
      :style="props.style"
      ref="el"
      @click.left="_api.openOptions()">
      <TiTags
        :style="props.tagsStyle"
        :placeholder="props.placeholder"
        default-tag-type="primary"
        :editable="_api.isReadonly.value ? false : true"
        :actions="TagActions"
        v-bind="props.tags"
        :value="_api.TagItems.value"
        @remove="_api.removeItem($event)"
        @sorted="_api.changeItems" />
    </div>
    <template v-if="_tip_box.TipBoxStyleReady.value">
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div
        class="part-mask"
        @click.left.stop="onClickMask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div
        class="part-options"
        :style="_tip_box.TipWrapperStyle.value">
        <div class="part-options-con">
          <TiList
            v-bind="_tip_list.TipListConfig.value"
            :multi="true"
            :can-select="false"
            :showChecker="true"
            :checked-ids="_api.TagValues.value"
            :data="_api.OptionsData?.value"
            @select="_api.onOptionSelect" />
        </div>
        <footer>
          <a @click.left="_api.tryNotifyChange(null)">
            <i class="zmdi zmdi-delete"></i><span>{{ I18n.get('clear') }}</span>
          </a>
          <hr />
          <a @click.left="_api.cancelChange()">
            <span>{{ I18n.get('cancel') }}</span>
          </a>
        </footer>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-multi-droplist.scss';
</style>
