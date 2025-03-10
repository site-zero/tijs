<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, onMounted, ref, watch } from 'vue';
  import {
    ComboFilterEmitter,
    ComboFilterProps,
    FilterExportApi,
    FilterValue,
    SorterExportApi,
    SorterValue,
    TiFilter,
    TiSorter,
    useKeep,
  } from '../../';
  import { ActionBarItem } from '../../../_type';
  import { CssUtils, Util } from '../../../core';
  import { useComboFilterKeep } from './use-combo-filter-keep';
  //-------------------------------------------------
  const emit = defineEmits<ComboFilterEmitter>();
  //-------------------------------------------------
  const props = withDefaults(defineProps<ComboFilterProps>(), {
    layout: 'comfy',
    changeMode: 'all',
  });
  //-------------------------------------------------
  const _major_fields = ref<string[]>([]);
  //-------------------------------------------------
  const KeepMajor = computed(() => useKeep(props.keepMajor));
  //-------------------------------------------------
  const FltValue = computed(() => {
    return _.get(props.value, 'filter') || {};
  });
  //-------------------------------------------------
  const SrtValue = computed(() => {
    return _.get(props.value, 'sorter') || {};
  });
  //-------------------------------------------------
  const FltConfig = computed(() =>
    _.omit(props.filterConfig, 'value', 'moreActions', 'majorFields')
  );
  //-------------------------------------------------
  const SrtConfig = computed(() =>
    _.omit(props.sorterConfig, 'value', 'exportApi')
  );
  //-------------------------------------------------
  const TopClass = computed(() => CssUtils.mergeClassName(props.className));
  //-------------------------------------------------
  function onFilterMajorChange(majorKeys: string[]) {
    if (_.isEmpty(majorKeys)) {
      _major_fields.value = props.filterConfig?.majorFields ?? [];
      KeepMajor.value.remove();
    } else {
      _major_fields.value = majorKeys;
      KeepMajor.value.save(_major_fields.value);
    }
  }
  //-------------------------------------------------
  function onFilterMajorReset() {
    _major_fields.value = props.filterConfig?.majorFields ?? [];
    KeepMajor.value.remove();
  }
  //-------------------------------------------------
  function onFilterChange(flt: FilterValue) {
    // 差异模式
    if ('diff' == props.changeMode) {
      let old = _.cloneDeep(props.value?.filter ?? {});
      let diff = Util.getRecordDiff(old, flt, { checkRemoveFromOrgin: true });
      console.log('---', old, diff);
      emit('change', { filter: diff });
    }
    // 全量模式
    else {
      let val = _.cloneDeep(props.value) ?? {};
      val.filter = flt;
      emit('change', val);
    }
  }
  //-------------------------------------------------
  function onSorterChange(srt: SorterValue) {
    // 差异模式
    if ('diff' == props.changeMode) {
      let old = _.cloneDeep(props.value?.sorter ?? {});
      let diff = Util.getRecordDiff(old, srt, { checkRemoveFromOrgin: true });
      emit('change', { sorter: diff });
    }
    // 全量模式
    else {
      let val = _.cloneDeep(props.value) ?? {};
      val.sorter = srt;
      emit('change', val);
    }
  }
  //-------------------------------------------------
  const MoreActions = computed(() => {
    let re: ActionBarItem[] = [
      {
        icon: 'zmdi-sort-asc',
        text: 'i18n:ti-combo-filter-sort-setup',
        action: () => {
          console.log(_sorter_api.value);
          _sorter_api.value?.setupSorterFields();
        },
      },
    ];
    if (props.moreActions) {
      re.push(...props.moreActions);
    }
    return re;
  });
  //-------------------------------------------------
  const _sorter_api = ref<SorterExportApi>();
  function regSorterApi(sortApi: SorterExportApi) {
    _sorter_api.value = sortApi;
  }
  //-------------------------------------------------
  const _filter_api = ref<FilterExportApi>();
  function regFilterApi(filterApi: FilterExportApi) {
    _filter_api.value = filterApi;
  }
  //-------------------------------------------------
  watch(
    () => [_sorter_api.value, _filter_api.value],
    () => {
      if (props.exportApi && _sorter_api.value && _filter_api.value) {
        props.exportApi({
          ..._sorter_api.value,
          ..._filter_api.value,
        });
      }
    }
  );
  //-------------------------------------------------
  watch(
    () => props.keepMajor,
    () => {
      useComboFilterKeep(KeepMajor, props, _major_fields);
    }
  );
  //-------------------------------------------------
  onMounted(() => {
    useComboFilterKeep(KeepMajor, props, _major_fields);
  });
  //-------------------------------------------------
</script>
<template>
  <TiFilter
    class="ti-combo-filter"
    :class="TopClass"
    v-bind="FltConfig"
    :major-fields="_major_fields"
    :value="FltValue"
    :layout="props.layout"
    :more-actions="MoreActions"
    :export-api="regFilterApi"
    @change="onFilterChange"
    @change-major="onFilterMajorChange"
    @reset-major="onFilterMajorReset"
    @search="emit('search')"
    @reset="emit('reset')">
    <template v-slot:foot>
      <TiSorter
        class="part-sorter"
        :can-setup="false"
        title="i18n:ti-combo-filter-sort-title"
        v-bind="SrtConfig"
        :value="SrtValue"
        :export-api="regSorterApi"
        @change="onSorterChange" />
    </template>
  </TiFilter>
</template>
<style lang="scss" scoped>
  @use './ti-combo-filter.scss';
</style>
