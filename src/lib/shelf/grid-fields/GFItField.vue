<script lang="ts" setup>
  import { computed } from 'vue';
  import { TextSnippet, getFieldValue, useFieldCom } from '../../';
  import { CssUtils, ValueChange } from '../../../core';
  import {
    GridFieldsStrictField,
    GridItemEmitter,
  } from './ti-grid-fields-types';
  import {
    getFieldIcon,
    getFieldTitle,
    getFieldTitleAlign,
    getFieldTitleStyle,
    getFieldTopStyle,
  } from './use-field-style';
import _ from 'lodash';

  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<GridItemEmitter>();
  const props = defineProps<GridFieldsStrictField>();

  const hasTitle = computed(() =>
    props.title || props.fieldTitleBy ? true : false
  );
  const hasTip = computed(() => (props.tip || props.tipBy ? true : false));

  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, props.fieldLayoutMode, {
      'with-title': hasTitle.value,
      'with-tip': hasTip.value,
      'no-title': !hasTitle.value,
      'no-tip': !hasTip.value,
      'is-disabled': props.isDisabled(props.data),
    });
  });

  const TopStyle = computed(() =>
    getFieldTopStyle(props, {
      hasTitle: hasTitle.value,
      hasTip: hasTip.value,
    })
  );
  const FieldTitleStyle = computed(() => getFieldTitleStyle(props));
  const TitleAlign = computed(() => getFieldTitleAlign(props));
  const FieldTitle = computed(() => getFieldTitle(props));
  const FieldIcon = computed(() =>
    getFieldIcon(props, hasTitle.value, hasTip.value)
  );
  const FieldValue = computed(() => {
    let val = getFieldValue(props.name, props.data);
    //console.log(props.name, val);
    if (props.transformer) {
      return props.transformer(val, props.data, props.name);
    }
    return val;
  });
  const FieldTitleVars = computed(() => {
    let required = false;
    if (props.required) {
      required = props.required(props.data);
    }
    return {
      uniqKey: props.uniqKey,
      title: props.title,
      name: props.name,
      tip: props.tip,
      value: FieldValue.value,
      data: props.data,
      required,
      readonly: props.readonly,
    };
  });

  const FieldCom = computed(() => {
    let com = useFieldCom(props);
    return com.autoGetCom(
      { readonly: props.readonly },
      { value: FieldValue.value },
      FieldValue.value
    );
  });

  const ListenValueChange = computed(() => {
    let key = props.changeEventName ?? 'change';
    return {
      [key]: (val: any) => {
        emit('value-change', {
          uniqKey: props.uniqKey,
          name: props.name,
          value: val,
          oldVal: FieldValue.value,
        });
      },
    };
  });

  function onTitleChange(payload: ValueChange<string>) {
    console.log('onTitleChange', payload);
    emit('name-change', {
      value: payload.value,
      oldVal: props.uniqKey,
    });
  }
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
      :textStyle="props.titleTextStyle"
      :attrs="{ dataAlign: TitleAlign }"
      :text="FieldTitle.title"
      :textType="FieldTitle.type"
      :autoI18n="false"
      :comType="props.fieldTitleBy?.comType"
      :comConf="props.fieldTitleBy?.comConf"
      :autoValue="props.fieldTitleBy?.autoValue"
      :readonlyComType="props.fieldTitleBy?.readonlyComType"
      :readonlyComConf="props.fieldTitleBy?.readonlyComConf"
      :activatedComType="props.fieldTitleBy?.activatedComType"
      :activatedComConf="props.fieldTitleBy?.activatedComConf"
      :changeEventName="props.fieldTitleBy?.changeEventName"
      :prefixIcon="FieldIcon?.titlePrefixIcon"
      :suffixIcon="FieldIcon?.titleSuffixIcon"
      :vars="FieldTitleVars"
      @change="onTitleChange" />
    <!--===============: 字段值 :===================-->
    <div
      class="field-part as-value"
      :style="props.fieldValueStyle">
      <component
        :is="FieldCom.comType"
        v-bind="FieldCom.comConf"
        v-on="ListenValueChange" />
    </div>
    <!--==============: 提示信息 :==================-->
    <TextSnippet
      v-if="hasTip && !FieldIcon.tipAsIcon"
      class="field-part as-tip"
      :style="props.tipStyle"
      :textStyle="props.tipTextStyle"
      :attrs="{ dataAlign: props.tipAlign }"
      :text="props.tip || ''"
      :textType="props.tipType"
      :comType="props.tipBy?.comType"
      :comConf="props.tipBy?.comConf"
      :autoValue="props.tipBy?.autoValue"
      :readonlyComType="props.tipBy?.readonlyComType"
      :readonlyComConf="props.tipBy?.readonlyComConf"
      :activatedComType="props.tipBy?.activatedComType"
      :activatedComConf="props.tipBy?.activatedComConf"
      :changeEventName="props.tipBy?.changeEventName"
      :vars="FieldTitleVars" />
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/gf-it-field.scss';
</style>
