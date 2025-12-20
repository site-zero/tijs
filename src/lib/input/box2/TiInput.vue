<script setup lang="ts">
  import _ from "lodash";
  import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    useTemplateRef,
    watch,
  } from "vue";
  import { TiList } from "../../";
  import { Rect, Vars } from "../../../_type";
  import { ListSelectEmitInfo } from "../../../lib";
  import { useDict, useValuePipe, useViewport } from "../../_features";
  import {
    InputBoxEmitter,
    InputBoxExposeApi,
    InputBoxProps,
  } from "./ti-input-box-types";
  import { useBoxAspect } from "./use-box-aspect";
  import { useBoxIcon } from "./use-box-icon";
  import { useBoxTips } from "./use-box-tips";
  import { InputBoxState, useInputBox2 } from "./use-input-box2";
  import { useInputComposition } from "./use-input-composition";
  import { useTipList } from "./use-tip-list";
  import { useValueHintCooking } from "./use-value-hint-cooking";
  import { useValueOptions, ValueOptions } from "./use-value-options";
  //-----------------------------------------------------
  const emit = defineEmits<InputBoxEmitter>();
  const $el = useTemplateRef<HTMLElement>("el");
  const $input = useTemplateRef<HTMLInputElement>("input");
  //-------------------------------------------------
  defineExpose<InputBoxExposeApi>({
    getElement: () => $el.value,
    getInputElement: () => $el.value,
  });
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
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
  // 最后一个按键，主要用来监控 blur 的时候是不是 tab 触发的
  let __last_down_key = ""; // 譬如 'Tab|Enter|ArraowUp ...''
  let __last_down_at = 0; // 最后按下的时间戳
  // 最后一个选择的项目时间
  let __last_select_at = 0;
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputBoxProps>(), {
    value: "",
    autoI18n: true,
    tipShowTime: "focus",
    tipShowDelay: 500,
    tipUseHint: false,
    canInput: true,
    trimed: true,
    autoSelect: true,
    //boxFontSize: "m",
    boxPadding: "m",
    boxRadius: "s",
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
        let boxWidth = `${box.width}px`;
        let minWidth = boxWidth;
        if (props.tipListMinWidth) {
          minWidth = `max(${props.tipListMinWidth}, ${boxWidth})`;
        }
        return {
          minWidth,
          width: props.tipListWidth,
        };
      },
    })
  );
  //-----------------------------------------------------
  const _aspect = computed(() =>
    useBoxAspect(props, _box.value, _tip_box.value, _viewport)
  );
  //-----------------------------------------------------
  const _comp = useInputComposition({
    isReadonly: () => _box.value.isReadonly.value,
    onChange: (val) => {
      // 只读防守
      if (_box.value.isReadonly.value) {
        return;
      }
      //确保当前状态是 focused
      _box.value.setFocused(true);
      _box.value.applyPipe(val);
      _box.value.debounceApplyTipsByHint(_box_state.usr_text ?? undefined);
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
      clickEmit: "click:prefix-icon",
      getInputElement: () => $input.value,
    })
  );
  //-----------------------------------------------------
  const _suffix = computed(() =>
    useBoxIcon({
      _box: _box.value,
      icon: props.suffixIcon,
      hoverIcon: props.suffixHoverIcon,
      iconFor: props.suffixIconFor,
      clickEmit: "click:suffix-icon",
      getInputElement: () => $input.value,
    })
  );
  //-----------------------------------------------------
  function onKeyDown(event: KeyboardEvent) {
    if (_box.value.isReadonly.value) {
      // console.log("skip onKeyDown");
      return;
    }
    __last_down_key = event.key;
    __last_down_at = Date.now();
    //console.log('onKeyDown', event.key);
    _comp.onKeyPress(event);
    // 选择高亮项目
    if ("ArrowUp" == event.key) {
      event.preventDefault();
      _box.value.onKeyUpOrDown(-1);
    } else if ("ArrowDown" == event.key) {
      event.preventDefault();
      _box.value.onKeyUpOrDown(1);
    }
    // 取消
    else if ("Escape" == event.key) {
      _box.value.debouncePropsValueChange();
      _box.value.clearOptionsData();
      _box_state.usr_text = null;
    }
    // 确认
    else if ("Enter" == event.key) {
      event.preventDefault();
      _box.value.emitIfChanged();
      _box.value.clearOptionsData();
    }
  }
  //-----------------------------------------------------
  // const bus = inject(BUS_KEY);
  // const BUS_EVENT_FOCUS = 'INPUT_FOCUS';
  // bus?.onName(BUS_EVENT_FOCUS, () => {
  //   // if (!_box.value.isFocused.value && _box.value.hasTips.value) {
  //   //   // console.log('BUS_EVENT_FOCUS', _box.value.isFocused.value);
  //   //   _.delay(() => {
  //   //     _box.value.clearOptionsData();
  //   //   }, 1000);
  //   // }
  // });
  //-----------------------------------------------------
  function onInputFocused() {
    if (_box.value.isReadonly.value) {
      // console.log("skip onInputFocused");
      return;
    }
    // 原本没有 focus ，现在需要通知全局： 我要 focus 了
    // 那么其他的 dropdown 则会自动关闭
    // 为了保证自己不自动关闭，则需要首先设置自己为 focus
    if (!_box.value.isFocused.value) {
      _box.value.setFocused(true);
      //bus?.emit(BUS_EVENT_FOCUS);
    }
    _box.value.setFocused(true);
    _box.value.whenFocused();
  }
  //-----------------------------------------------------
  function onClickMask() {
    if (_box.value.shouldWhenEmit("close")) {
      _box.value.emitIfChanged();
    }
    _box.value.setFocused(false);
    _box.value.clearOptionsData();
    if (_box_state.box_value != props.value) {
      _box.value.debouncePropsValueChange();
    }
  }
  //-----------------------------------------------------
  function onInputBlur() {
    // console.log(
    //   'onInputBlur',
    //   _box_state.usr_text,
    //   _box_state.box_value,
    //   _box.value.hasTips.value
    // );
    _options.value?.abortOptonsLoading();
    let key_du = Date.now() - __last_down_at;
    let isBlurByTab = "Tab" == __last_down_key && key_du < 50;
    //console.log(`onInputBlur: isBlurByTab=${isBlurByTab}, key_du=${key_du}`);
    _.delay(() => {
      // 如果有选项，那么需要等待一会，看看用户是否已经选择了选项
      if (_box.value.hasTips.value && !isBlurByTab) {
        //console.log('onInputBlur dely emitI_atfChanged');
        _.delay(() => {
          let du = Date.now() - __last_select_at;
          //console.log(`onInputBlur du=${du}`);
          if (du > 1000) {
            //console.log('onInputBlur', 'notifyChange');
            _box_state.usr_text = null;
            _box.value.setFocused(false);
            _box.value.emitIfChanged();
          }
        }, 1000);
      }
      // 那么立刻通知
      else {
        //console.log('onInputBlur rightnow emitIfChanged');
        _box_state.usr_text = null;
        _box.value.setFocused(false);
        _box.value.emitIfChanged();
      }
    }, 10);
  }
  //-----------------------------------------------------
  function onOptionSelect(payload: ListSelectEmitInfo) {
    if (_box.value.isReadonly.value) {
      return;
    }
    __last_select_at = Date.now();
    _box_state.usr_text = null;
    //console.log('onOptionSelect', payload);
    _box.value.setValueByItem(payload.current || null);
    _box.value.setFocused(false);
    _box.value.emitIfChanged();
    _box.value.clearOptionsData();
  }
  //-----------------------------------------------------
  watch(
    () => _box.value.isFocused.value,
    (focused, oldVal) => {
      if (focused != oldVal || _.isUndefined(oldVal)) {
        if (focused) {
          emit("focus");
        } else {
          emit("blur");
        }
      }
    }
  );
  //-----------------------------------------------------
  // 这个监控器，监控 value 的改动，如果 value 变化
  // 会导致 useInputBox2 重新计算，因此其内部 _focused 状态会变成 false
  // 而 _options_data 会立刻被变成 undefined
  // 因此也导致 hasTips 变成 false
  watch(
    () => [props.value, props.options],
    (_newVal, _oldVal) => {
      //if (newVal && null === newVal[0] && _box_state.box_text) {
      //if (newVal && "HKHKG" === newVal[0]) {
      // console.log("onPropsValueChange", {
      //   value: newVal[0],
      //   boxtxt: _box_state.box_text,
      // });
      //}
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
      <div class="main-body" :style="_aspect.MainBodyStyle.value">
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
      <div class="part-brace" :style="_tip_box.BoxBraceStyle.value">
        <!--纯占位而已，似乎不需要内容-->
      </div>
      <!--遮罩层：展开选项后，会用这个来捕获全局 click-->
      <div class="part-mask" @click.left.stop="onClickMask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div class="part-options" :style="_tip_box.TipWrapperStyle.value">
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
  @use "./ti-input-box.scss";
</style>
