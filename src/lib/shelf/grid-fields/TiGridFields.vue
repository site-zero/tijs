<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, ref } from 'vue';
  import { buildGridFieldsLayoutStyle } from './build-grid-field-layout';
  import { GridFieldsEmitter, GridFieldsProps } from './ti-grid-fields-types';
  import { useGridFields } from './use-grid-fields';

  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<GridFieldsProps>(), {
    fields: () => [],
  });
  const _viewport_width = ref(0);

  const Grid = computed(() => useGridFields(props));
  const getLayoutCss = computed(() => buildGridFieldsLayoutStyle(props));
  const TopStyle = computed(() => {
    let css = getLayoutCss.value(_viewport_width.value);
    return _.assign({}, props.style, css);
  });
</script>
<template>
  <div
    class="ti-grid-fields"
    :class="Grid.className"
    :style="TopStyle">
    <!--标题区-->
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './style/ti-grid-fields.scss';
</style>
