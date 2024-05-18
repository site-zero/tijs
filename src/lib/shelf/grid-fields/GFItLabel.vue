<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { TextSnippet } from '../../';
  import { GridFieldsStrictLabel } from './ti-grid-fields-types';
  import { getGridItemStyle } from './use-field-style';

  defineOptions({
    inheritAttrs: false,
  });

  const props = defineProps<GridFieldsStrictLabel>();
  const TopStyle = computed(() => {
    let css_1 = getGridItemStyle(props);
    return _.assign({}, props.style, css_1);
  });
</script>
<template>
  <div
    class="ti-grid-fiels-item part-label"
    :class="props.className"
    :style="TopStyle">
    <!--===: 标题 :===-->
    <TextSnippet
      v-if="props.title || props.comType"
      className="as-label-title"
      :style="TopStyle"
      :text="props.title || ''"
      :textType="props.titleType"
      :comType="props.comType"
      :comConf="props.comConf"
      :autoValue="props.autoValue"
      :readonlyComType="props.readonlyComType"
      :readonlyComConf="props.readonlyComConf"
      :activatedComType="props.activatedComType"
      :activatedComConf="props.activatedComConf"
      :changeEventName="props.changeEventName"
      :vars="props.data" />
    <!--===: 摘要 :===-->
    <TextSnippet
      v-if="props.tip || props.tipBy"
      className="as-group-title"
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
      :vars="props.data" />
  </div>
</template>
