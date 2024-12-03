<script setup lang="ts">
  import _ from 'lodash';
  import { computed, reactive, useTemplateRef, watch } from 'vue';
  import { TiList } from '../../';
  import { Rect } from '../../../_type';
  import { ListSelectEmitInfo } from '../../../lib';
  import { InputBox2Emitter, InputBox2Props } from './ti-input-box2-types';
  import { useBoxAspect } from './use-box-aspect';
  import { useBoxTips } from './use-box-tips';
  import { InputBoxState, useInputBox2 } from './use-input-box2';
  import { useInputComposition } from './use-input-composition';
  import { useTipList } from './use-tip-list';
  import { useBoxIcon } from './use-box-icon';
  //-----------------------------------------------------
  const emit = defineEmits<InputBox2Emitter>();
  const $el = useTemplateRef<HTMLElement>('el');
  const $input = useTemplateRef<HTMLInputElement>('input');
  //-----------------------------------------------------
  const _box_state = reactive({
    usr_text: null,
    box_value: null,
    box_icon: null,
    box_text: null,
    box_tip: null,
  } as InputBoxState);
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBox2Props>(), {
    value: '',
    autoI18n: true,
    tipShowTime: 'focus',
    tipUseHint: false,
    canInput: true,
    trimed: true,
    autoSelect: true,
    boxFontSize: 'm',
    boxPadding: 'm',
    boxRadius: 's',
  });
  //-----------------------------------------------------
  const _box = computed(() =>
    useInputBox2(props, {
      _box_state,
      getElement: () => $el.value,
      getInputElement: () => $input.value,
      emit,
    })
  );
  //-----------------------------------------------------
  const _tip_list = computed(() => useTipList(props));
  const _tip_box = computed(() =>
    useBoxTips({
      getElement: () => $el.value,
      hideBoxTip: () => _box.value.clearOptionsData(),
      getTipBoxDockStyle: (box: Rect) => {
        return {
          minWidth: props.tipListMinWidth ?? `${box.width}px`,
          width: props.tipListWidth,
        };
      },
    })
  );
  //-----------------------------------------------------
  const _aspect = computed(() =>
    useBoxAspect(props, _box.value, _tip_box.value)
  );
  //-----------------------------------------------------
  const _comp = useInputComposition({
    onChange: (val) => {
      _box.value.onInputUpate(val);
    },
  });
  //-----------------------------------------------------
  const _prefix = computed(() =>
    useBoxIcon({
      _box: _box.value,
      icon: props.prefixIcon,
      hoverIcon: props.prefixHoverIcon,
      iconFor: props.prefixIconFor,
    })
  );
  //-----------------------------------------------------
  const _suffix = computed(() =>
    useBoxIcon({
      _box: _box.value,
      icon: props.suffixIcon,
      hoverIcon: props.suffixHoverIcon,
      iconFor: props.suffixIconFor,
    })
  );
  //-----------------------------------------------------
  function onKeyDown(event: KeyboardEvent) {
    console.log('onKeyDown', event.key);
    _comp.onKeyPress(event);
    // 选择高亮项目
    if ('ArrowUp' == event.key) {
      event.preventDefault();
      _box.value.onKeyUpOrDown(-1);
    } else if ('ArrowDown' == event.key) {
      event.preventDefault();
      _box.value.onKeyUpOrDown(1);
    }
    // 取消
    else if ('Escape' == event.key) {
      _box.value.onPropsValueChange();
      _box.value.clearOptionsData();
    }
    // 确认
    else if ('Enter' == event.key) {
      event.preventDefault();
      _box.value.emitIfChanged();
      _box.value.clearOptionsData();
    }
  }
  //-----------------------------------------------------
  function onInputFocused() {
    _box.value.setFocused(true);
  }
  //-----------------------------------------------------
  function onInputBlur() {
    _box.value.setFocused(false);
    _box.value.emitIfChanged();
    _.delay(() => {
      _box.value.clearOptionsData();
    }, 200);
  }
  //-----------------------------------------------------
  function onOptionSelect(payload: ListSelectEmitInfo) {
    let item = payload.current;
    if (item) {
      _box.value.setValueByItem(item);
    }
    _box.value.emitIfChanged();
    // 由于 emit 了 change, 如果 value 更新，会导致 userInputBox2 重新计算
    // 因此 options_data 会被清空，hasTips 会变成 false
  }
  //-----------------------------------------------------
  // 这个监控器，监控 value 的改动，如果 value 变化
  // 会导致 useInputBox2 重新计算，因此其内部 _focused 状态会变成 false
  // 而 _options_data 会立刻被变成 undefined
  // 因此也导致 hasTips 变成 false
  watch(
    () => props.value,
    () => {
      _box.value.onPropsValueChange();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => _box.value.hasTips.value,
    (visible) => {
      _tip_box.value.whenTipBoxVisibleChange(visible);
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input">
    <!--aside>
      [{{ _box.OptionsData.value.length }}]
      {{ _box_state }}
      {{ _box.isFocused.value ? '[F]' : '---' }}
      {{ _box.hasTips.value ? 'Tip' : '---' }}
      {{ _tip_box.DumpInfo.value }}
    </aside-->
    <!--主体框-->
    <main
      ref="el"
      :class="_aspect.TopClass.value"
      :style="_aspect.TopStyle.value">
      <slot name="head">
        <div
          v-if="_prefix.hasIcon.value"
          class="icon-part at-prefix"
          :class="_prefix.IconPartClass.value"
          v-html="_prefix.IconPartHtml.value"
          @click.left.stop="_prefix.onClick"></div>
      </slot>
      <input
        ref="input"
        :style="_aspect.InputStyle.value"
        :placeholder="_box.Placeholder.value"
        :value="_box.InputText.value"
        @keydown="onKeyDown"
        @keyup="_comp.onKeyUp"
        @compositionstart="_comp.onStart"
        @compositionend="_comp.onEnd"
        @focus.stop="onInputFocused"
        @blur.stop="onInputBlur"
        @dblclick.stop />
      <slot name="tail"> </slot>
    </main>
    <template v-if="_tip_box.TipBoxStyleReady.value">
      <!--
      占位支撑框。 当展开选项时，主体框会浮动到最顶层
      这就需要一个占位框来保证页面布局不会变化
      -->
      <div
        class="part-brace"
        :style="_tip_box.BoxBraceStyle.value">
        <!--纯占位而已，似乎不需要内容-->
      </div>
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div class="part-mask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div
        class="part-options"
        :style="_tip_box.TipWrapperStyle.value">
        <div class="part-options-con">
          <TiList
            v-bind="_tip_list.TipListConfig.value"
            :currentId="_box_state.box_value"
            :data="_box.OptionsData?.value"
            @select="onOptionSelect" />
        </div>
      </div>
    </template>
  </div>
</template>
<style lang="scss">
  @use './ti-input-box2.scss';
</style>
