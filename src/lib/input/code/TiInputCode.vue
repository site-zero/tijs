<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { InputBoxApi, InputBoxProps, TiInput, useViewport } from '../../';
  import { AnyOptionItem, ToStr } from '../../../_type';
  import { CssUtils, Util } from '../../../core';
  import { InputCodeProps } from './ti-input-code-types';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: string): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<InputCodeProps>(), {
    tipShowTime: 'focus',
    tipUseHint: false,
    tipTidyBy: () => ['main'],
    canInput: true,
    trimed: true,
    mustInOptions: true,
    gap: 't',
    // 自动，如果可编辑，就是 true ，否则就是 false
    checkValueWhenClose: undefined,
    autoSelect: true,
    useRawValue: true,
    valueCase: 'upperAll',
    codeWidth: '3em',
    hideDescription: false,
  });
  //-------------------------------------------------
  const $el = ref<HTMLElement>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
  //-----------------------------------------------------
  const _item = ref<AnyOptionItem>();
  const _box = ref<InputBoxApi>();
  //-----------------------------------------------------
  const InputConfig = computed(() => {
    let re: InputBoxProps = _.omit(
      props,
      'style',
      'className',
      'codeWidth',
      'textStyle',
      'gap',
      'getDescription',
      'hideDescription',
      'tipListWidth'
    );
    re.tipListWidth = props.tipListWidth ?? `${_viewport.size.width}px`;
    if (!re.tipFormat) {
      re.tipFormat = 'VT';
    }
    if (props.codeWidth && !props.hideDescription) {
      re.mainBodyStyle = {
        width: CssUtils.toSize(props.codeWidth),
        flex: '0 0 auto',
      };
    }
    return re;
  });
  //-----------------------------------------------------
  const CodeTextStyle = computed(() => {
    let re = _.cloneDeep(props.textBoxStyle ?? {});
    if (props.gap) {
      re.marginLeft = `var(--ti-gap-${props.gap})`;
    }
    return re;
  });
  //-----------------------------------------------------
  const GetDescription = computed((): ToStr<AnyOptionItem> => {
    // 默认
    if (!props.getDescription) {
      // [val] [txt]
      if (props.useRawValue) {
        return (item: AnyOptionItem): string => {
          return item.text ?? item.tip ?? item.value;
        };
      }
      // [txt] [tip]
      return (item: AnyOptionItem): string => {
        return item.tip ?? item.text ?? item.value;
      };
    }
    // 指定了键
    if (_.isString(props.getDescription)) {
      return Util.genObjGetter(props.getDescription);
    }
    // 完全定制
    return props.getDescription;
  });
  //-----------------------------------------------------
  const InputValue = computed(() => {
    if (_.isUndefined(_item.value)) {
      return props.value;
    }
    return _item.value.value;
  });
  //-----------------------------------------------------
  const InputText = computed(() => {
    if (!_item.value) {
      return props.descriptionPlaceholder ?? '';
    }
    return GetDescription.value(_item.value);
  });
  //-----------------------------------------------------
  function onBoxItemChange(it: AnyOptionItem | null) {
    _item.value = it ?? undefined;
    emit('change', it?.value || null);
  }
  //-----------------------------------------------------
  async function onBoxExportApi(box: InputBoxApi) {
    _box.value = box;
    if (props.value) {
      _item.value = await _box.value?.getItemByValue(props.value);
    } else {
      _item.value = undefined;
    }
  }
  //-----------------------------------------------------
</script>
<template>
  <TiInput
    v-bind="InputConfig"
    :emit-type="'std-item'"
    :value="InputValue"
    :export-api="onBoxExportApi"
    @change="onBoxItemChange">
    <template v-slot:tail>
      <div
        v-if="!props.hideDescription"
        class="box-part as-code-text"
        :style="CodeTextStyle">
        {{ InputText }}
      </div>
    </template>
  </TiInput>
</template>
<style lang="scss">
  .box-part.as-code-text {
    align-content: center;
    border: 1px solid var(--ti-color-border-weak);
    background-color: var(--ti-color-disable-r);
    color: var(--ti-color-disable);
    font-size: calc(var(--box-fontsz) * 0.8);
    border-radius: var(--box-radius);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 10px;
  }
</style>
