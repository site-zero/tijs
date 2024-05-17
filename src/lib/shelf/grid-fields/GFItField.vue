<script lang="ts" setup>
  import _ from 'lodash';
import { computed } from 'vue';
import { TextSnippet, useFieldCom, useFieldTransformer } from '../../';
import { CssUtils, Vars } from '../../../core';
import { GridFieldsStrictField } from './ti-grid-fields-types';
import {
  getFieldTipIcon,
  useFieldStyle,
  useGridItemStyle,
} from './use-field-style';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<GridFieldsStrictField>();

  const hasTitle = computed(() =>
    props.title || props.fieldTitleBy ? true : false
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

  const TitleAlign = computed(() => {
    if (!props.titleAlign) {
      return /^h-/.test(props.fieldLayoutMode) ? 'right' : undefined;
    }
    return props.titleAlign;
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

  const FieldTitleStyle = computed(() => {
    let css = _.cloneDeep(props.fieldTitleStyle) || {};
    if (props.maxFieldNameWidth && /^h-/.test(props.fieldLayoutMode)) {
      css.maxWidth = CssUtils.toSize2(props.maxFieldNameWidth);
    }
    css['grid-area'] = 'title';
    if (_.isEmpty(css)) {
      return;
    }
    return css;
  });

  const TipIcon = computed(() => {
    let icon = getFieldTipIcon(props);
    // 标题区提示图标
    if (icon && icon.position == 'title' && icon.type) {
      icon[`${icon.type}Icon`] = props.tipIcon;
    }
    // 值区提示图标
    return icon;
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
    class="ti-grid-fiels-item part-field"
    :class="TopClass"
    :style="TopStyle">
    <!--===============: 字段名 :===================-->
    <TextSnippet
      v-if="hasTitle"
      class="field-part as-title"
      :style="FieldTitleStyle"
      :attrs="{ dataAlign: TitleAlign }"
      :text="props.title || ''"
      :textType="props.titleType"
      :comType="props.fieldTitleBy?.comType"
      :comConf="props.fieldTitleBy?.comConf"
      :autoValue="props.fieldTitleBy?.autoValue"
      :readonlyComType="props.fieldTitleBy?.readonlyComType"
      :readonlyComConf="props.fieldTitleBy?.readonlyComConf"
      :activatedComType="props.fieldTitleBy?.activatedComType"
      :activatedComConf="props.fieldTitleBy?.activatedComConf"
      :changeEventName="props.fieldTitleBy?.changeEventName"
      :prefixIcon="TipIcon?.prefixIcon"
      :suffixIcon="TipIcon?.suffixIcon" />
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
    <TextSnippet
      v-if="hasTip && !TipIcon"
      class="field-part as-tip"
      style="grid-area: tip"
      :style="props.fieldTipStyle"
      :attrs="{ dataAlign: props.tipAlign }"
      :text="props.tip || ''"
      :textType="props.tipType"
      :comType="props.fieldTipBy?.comType"
      :comConf="props.fieldTipBy?.comConf"
      :autoValue="props.fieldTipBy?.autoValue"
      :readonlyComType="props.fieldTipBy?.readonlyComType"
      :readonlyComConf="props.fieldTipBy?.readonlyComConf"
      :activatedComType="props.fieldTipBy?.activatedComType"
      :activatedComConf="props.fieldTipBy?.activatedComConf"
      :changeEventName="props.fieldTipBy?.changeEventName" />
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/gf-it-field.scss';
</style>
./light-com-text ./light-com-snippet-text
