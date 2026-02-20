<script lang="ts" setup>
  import JSON5 from "json5";
  import _ from "lodash";
  import { computed, inject } from "vue";
  import { TiTextSnippet, useFieldCom, useReadonly } from "../../";
  import { LogicType, Vars, getFieldValue } from "../../../_type";
  import { CssUtils } from "../../../core";
  import {
    FIELD_STATUS_KEY,
    FormFieldItem,
    GridItemEmitter,
  } from "./ti-grid-fields-types";
  import {
    getFieldIcon,
    getFieldTextInfo,
    getFieldTitleAlign,
    getFieldTitleStyle,
    getFieldTopStyle,
  } from "./use-field-style";
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridItemEmitter>();
  const props = defineProps<
    FormFieldItem & {
      isActived?: boolean;
      titleAsPlaceholder?: boolean;
    }
  >();
  //-------------------------------------------------
  const hasTitle = computed(() => {
    if (props.titleAsPlaceholder) return false;
    return props.title || props.fieldTitleBy ? true : false;
  });
  //-------------------------------------------------
  const hasTip = computed(() => (props.tip || props.tipBy ? true : false));
  //-------------------------------------------------
  const isDisabled = computed(() =>
    props.isDisabled(FieldDynamicContext.value)
  );
  //-------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, props.fieldLayoutMode, {
      "with-title": hasTitle.value,
      "with-tip": hasTip.value,
      "no-title": !hasTitle.value,
      "no-tip": !hasTip.value,
      "is-disabled": isDisabled.value,
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
  const FieldLogicType = computed((): LogicType | undefined => {
    if ("warn" == FieldStatus.value?.type) {
      return "warn";
    }
    if ("error" == FieldStatus.value?.type) {
      return "danger";
    }
  });
  //-------------------------------------------------
  const FieldDynamicContext = computed(() => {
    return {
      ...props.data,
      $vars: props.vars,
      $field: {
        uniqKey: props.uniqKey,
        name: props.name,
        value: FieldValue.value,
      },
    };
  });
  //-------------------------------------------------
  const _readonly = computed(() => useReadonly(props));
  const FieldReadonly = computed(() => {
    return _readonly.value.isReadonly(FieldDynamicContext.value);
  });
  //-------------------------------------------------
  const TitleAlign = computed(() => getFieldTitleAlign(props));
  //-------------------------------------------------
  const FieldText = computed(() =>
    getFieldTextInfo(props, FieldDynamicContext.value)
  );
  const FieldIcon = computed(() =>
    getFieldIcon(props, hasTitle.value, hasTip.value, FieldStatus.value)
  );
  //-------------------------------------------------
  const FieldCtrlTip = computed(() => {
    let html = ["<table>"];
    html.push(`<tr>
      <td>Title:</td>
      <td style="color:var(--ti-color-info-r)">${FieldText.value.title}</td>
    </tr>`);
    html.push(`<tr>
      <td>Name:</td>
      <td style="color:var(--ti-color-success-r)">${JSON.stringify(
        props.name
      )}</td>
    </tr>`);
    html.push(`<tr>
      <td>UniqKey:</td>
      <td style="color:var(--ti-color-text-r)">${props.uniqKey}</td>
    </tr>`);
    html.push(`<tr>
      <td>Type:</td>
      <td style="color:var(--ti-color-primary-r)">${props.type || "String"}</td>
    </tr>`);
    html.push(`<tr>
      <td>Value:</td>
      <td style="color:var(--ti-color-secondary-r)">${JSON5.stringify(
        FieldValue.value
      )}</td>
    </tr>`);
    html.push("</table>");
    return html.join("");
  });
  //-------------------------------------------------
  const FieldValue = computed(() => {
    let val = getFieldValue(props.name, props.data) ?? props.defaultAs;
    if (props.transformer) {
      return props.transformer(val, props.data, props.name);
    }
    return val;
  });
  //-------------------------------------------------
  const FieldTitleVars = computed((): Vars => {
    let required = false;
    if (props.isRequired) {
      required = props.isRequired(props.data);
    }
    return {
      ...(props.vars ?? {}),
      uniqKey: props.uniqKey,
      //title: props.title,
      title: FieldText.value.title,
      name: props.name,
      tip: props.tip,
      value: FieldValue.value,
      data: props.data,
      required,
      readonly: FieldReadonly.value,
    };
  });
  //-------------------------------------------------
  const FieldCom = computed(() => {
    let com = useFieldCom(props);
    let re = com.autoGetCom(
      { readonly: FieldReadonly.value, actived: props.isActived },
      FieldDynamicContext.value,
      FieldValue.value
    );
    if (props.titleAsPlaceholder) {
      _.defaults(re.comConf, {
        placeholder: FieldText.value.title,
      });
    }
    return re;
  });
  //-------------------------------------------------
  const ListenValueChange = computed(() => {
    let key = props.changeEventName ?? "change";
    return {
      [key]: (val: any) => {
        //console.log('value-chagne!!!', val);
        emit("value-change", {
          uniqKey: props.uniqKey,
          name: props.name,
          value: val,
          oldVal: FieldValue.value,
        });
      },
    };
  });
  //-------------------------------------------------
  function onTitleChange(newValue: any) {
    const payload = {
      uniqKey: props.uniqKey,
      name: props.name,
      value: newValue,
    };
    //console.log("onTitleChange", payload);
    emit("name-change", payload);
  }
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-grid-fiels-item part-field"
    :class="TopClass"
    :style="TopStyle"
    :data-tip="isDisabled ? FieldCtrlTip : null"
    data-tip-modifier="CTRL"
    data-tip-max-width="640px"
    data-tip-content-type="html"
    data-tip-dock-mode="H"
    @mousedown="emit('field-actived', props.uniqKey)">
    <!--===============: 字段名 :===================-->
    <TiTextSnippet
      v-if="hasTitle"
      class="field-part as-title"
      v-bind="props.fieldTitleBy"
      :style="FieldTitleStyle"
      :textStyle="props.titleTextStyle"
      :attrs="{ dataAlign: TitleAlign }"
      :text="FieldText.title"
      :textType="FieldText.titleType"
      :logicType="FieldLogicType"
      :autoI18n="false"
      :prefixIcon="FieldIcon?.titlePrefixIcon"
      :prefixTip="FieldIcon?.titlePrefixTip"
      :suffixIcon="FieldIcon?.titleSuffixIcon"
      :suffixTip="FieldIcon?.titleSuffixTip"
      :vars="FieldTitleVars"
      :ctrlTip="FieldCtrlTip"
      @change="onTitleChange" />
    <!--===============: 字段值 :===================-->
    <div class="field-part as-value" :style="props.fieldValueStyle">
      <component
        :is="FieldCom.rawCom"
        v-bind="FieldCom.comConf"
        v-on="ListenValueChange"
        @blur="emit('field-inactived', props.uniqKey)"
        @focus="if (!props.isActived) emit('field-actived', props.uniqKey);" />
    </div>
    <!--==============: 提示信息 :==================-->
    <TiTextSnippet
      v-if="hasTip && !FieldIcon.tipAsIcon"
      class="field-part as-tip"
      :style="props.tipStyle"
      :textStyle="props.tipTextStyle"
      :attrs="{ dataAlign: props.tipAlign }"
      :text="FieldText.tip ?? ''"
      :textType="FieldText.tipType"
      :logicType="FieldLogicType"
      :autoI18n="true"
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
  @use "./style/gf-it-field.scss";
</style>
