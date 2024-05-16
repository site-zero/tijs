<script lang="ts" setup>
  import { computed } from 'vue';
  import { useFieldCom, useFieldTransformer } from '../../';
  import { CssUtils } from '../../../core';
  import GFText from './GFText.vue';
  import { GridFieldsStrictField } from './ti-grid-fields-types';
  import _ from 'lodash';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<GridFieldsStrictField>();
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, props.fieldLayoutMode);
  });
  const NameStyle = computed(() => {
    let css = _.cloneDeep(props.fieldNameStyle) || {};
    if (props.maxFieldNameWidth) {
      css.maxWidth = CssUtils.toSize2(props.maxFieldNameWidth);
    }
    if (_.isEmpty(css)) {
      return;
    }
    return css;
  });

  const FieldValue = computed(() => {
    let trans = useFieldTransformer({
      name: props.name,
      type: props.type,
      transformer: props.transformer,
    });
    return trans.getFieldValue(props.data);
  });

  const FieldCom = computed(() => {
    let com = useFieldCom(props);
    return com.autoGetCom(
      { readonly: props.readonly },
      { value: FieldValue.value },
      FieldValue.value
    );
  });
</script>
<template>
  <div
    class="part-field"
    :class="TopClass"
    :style="props.style">
    <!--===============: 字段名 :===================-->
    <div
      v-if="props.title"
      class="field-part as-name"
      :class="TopClass"
      :style="NameStyle">
      <GFText
        class-name="field-name-text"
        :text="props.title || ''"
        :text-type="props.titleType"
        :com-type="props.fieldNameBy?.comType"
        :com-conf="props.fieldNameBy?.comConf"
        :auto-value="props.fieldNameBy?.autoValue"
        :readonly-com-type="props.fieldNameBy?.readonlyComType"
        :readonly-com-conf="props.fieldNameBy?.readonlyComConf"
        :activated-com-type="props.fieldNameBy?.activatedComType"
        :activated-com-conf="props.fieldNameBy?.activatedComConf"
        :change-event-name="props.fieldNameBy?.changeEventName" />
    </div>
    <!--===============: 字段值 :===================-->
    <div
      class="field-part as-value"
      :style="props.fieldValueStyle">
      <component
        :is="FieldCom.comType"
        v-bind="FieldCom.comConf" />
    </div>
    <!--==============: 提示信息 :==================-->
    <div
      v-if="props.tip"
      class="field-part as-tip"
      :style="props.fieldTipStyle">
      <GFText
        class-name="field-part as-tip"
        :text="props.tip || ''"
        :text-type="props.tipType"
        :com-type="props.fieldTipBy?.comType"
        :com-conf="props.fieldTipBy?.comConf"
        :auto-value="props.fieldTipBy?.autoValue"
        :readonly-com-type="props.fieldTipBy?.readonlyComType"
        :readonly-com-conf="props.fieldTipBy?.readonlyComConf"
        :activated-com-type="props.fieldTipBy?.activatedComType"
        :activated-com-conf="props.fieldTipBy?.activatedComConf"
        :change-event-name="props.fieldTipBy?.changeEventName" />
    </div>
  </div>
</template>
