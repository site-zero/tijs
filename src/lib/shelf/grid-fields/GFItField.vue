<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { useFieldCom, useFieldTransformer } from '../../';
  import { CssUtils, Vars } from '../../../core';
  import GFText from './GFText.vue';
  import { GridFieldsStrictField } from './ti-grid-fields-types';
  import { useFieldStyle, useGridItemStyle } from './use-field-style';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<GridFieldsStrictField>();

  const hasTitle = computed(() =>
    props.title || props.fieldNameBy ? true : false
  );
  const hasTip = computed(() => (props.tip || props.fieldTipBy ? true : false));

  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, props.fieldLayoutMode, {
      'with-title': hasTitle.value,
      'with-tip': hasTip.value,
      'no-title': !hasTitle.value,
      'no-tip': !hasTip.value,
    });
  });

  const TopStyle = computed(() => {
    let css_1 = useGridItemStyle(props);
    let css_2 = useFieldStyle(
      props.fieldLayoutMode,
      props.maxFieldNameWidth ?? 100,
      hasTitle.value,
      hasTip.value
    );
    return _.assign({}, props.style, css_1, css_2) as Vars;
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
    :style="TopStyle">
    <!--===============: 字段名 :===================-->
    <div
      v-if="hasTitle"
      class="field-part as-name"
      :class="TopClass"
      style="grid-area: title"
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
      style="grid-area: value"
      :style="props.fieldValueStyle">
      <component
        :is="FieldCom.comType"
        v-bind="FieldCom.comConf" />
    </div>
    <!--==============: 提示信息 :==================-->
    <div
      v-if="hasTip"
      class="field-part as-tip"
      style="grid-area: tip"
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
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './style/gf-it-field.scss';
</style>
