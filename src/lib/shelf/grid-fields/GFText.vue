<script lang="ts" setup>
  import { computed } from 'vue';
  import { FieldComProps, useFieldCom } from '../..';
  import { I18n, Str } from '../../../core';
  import { GridPartChange, TextContentType } from './ti-grid-fields-types';
  /**
   * 充装一个控件用来给字段组各个部分填写文本信息。
   * 字段组的标题以及字段内的label。都可以采用插槽的方式让用户指定自定义的显示控件。
   * 本控件是一个默认的实现。
   */
  const emit = defineEmits<{
    (evetName: 'change', payload: GridPartChange<string>): void;
  }>();
  const props = withDefaults(
    defineProps<
      FieldComProps & {
        className: string;
        text: string;
        textType?: TextContentType;
        tip?: string;
        tipType?: TextContentType;
        autoI18n?: boolean;
      }
    >(),
    {
      autoI18n: true,
      textType: 'text',
      tipType: 'text',
      changeEventName: 'change',
    }
  );

  // 这里看看用户有没有自定义一个控件
  const TextCom = computed(() => {
    if (props.comType) {
      let com = useFieldCom(props);
      return com.autoGetCom({}, { value: props.text }, props.text);
    }
  });

  // 处理控件的修改事件
  function OnChange(val: any) {
    let payload = {
      newVal: Str.anyToStr(val),
      oldVal: props.text,
    };
    emit('change', payload);
  }
</script>
<template>
  <span :class="className">
    <!--
       自定义控件
     -->
    <component
      v-if="TextCom"
      :is="TextCom.comType"
      v-bind="TextCom.comConf"
      @change="OnChange" />
    <!-- 
      显示文字 
    -->
    <template v-else-if="text">
      <!-- 直接显示: i18n + HTML-->
      <span
        v-if="autoI18n && 'html' == textType"
        v-html="I18n.get(text)"></span>
      <!-- 直接显示: i18n +TEXT-->
      <span v-else-if="autoI18n">{{ I18n.get(text) }}</span>
      <!-- 直接显示: HTML-->
      <span
        v-else-if="'html' == textType"
        v-html="text"></span>
      <!-- 直接显示: TEXT-->
      <span v-else>{{ props.text }}</span>
    </template>
    <!-- 
      显示提示信息
    -->
    <template v-else-if="tip">
      <!-- 直接显示: i18n + HTML-->
      <span
        v-if="autoI18n && 'html' == tipType"
        v-html="I18n.get(tip)"></span>
      <!-- 直接显示: i18n +TEXT-->
      <span v-else-if="autoI18n">{{ I18n.get(tip) }}</span>
      <!-- 直接显示: HTML-->
      <span
        v-else-if="'html' == tipType"
        v-html="tip"></span>
      <!-- 直接显示: TEXT-->
      <span v-else>{{ props.tip }}</span>
    </template>
  </span>
</template>
