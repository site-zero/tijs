<script setup lang="ts">
  import _ from 'lodash';
  import {
    computed,
    inject,
    onMounted,
    reactive,
    ref,
    useTemplateRef,
    watch,
  } from 'vue';
  import { TiList } from '../../';
  import { BUS_KEY, Rect, Vars } from '../../../_type';
  import { ListSelectEmitInfo } from '../../../lib';
  import { InputBoxEmitter, InputBoxProps } from './ti-input-box2-types';
  import { useBoxAspect } from './use-box-aspect';
  import { useBoxIcon } from './use-box-icon';
  import { useBoxTips } from './use-box-tips';
  import { useDict } from './use-dict';
  import { InputBoxState, useInputBox2 } from './use-input-box2';
  import { useInputComposition } from './use-input-composition';
  import { useTipList } from './use-tip-list';
  import { useValueHintCooking } from './use-value-hint-cooking';
  import { useValueOptions, ValueOptions } from './use-value-options';
  import { useValuePipe } from './use-value-pipe';
  //-----------------------------------------------------
  const emit = defineEmits<InputBoxEmitter>();
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
  const _options_data = ref<Vars[]>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBoxProps>(), {
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
  const _pipe = computed(() => useValuePipe(props));
  const _dict = computed(() => useDict(props));
  const _cook_hint = computed(() => useValueHintCooking(props));
  //------------------------------------------------
  // 组合出对选项的操作
  const _options = computed((): ValueOptions | undefined => {
    if (_dict.value) {
      return useValueOptions(
        {
          dict: _dict.value,
          cookHint: _cook_hint.value,
          _options_data,
        },
        props
      );
    }
  });
  //-----------------------------------------------------
  const _box = computed(() =>
    useInputBox2(props, {
      _box_state,
      _options_data,
      _pipe: _pipe.value,
      _dict: _dict.value,
      _options: _options.value,
      cookHint: _cook_hint.value,
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
      //确保当前状态是 focused
      _box.value.setFocused(true);
      _box.value.debounceInputUpdate(val);
    },
  });
  //-----------------------------------------------------
  const _prefix = computed(() =>
    useBoxIcon({
      _box: _box.value,
      icon: props.prefixIcon,
      hoverIcon: props.prefixHoverIcon,
      iconFor: props.prefixIconFor,
      autoIcon: _box_state.box_icon ?? undefined,
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
    if (_box.value.isReadonly.value) {
      return;
    }
    //console.log('onKeyDown', event.key);
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
      _box.value.debouncePropsValueChange();
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
  const bus = inject(BUS_KEY);
  const BUS_EVENT_FOCUS = 'INPUT_FOCUS';
  bus?.onName(BUS_EVENT_FOCUS, () => {
    _box.value.clearOptionsData();
  });
  //-----------------------------------------------------
  function onInputFocused() {
    if (_box.value.isReadonly.value) {
      return;
    }
    bus?.emit(BUS_EVENT_FOCUS);
    _box.value.setFocused(true);
    _box.value.whenFocused();
  }
  //-----------------------------------------------------
  function onInputBlur() {
    _box.value.setFocused(false);
    //if (!_box.value.hasTips.value || _box.value.shouldWhenEmit('blur')) {
    _box.value.emitIfChanged();
    //}
  }
  //-----------------------------------------------------
  function onClickMask() {
    if (_box.value.shouldWhenEmit('close')) {
      _box.value.emitIfChanged();
    }
    _box.value.clearOptionsData();
    if (_box_state.box_value != props.value) {
      _box.value.debouncePropsValueChange();
    }
  }
  //-----------------------------------------------------
  function onOptionSelect(payload: ListSelectEmitInfo) {
    if (_box.value.isReadonly.value) {
      return;
    }
    //console.log('onOptionSelect', payload);
    _box.value.setValueByItem(payload.current || null);
    _box.value.emitIfChanged();
    _box.value.clearOptionsData();
    // 由于 emit 了 change, 如果 value 更 新，会导致 userInputBox2 重新计算
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
      if (props.options) {
        _box.value.debouncePropsValueChange();
      } else {
        _box.value.onPropsValueChange();
      }
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
  onMounted(() => {
    if (props.autoFocus) {
      _.delay(() => {
        if ($input.value) {
          $input.value.focus();
        }
      }, 100);
    }
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input"
    :class="_aspect.TopClass.value"
    :style="_aspect.TopStyle.value">
    <!--aside>
      [{{ _box.OptionsData.value.length }}]
      {{ _box_state }}
      {{ _box.isFocused.value ? '[F]' : '---' }}
      {{ _box.hasTips.value ? 'Tip' : '---' }}
      {{ _tip_box.DumpInfo.value }}
    </aside-->
    <div
      ref="el"
      class="part-main"
      :class="_aspect.PartMainClass.value"
      :style="_aspect.PartMainStyle.value">
      <slot name="head"> </slot>
      <!--主体框-->
      <div
        class="main-body"
        :style="_aspect.MainBodyStyle.value">
        <!--====================================-->
        <div
          v-if="_prefix.hasIcon.value"
          class="icon-part at-prefix"
          :class="_prefix.IconPartClass.value"
          v-html="_prefix.IconPartHtml.value"
          @click.left.stop="_prefix.onClick"></div>
        <!--====================================-->
        <input
          ref="input"
          :style="_aspect.InputStyle.value"
          :placeholder="_box.Placeholder.value"
          :value="_box.Text.value"
          :readonly="_box.isInputReadonly.value"
          spellcheck="false"
          @keydown="onKeyDown"
          @keyup="_comp.onKeyUp"
          @compositionstart="_comp.onStart"
          @compositionend="_comp.onEnd"
          @focus.stop="onInputFocused"
          @blur.stop="onInputBlur"
          @dblclick.stop />
        <!--====================================-->
        <div
          v-if="_suffix.hasIcon.value"
          class="icon-part at-suffix"
          :class="_suffix.IconPartClass.value"
          v-html="_suffix.IconPartHtml.value"
          @click.left.stop="_suffix.onClick"></div>
        <!--====================================-->
      </div>
      <slot name="tail"> </slot>
    </div>
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
