<script setup lang="ts">
  import { computed, reactive, useTemplateRef, watch } from 'vue';
  import { TiList } from '../../';
  import { ListSelectEmitInfo } from '../../../lib';
  import { InputBox2Emitter, InputBox2Props } from './ti-input-box2-types';
  import { useBoxAspect } from './use-box-aspect';
  import { useBoxTips } from './use-box-tips';
  import { InputBoxState, useInputBox2 } from './use-input-box2';
  import { useInputComposition } from './use-input-composition';
  import { useTipList } from './use-tip-list';
  //-----------------------------------------------------
  const emit = defineEmits<InputBox2Emitter>();
  const $el = useTemplateRef<HTMLElement>('el ');
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
      tipBoxVisible: _box.value.hasTips,
      hideBoxTip: () => _box.value.clearOptionsData(),
      tipListMinWidth: props.tipListMinWidth,
      tipListWidth: props.tipListWidth,
    })
  );
  const _aspect = computed(() =>
    useBoxAspect(props, _box.value, _tip_box.value)
  );
  //-----------------------------------------------------
  const _comp = useInputComposition({
    onChange: (val) => {
      _box.value.onValueUpate(val);
    },
  });
  //-----------------------------------------------------
  function onKeyDown(event: KeyboardEvent) {
    // 选择高亮项目
    if (/^Arrow(Up|Down)$/.test(event.key)) {
      // 这个需要让 TiList 提供一个回调函数
      // 可以注册一个 API 提供 上下移动的能力
    }
    // 取消
    else if ('Escape' == event.key) {
      _box.value.onPropsValueChange();
    }
    // 确认
    else if ('Enter' == event.key) {
      _box.value.emitIfChanged();
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
    _box.value.clearOptionsData();
  }
  //-----------------------------------------------------
  function onOptionSelect(paylod: ListSelectEmitInfo) {
    console.log(paylod);
  }
  //-----------------------------------------------------
  watch(
    () => props.value,
    () => {
      _box.value.onPropsValueChange();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input">
    <aside>
      {{ _box_state }}
      {{ _box.isFocused.value ? '[F]' : '---' }}
      {{ _box.hasTips.value ? 'Tip' : '---' }}
      {{ _tip_box.DumpInfo.value }}
    </aside>
    <!--主体框-->
    <div
      class="part-main"
      ref="el"
      :class="_aspect.TopClass.value"
      :style="_aspect.TopStyle.value">
      <slot name="head"> </slot>
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
      <div class="part-mask"></div>
      <!--选项层：展开的选项存放的地方-->
      <div
        class="part-options"
        :style="_tip_box.TipWrapperStyle.value">
        <TiList
          v-bind="_tip_list.TipListConfig.value"
          :currentId="_box_state.box_value"
          :data="_box.OptionsData?.value"
          @select="onOptionSelect" />
      </div>
    </template>
  </div>
</template>
<style lang="scss">
  @use './ti-input-box2.scss';
</style>
