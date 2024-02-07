<script lang="ts" setup>
  import { CssUtils, Dom, Rects, Size2D, Vars } from '../../../../core';
  import { AppEvents, BUS_KEY, FieldPair, TiEvent, TiField } from '../../../';
  import { FieldEvents } from '../../field/use-field.ts';
  import _ from 'lodash';
  import {
    Ref,
    computed,
    inject,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
  } from 'vue';
  import { FormItem } from '../use-form-field';
  import {
    autoCountGrid,
    buildFieldsGroupStyle,
    normalizeGridLayout,
  } from '../use-form-layout';
  defineOptions({
    name: 'TiFormItem',
    inheritAttrs: true,
  });
  let emit = defineEmits<{
    (event: FieldEvents, payload: TiEvent<FieldPair>): void;
  }>();
  let GBus = inject(BUS_KEY);
  /*-------------------------------------------------------

                      State

-------------------------------------------------------*/
  const $main: Ref<HTMLElement> = ref() as Ref<HTMLElement>;
  const _viewport: Ref<Size2D> = ref({ width: 0, height: 0 });
  const _auto_field_name_max_width = ref(0);
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  type FormItemProps = FormItem & {
    data: Vars;
    // 自动计算出来每个字段名称部分最大的宽度
    autoFieldNameMaxWidth?: number;
  };
  const FItem = withDefaults(defineProps<FormItemProps>(), {
    autoFieldNameMaxWidth: 0,
    maxFieldNameWidth: 0,
  });
  /*-------------------------------------------------------

                    Computed

-------------------------------------------------------*/
  const TopStyle = computed(() => {
    return CssUtils.toStyle(FItem.style);
  });
  const GridLayout = computed(() => {
    return normalizeGridLayout(FItem.layout);
  });
  const TrackCount = computed(() => {
    return autoCountGrid(_viewport.value, GridLayout.value);
  });
  const MainStyle = computed(() => {
    if ('group' != FItem.race) {
      return;
    }
    return buildFieldsGroupStyle(GridLayout.value, TrackCount.value);
  });
  const MaxFieldNameWidth = computed(() => {
    if (FItem.autoFieldNameMaxWidth > 0) {
      if (FItem.maxFieldNameWidth > 0) {
        return Math.min(FItem.maxFieldNameWidth, FItem.autoFieldNameMaxWidth);
      }
      return FItem.autoFieldNameMaxWidth;
    }
  });
  /*-------------------------------------------------------

                    Methods

-------------------------------------------------------*/
  function updateViewport() {
    if (!_.isElement($main.value)) {
      return;
    }
    nextTick(() => {
      //console.log("FormItem:updateViewport");
      let rect = Rects.createBy($main.value);
      _viewport.value = rect.toSize2D();
    });
  }

  function updateMaxFieldNameWidth() {
    if (!_.isElement($main.value)) {
      return;
    }
    nextTick(() => {
      //console.log("FormItem:updateFieldMaxWidth");
      let sel = [
        ':scope',
        '.ti-form-item',
        '.ti-field-name',
        '.field-name-con',
      ].join('>');
      let $flds = Dom.findAll(sel, $main.value);
      let maxW = 0;
      for (let $fld of $flds) {
        let w = $fld.getBoundingClientRect().width;
        maxW = Math.max(maxW, w);
      }
      _auto_field_name_max_width.value = maxW;
    });
  }

  function updateMeasure() {
    updateViewport();
    updateMaxFieldNameWidth();
  }

  const debounceUpdateViewport = _.debounce(updateViewport, 300, {
    leading: true,
    trailing: true,
  });
  /*-------------------------------------------------------

                  Life Hooks

-------------------------------------------------------*/
  onMounted(() => {
    updateMeasure();
    if (GBus && 'group' == FItem.race) {
      GBus.on(AppEvents.APP_RESIZE, debounceUpdateViewport);
    }
  });
  onUnmounted(() => {
    if (GBus && 'group' == FItem.race) {
      GBus.off(debounceUpdateViewport, AppEvents.APP_RESIZE);
    }
  });
</script>
<template>
  <section
    class="ti-form-item"
    :type="FItem.race"
    :class="FItem.className"
    :style="TopStyle">
    <!--字段组-->
    <template v-if="'group' == FItem.race">
      <header v-if="FItem.title">
        {{ FItem.title }}
      </header>
      <main :style="MainStyle" ref="$main">
        <TiFormItem
          v-for="it in FItem.fields"
          :key="it.uniqKey"
          v-bind="it"
          :data="FItem.data"
          :autoFieldNameMaxWidth="_auto_field_name_max_width"
          :maxFieldNameWidth="it.maxFieldNameWidth"
          @change="emit('change', $event)" />
      </main>
    </template>
    <!--标签-->
    <span v-else-if="'label' == FItem.race">{{ FItem.title }}</span>
    <!--普通字段-->
    <TiField
      v-else-if="FItem.props"
      v-bind="FItem.props"
      :data="FItem.data"
      :nameWidth="MaxFieldNameWidth"
      @change="emit('change', $event)" />
  </section>
</template>
<style lang="scss">
  @use '../../../../assets/style/_all.scss' as *;
  @import './form-item.scss';
</style>
