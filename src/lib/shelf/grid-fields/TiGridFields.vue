<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue';
  import {
    RoadblockProps,
    TiRoadblock,
    TiTextSnippet,
    useFieldChange,
    useGridLayout,
    useViewport,
  } from '../../';
  import { FieldChange } from '../../../_type';
  import { CssUtils } from '../../../core';
  import GFItField from './GFItField.vue';
  import GFItGroup from './GFItGroup.vue';
  import GFItLabel from './GFItLabel.vue';
  // import {
  //   buildGridFieldsLayoutStyle,
  //   parseGridLayout,
  // } from './build-grid-field-layout';
  import {
    FIELD_STATUS_KEY,
    GridFieldsDomReadyInfo,
    GridFieldsEmitter,
    GridFieldsProps,
    GridFieldsStrictField,
    GridFieldsStrictGroup,
    GridFieldsStrictLabel,
  } from './ti-grid-fields-types';
  import { useFieldStatus } from './use-field-status';
  import { getBodyPartStyle, getFieldTextInfo } from './use-field-style';
  import { useGridFields } from './use-grid-fields';
  //-------------------------------------------------
  defineOptions({
    inheritAttrs: true,
  });
  //-------------------------------------------------
  const emit = defineEmits<GridFieldsEmitter>();
  const props = withDefaults(defineProps<GridFieldsProps>(), {
    fields: () => [],
    bodyPartGap: 'm',
    bodyPartFontSize: 's',
    //fieldLayoutMode: 'h-wrap',
    fieldLayoutMode: 'h-title-icon-suffix',
    maxFieldNameWidth: '6em',
    changeMode: 'diff',
    allowUndefinedFields: true,
    data: () => ({}),
  });
  //const _viewport_width = ref(0);
  //-------------------------------------------------
  const $el = ref<HTMLElement>();
  const $main = ref<HTMLElement>();
  //-------------------------------------------------
  const _viewport = useViewport({
    el: $el,
    onMounted,
    onUnmounted,
  });
  const _actived_uniqKey = ref<string>();
  //-------------------------------------------------
  const Grid = computed(() => useGridFields(props));
  //-------------------------------------------------
  const isEmptyData = computed(() => _.isEmpty(props.data));
  const FormEmptyRoadblock = computed(() => {
    return _.assign(
      {
        text: 'i18n:empty-data',
        icon: 'fas-clipboard-list',
        mode: 'cover',
        size: 'normal',
        layout: 'A',
        opacity: 'shadowy',
      } as RoadblockProps,
      props.emptyRoadblock
    ) as RoadblockProps;
  });
  //-------------------------------------------------
  // let GridLayout = computed(() => useGridLayoutTrack(props));
  // let GridLayoutStyle = computed(() =>
  //   useGridLayoutStyle(GridLayout.value, _viewport.size.width)
  // );
  let GridLayoutStyle = computed(() =>
    useGridLayout(props, _viewport.size.width)
  );
  //-------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `body-gap-${props.bodyPartGap}`,
      `fsz-${props.bodyPartFontSize}`
    )
  );
  //-------------------------------------------------
  const BodyStyle = computed(() => {
    let css = getBodyPartStyle(props);
    return GridLayoutStyle.value.mergetStyle(css);
  });
  //-------------------------------------------------
  const buildFieldStatus = computed(() =>
    useFieldStatus(Grid.value.fieldItems, props.fieldStatusIcons)
  );
  //-------------------------------------------------
  const _field_status = computed(() =>
    buildFieldStatus.value(props.fieldStatus)
  );
  provide(FIELD_STATUS_KEY, _field_status);
  //-------------------------------------------------
  const Change = computed(() =>
    useFieldChange<GridFieldsStrictField>(props, Grid.value.fieldItems)
  );
  //-------------------------------------------------
  const GridText = computed(() =>
    getFieldTextInfo(
      {
        title: props.title,
        titleType: props.titleType ?? 'text',
        fieldTitleBy: props.fieldTitleBy,
        tip: props.tip,
        tipType: props.tipType ?? 'text',
        data: props.data,
      },
      props.vars
    )
  );
  //-------------------------------------------------
  // function updateViewportWidth() {
  //   let w = $main.value?.getBoundingClientRect().width ?? 0;
  //   if (w > 0 && w != _viewport_width.value) {
  //     _viewport_width.value = $main.value?.clientWidth ?? 0;
  //     //console.log('obResize', _viewport_width.value, $main.value);
  //   }
  // }
  //-------------------------------------------------
  /**
   * 处理值的修改
   *
   * @param change 修改的值
   */
  async function onValueChange(change: FieldChange) {
    //console.log('Form.onValueChange', change)
    Change.value.handleValueChange(change, {
      emit,
      data: props.data || {},
      checkEquals: props.checkEquals,
    });
  }
  //-------------------------------------------------
  function onFieldActived(uniqKey: string) {
    // _.delay(() => {
    //   _actived_uniqKey.value = uniqKey;
    // }, 10);
    _actived_uniqKey.value = uniqKey;
  }
  //-------------------------------------------------
  function onFieldInactived(uniqKey: string) {
    _actived_uniqKey.value = uniqKey;
    if (_actived_uniqKey.value == uniqKey) {
      _actived_uniqKey.value = undefined;
    }
  }
  //-------------------------------------------------
  // const obResize = new ResizeObserver((_entries) => {
  //   updateViewportWidth();
  // });
  //-------------------------------------------------
  if (props.whenGrid) {
    watch(
      () => Grid.value,
      () => {
        if (props.whenGrid) {
          props.whenGrid(Grid.value);
        }
      },
      { immediate: true }
    );
  }
  //-------------------------------------------------
  watch(
    () => isEmptyData.value,
    () => {
      if (!isEmptyData.value) {
        //console.log('_viewport.value.updateViewPortSize();');
        _viewport.updateViewPortSize();
      }
    }
  );
  //-------------------------------------------------
  onMounted(() => {
    if ($el.value) {
      let info: GridFieldsDomReadyInfo = {
        el: $el.value!,
        main: $main.value,
      };
      emit('dom-ready', info);
    }
  });
  //-------------------------------------------------
