<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { TextSnippet, useFieldCom } from '../../';
  import { ValueChange, getFieldValue } from '../../../_type';
  import { CssUtils } from '../../../core';
  import {
    FIELD_STATUS_KEY,
    GridFieldsStrictField,
    GridItemEmitter,
  } from './ti-grid-fields-types';
  import {
    getFieldIcon,
    getFieldTextInfo,
    getFieldTitleAlign,
    getFieldTitleStyle,
    getFieldTopStyle,
  } from './use-field-style';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridItemEmitter>();
  const props = defineProps<
    GridFieldsStrictField & {
      isActived?: boolean;
    }
  >();
  //-------------------------------------------------
  const hasTitle = computed(() =>
    props.title || props.fieldTitleBy ? true : false
  );
  //-------------------------------------------------
  const hasTip = computed(() => (props.tip || props.tipBy ? true : false));
  //-------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, props.fieldLayoutMode, {
      'with-title': hasTitle.value,
      'with-tip': hasTip.value,
      'no-title': !hasTitle.value,
      'no-tip': !hasTip.value,
      'is-disabled': props.isDisabled(props.data),
    });
  });
  //-------------------------------------------------
  const TopStyle = computed(() =>
    getFieldTopStyle(props, {
      hasTitle: hasTitle.value,
      hasTip: hasTip.value,
    })
  );
  //-------------------------------------------------
  const AllFieldStatus = inject(FIELD_STATUS_KEY);
  const FieldStatus = computed(() => AllFieldStatus?.value.get(props.uniqKey));
  const FieldTitleStyle = computed(() =>
    getFieldTitleStyle(props, FieldStatus.value)
  );
  //-------------------------------------------------
  const TitleAlign = computed(() => getFieldTitleAlign(props));
  //-------------------------------------------------
  const FieldText = computed(() => getFieldTextInfo(props, props.vars));
  const FieldIcon = computed(() =>
    getFieldIcon(props, hasTitle.value, hasTip.value, FieldStatus.value)
  );
  //-------------------------------------------------
  const FieldValue = computed(() => {
    let val = getFieldValue(props.name, props.data) ?? props.defaultAs;
    if (props.transformer) {
      return props.transformer(val, props.data, props.name);
    }
    return val;
  });
  //-------------------------------------------------
  const FieldTitleVars = computed(() => {
    let required = false;
    if (props.isRequired) {
      required = props.isRequired(props.data);
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
  //-------------------------------------------------
  const FieldCom = computed(() => {
    let com = useFieldCom(props);
    return com.autoGetCom(
      { readonly: props.readonly, actived: props.isActived },
      { value: FieldValue.value, data: props.data, vars: props.vars ?? {} },
      FieldValue.value
    );
  });
  //-------------------------------------------------
  const ListenValueChange = computed(() => {
    let key = props.changeEventName ?? 'change';
    return {
      [key]: (val: any) => {
        //console.log('value-chagne!!!', val);
        emit('value-change', {
          uniqKey: props.uniqKey,
          name: props.name,
          value: val,
          oldVal: FieldValue.value,
        });
      },
    };
  });
  //-------------------------------------------------
  function onTitleChange(payload: ValueChange<string>) {
    console.log('onTitleChange', payload);
    emit('name-change', {
      value: payload.value,
      oldVal: props.uniqKey,
    });
  }
  //-------------------------------------------------
  function onFieldMouseDown() {
    emit('field-active', props.uniqKey);
  }
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-grid-fiels-item part-field"
    :class="TopClass"
    :style="TopStyle"
    @mousedown="onFieldMouseDown">
    <!--===============: 字段名 :===================-->
    <TextSnippet
      v-if="hasTitle"
      class="field-part as-title"
      :dynamic="true"
      :style="FieldTitleStyle"
      :textStyle="props.titleTextStyle"
      :attrs="{ dataAlign: TitleAlign }"
      :text="FieldText.title"
      :textType="FieldText.titleType"
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
      :text="FieldText.tip ?? ''"
      :textType="FieldText.tipType"
      :comType="props.tipBy?.comType"
      :comConf="props.tipBy?.comConf"
      :autoValue="props.tipBy?.autoValue"
      :readonlyComType="props.tipBy?.readonlyComType"
      :readonlyComConf="props.tipBy?.readonlyComConf"
      :activatedComType="props.tipBy?.activatedComType"
      :activatedComConf="props.tipBy?.activatedComConf"
      :changeEventName="props.tipBy?.changeEventName"
      :prefixIcon="FieldIcon?.tipPrefixIcon"
      :suffixIcon="FieldIcon?.tipSuffixIcon"
      :vars="FieldTitleVars" />
  </div>
</template>
<style lang="scss">
  @use './style/gf-it-field.scss';
</style>
