<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive, watch } from 'vue';
  import { CssUtils } from '../../../core';
  import TiFormModeGroup from './group/TiFormModeGroup.vue';
  import TiFormModeTab from './tab/TiFormModeTab.vue';
  import { COM_TYPE, FormEmits, useForm } from './use-form';
  import { normalizeGridLayout } from './use-form-layout';
  import { FormProps } from './use-form-props';
  import { FormState } from './use-form-state';
  //-------------------------------------------------
  defineOptions({
    name: COM_TYPE,
    inheritAttrs: false,
  });
  //-------------------------------------------------
  const state = reactive({
    data: {},
    context: {},
  }) as FormState;
  //-------------------------------------------------
  const props = withDefaults(defineProps<FormProps>(), {
    mode: 'group',
    layout: '[[5,1500],[4,1200],[3,900],[2,500],1]',
    onlyFields: true,
    omitHiddenFields: false,
    dataMode: 'auto',
    notifyMode: 'auto',

    defaultFieldType: 'String',
    defaultComType: 'TiLabel',
    blankAs: () => ({
      icon: 'fab-deezer',
      text: 'i18n:empty',
    }),
    statusIcons: () => ({
      pending: 'fas-spinner fa-spin',
      error: 'zmdi-alert-polygon',
      warn: 'zmdi-alert-triangle',
      ok: 'zmdi-check-circle',
      highlight: 'zmdi-alert-triangle',
    }),
  });
  watch(
    () => props.data,
    function (newVal, oldVal) {
      if (!_.isEqual(newVal, oldVal)) {
        state.data = newVal || {};
      }
    }
  );
  //-------------------------------------------------
  let emit = defineEmits<FormEmits>();
  //-------------------------------------------------
  let Form = useForm(state, props, { emit });
  //-------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, `layout-as-${props.mode}`);
  });
  const FormTitle = computed(() => Form.getFormTitle());
  const FormFields = computed(() =>
    Form.getFormFields(props, props.fields || [], state.context)
  );
  const FormLayout = computed(() => {
    return normalizeGridLayout(props.layout);
  });
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-form cover-parent"
    :class="TopClass">
    <!--表单标题-->
    <header v-if="FormTitle">{{ FormTitle }}</header>
    <!-- 分组平铺模式 -->
    <TiFormModeGroup
      v-if="'group' == props.mode"
      :fields="FormFields"
      :data="state.data"
      :layout="FormLayout"
      :maxFieldNameWidth="maxFieldNameWidth"
      @field-change="Form.OnFieldChange" />
    <!-- 分组标签模式 -->
    <TiFormModeTab
      v-else-if="'tab' == props.mode"
      :fields="FormFields"
      :data="state.data"
      :layout="FormLayout"
      @field-change="Form.OnFieldChange" />
  </div>
</template>
<style lang="scss" scoped>
  @import './ti-form.scss';
</style>
