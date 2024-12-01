<script setup lang="ts">
  import { computed, useTemplateRef, watch } from 'vue';
  import { InputBox2Emitter, InputBox2Props } from './ti-input-box2-types';
  import { useBoxAspect } from './use-box-aspect';
  import { useInputBox2 } from './use-input-box2';
  import { useInputComposition } from './use-input-composition';
  //-----------------------------------------------------
  const emit = defineEmits<InputBox2Emitter>();
  const $el = useTemplateRef<HTMLElement>('el ');
  const $input = useTemplateRef<HTMLInputElement>('input');
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
  const _aspect = computed(() => useBoxAspect(props));
  //-----------------------------------------------------
  const _box = computed(() =>
    useInputBox2(props, {
      getElement: () => $el.value,
      getInputElement: () => $input.value,
      emit,
    })
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
  }
  //-----------------------------------------------------
  watch(()=>props.value, () => {
    _box.value.onPropsValueChange();
  }, {immediate: true});
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-input"
    ref="el"
    :class="_aspect.TopClass.value"
    :style="_aspect.TopStyle.value">
    <div>{{ _box._focused.value ? 'F' : '-' }}</div>
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
  </div>
</template>
<style lang="scss">
  @use './ti-input-box2.scss';
</style>
