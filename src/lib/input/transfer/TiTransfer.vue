<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, reactive, ref, watch } from 'vue';
  import { ListSelectEmitInfo, TiActionBar, TiInput, TiList } from '../../';
  import { I18n, StdOptionItem, TableRowID, Util } from '../../../core';
  import { TransferProps, TransferState } from './ti-transfer-types';
  import { TransferEmitter, useTransfer } from './use-transfer';
  //-----------------------------------------------------
  const emit = defineEmits<TransferEmitter>();
  //-----------------------------------------------------
  const props = defineProps<TransferProps>();
  const _stat = reactive({
    options: [],
    filterValue: '',
    can_checked_ids: [],
    sel_checked_ids: [],
  } as TransferState);
  const _sel_list = ref<StdOptionItem[]>([]);
  //-----------------------------------------------------
  const _tran = computed(() => useTransfer(_stat, props, emit));
  //-----------------------------------------------------
  const CanList = computed(() => _tran.value.getCandidateList());
  const CanCheckedIds = computed(() => Util.arrayToMap(_stat.can_checked_ids));
  const SelCheckedIds = computed(() => Util.arrayToMap(_stat.sel_checked_ids));
  //-----------------------------------------------------
  const ListConfig = computed(() => _tran.value.getListConfig());
  //-----------------------------------------------------
  const ActionStatus = computed(() => ({
    hasCanChecked: !_.isEmpty(_stat.can_checked_ids),
    hasSelChecked: !_.isEmpty(_stat.sel_checked_ids),
    hasValues: !_.isEmpty(props.value),
  }));
  //-----------------------------------------------------
  const SelMenuActionItems = computed(() => _tran.value.getSelMenuItems());
  //-----------------------------------------------------
  const AssignButtonClass = computed(() => ({
    'is-enabled': ActionStatus.value.hasCanChecked,
    'is-disabled': !ActionStatus.value.hasCanChecked,
  }));
  //-----------------------------------------------------
  const RemoveButtonClass = computed(() => ({
    'is-enabled': ActionStatus.value.hasSelChecked,
    'is-disabled': !ActionStatus.value.hasSelChecked,
  }));
  //-----------------------------------------------------
  function onCanSelect(payload: ListSelectEmitInfo) {
    _stat.can_checked_ids = Util.mapTruthyKeys(payload.checkedIds);
  }
  //-----------------------------------------------------
  function onSelSelect(payload: ListSelectEmitInfo) {
    _stat.sel_checked_ids = Util.mapTruthyKeys(payload.checkedIds);
  }
  //-----------------------------------------------------
  function doAssign() {
    if (ActionStatus.value.hasCanChecked) {
      let vals = _.concat(props.value || [], _stat.can_checked_ids);
      _stat.can_checked_ids = [];
      emit('change', vals);
    }
  }
  //-----------------------------------------------------
  function doRemove() {
    if (ActionStatus.value.hasSelChecked) {
      let selMap = Util.arrayToMap(_stat.sel_checked_ids);
      _stat.sel_checked_ids = [];
      let vals = _.filter(props.value, (v) => {
        return !selMap.get(v);
      }) as TableRowID[];
      emit('change', vals);
    }
  }
  //-----------------------------------------------------
  watch(
    () => props.options,
    () => {
      _tran.value.reloadOptions();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => [props.value, _tran.value],
    () => {
      _tran.value.loadSelectedList(_sel_list);
    },
    {
      immediate: true,
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-transfer">
    <slot name="head"></slot>
    <main>
      <!--========: Can List :====== -->
      <div class="part-list as-can">
        <TiList
          class="fit-parent"
          v-bind="ListConfig"
          :checked-ids="CanCheckedIds"
          :multi="true"
          :empty-roadblock="
            _tran.getListEmptyRoadblock('i18n:ti-transfer-can-none', 'fas-list')
          "
          :data="CanList"
          @select="onCanSelect">
          <template v-slot:head>
            <div class="list-head transfer-filter">
              <TiInput
                placeholder="i18n:ti-transfer-filter-tip"
                :value="_stat.filterValue"
                :trimed="true"
                :prefix-icon-for-clean="true"
                prefix-icon="zmdi-search"
                prefix-hover-icon="fas-xmark"
                @change="_stat.filterValue = $event" />
            </div>
          </template>
        </TiList>
      </div>
      <!--========: Actions :====== -->
      <div class="part-actions">
        <a
          :class="AssignButtonClass"
          @click="doAssign"
          ><i class="fa-solid fa-angles-right"></i>
        </a>
        <a
          :class="RemoveButtonClass"
          @click="doRemove"
          ><i class="fa-solid fa-angles-left"></i
        ></a>
      </div>
      <!--========: Sel List :====== -->
      <div class="part-list as-sel">
        <TiList
          class="fit-parent"
          v-bind="ListConfig"
          :checked-ids="SelCheckedIds"
          :multi="true"
          :empty-roadblock="
            _tran.getListEmptyRoadblock('i18n:nil-item', 'fas-arrow-left')
          "
          :data="_sel_list"
          @select="onSelSelect">
          <template v-slot:head>
            <div class="list-head transfer-menu">
              <span>{{ I18n.get('ti-transfer-sel-list') }}:</span>
              <TiActionBar
                :items="SelMenuActionItems"
                :vars="ActionStatus" />
            </div>
          </template>
        </TiList>
      </div>
    </main>
    <slot name="tail"></slot>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-transfer.scss';
</style>