</script>
<template>
  <div
    class="ti-grid-fields"
    :class="TopClass"
    :style="props.style"
    ref="$el">
    <!--===============: 表单头 :===================-->
    <slot name="head">
      <TiTextSnippet
        v-if="props.title"
        className="part-title"
        :class="props.titleClass"
        :style="props.titleStyle"
        :prefixIcon="props.titleIcon"
        :text="GridText.title"
        :textType="GridText.titleType"
        :comType="props.comType"
        :comConf="props.comConf"
        :autoValue="props.autoValue"
        :readonlyComType="props.readonlyComType"
        :readonlyComConf="props.readonlyComConf"
        :activatedComType="props.activatedComType"
        :activatedComConf="props.activatedComConf" />
    </slot>
    <!-- 
      显示空数据提示
     -->
    <div
      v-if="isEmptyData && props.emptyRoadblock"
      class="part-empty-tip">
      <TiRoadblock v-bind="FormEmptyRoadblock" />
    </div>
    <!-- 
      显示表单
     -->
    <template v-else>
      <!--=============: 上部多用途插槽 :==============-->
      <slot name="head_ext"></slot>
      <!--===============: 表单体 :===================-->
      <div
        ref="$main"
        class="part-body"
        :style="BodyStyle">
        <template v-for="fld in Grid.strictItems">
          <template v-if="!fld.isHidden(props.data)">
            <!------[:Field:]---------->
            <GFItField
              v-if="'field' == fld.race"
              v-bind="(fld as GridFieldsStrictField)"
              :max-track-count="GridLayoutStyle.trackCount"
              :is-actived="fld.uniqKey == _actived_uniqKey"
              @name-change="emit('name-change', $event)"
              @value-change="onValueChange"
              @field-actived="onFieldActived"
              @field-inactived="onFieldInactived" />
            <!------[:Group:]---------->
            <GFItGroup
              v-else-if="'group' == fld.race"
              v-bind="(fld as GridFieldsStrictGroup)"
              :max-track-count="GridLayoutStyle.trackCount"
              :actived-uniq-key="_actived_uniqKey"
              @name-change="emit('name-change', $event)"
              @value-change="onValueChange"
              @field-actived="onFieldActived" />
            <!------[:Label:]---------->
            <GFItLabel
              v-else-if="'label' == fld.race"
              v-bind="(fld as GridFieldsStrictLabel)"
              :max-track-count="GridLayoutStyle.trackCount" />
            <!------[!Invalid!]---------->
            <blockquote
              v-else
              style="white-space: pre; color: var(--ti-color-error)">
              Invalid Field: -------------------------------------------
              {{ fld }}
            </blockquote>
          </template>
        </template>
      </div>
      <!--==========下==: 上部多用途插槽 :==============-->
      <slot name="foot_ext"></slot>
    </template>
    <!--===============: 表单尾 :===================-->
    <slot name="foot">
      <TiTextSnippet
        v-if="props.tip"
        className="part-foot"
        :class="props.tipClass"
        :style="props.tipStyle"
        :text="props.tip || ''"
        :textType="props.tipType"
        :comType="props.tipBy?.comType"
        :comConf="props.tipBy?.comConf"
        :autoValue="props.tipBy?.autoValue"
        :readonlyComType="props.tipBy?.readonlyComType"
        :readonlyComConf="props.tipBy?.readonlyComConf"
        :activatedComType="props.tipBy?.activatedComType"
        :activatedComConf="props.tipBy?.activatedComConf"
        :changeEventName="props.tipBy?.changeEventName" />
    </slot>
  </div>
</template>
<style lang="scss">
  @use './style/ti-grid-fields.scss';
</style>
