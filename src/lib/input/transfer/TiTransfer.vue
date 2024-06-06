<script lang="ts" setup>
  import { computed, reactive, ref, watch } from 'vue';
  import { TransferProps, TransferState } from './ti-transfer-types';
  import { useTransfer } from './use-transfer';
  import { StdOptionItem } from '../../../core';
  import { TiList, TiInput } from '../../';
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
  const _tran = computed(() => useTransfer(_stat, props));
  //-----------------------------------------------------
  const CanList = computed(() => _tran.value.getCandidateList());
  //-----------------------------------------------------
  const ListConfig = computed(() => _tran.value.getListConfig());
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
      <div class="part-list as-can"></div>
      <!--========: Operation :====== -->
      <div class="part-actions">
        <TiInput :value="_stat.filterValue" :trimed="true"
        :prefix-icon-for-clean="true"
        prefix-icon="zmdi-search" />
      </div>
      <!--========: Sel List :====== -->
      <div class="part-list as-sel"></div>
    </main>
    <slot name="tail"></slot>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-transfer.scss';
</style>
