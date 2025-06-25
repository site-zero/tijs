<script lang="ts" setup>
  import _ from "lodash";
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
  import {
    ListItem,
    ListSelectEmitInfo,
    TiActionBar,
    TiInput,
    TiList,
    useOptions,
    useStdListItem,
  } from "../../";
  import { StdOptionItem, TableRowID } from "../../../_type";
  import { CssUtils, I18n, Util } from "../../../core";
  import { TransferProps, TransferState } from "./ti-transfer-types";
  import { TransferEmitter, useTransfer } from "./use-transfer";
  //-----------------------------------------------------
  const emit = defineEmits<TransferEmitter>();
  //-----------------------------------------------------
  const props = defineProps<TransferProps>();
  const _stat = reactive({
    options: [],
    filterValue: "",
    can_checked_ids: [],
    sel_checked_ids: [],
  } as TransferState);
  //-----------------------------------------------------
  const _sel_list = ref<StdOptionItem[]>([]);
  //-----------------------------------------------------
  const _options = computed(() => useOptions(props));
  const _std_list = computed(() => useStdListItem(props));
  const _transfer = useTransfer(_stat, props, _options, _std_list, emit);
  //-----------------------------------------------------
  const OptionsMap = computed(() => _transfer.buildOptionsMap());
  //-----------------------------------------------------
  const CanList = computed(() => _transfer.getCandidateList());
  const CanCheckedIds = computed(() => Util.arrayToMap(_stat.can_checked_ids));
  const SelCheckedIds = computed(() => Util.arrayToMap(_stat.sel_checked_ids));
  //-----------------------------------------------------
  const ListConfig = computed(() => _transfer.getListConfig());
  //-----------------------------------------------------
  const ActionStatus = computed(() => ({
    hasCanChecked: !_.isEmpty(_stat.can_checked_ids),
    hasSelChecked: !_.isEmpty(_stat.sel_checked_ids),
    hasValues: !_.isEmpty(props.value),
  }));
  //-----------------------------------------------------
  const SelMenuActionItems = computed(() => _transfer.getSelMenuItems());
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, {
      "cover-parent": "cover" == props.fitMode,
      "fit-parent": "fit" == props.fitMode,
    })
  );
  //-----------------------------------------------------
  const AssignButtonClass = computed(() => ({
    "is-enabled": ActionStatus.value.hasCanChecked,
    "is-disabled": !ActionStatus.value.hasCanChecked,
  }));
  //-----------------------------------------------------
  const RemoveButtonClass = computed(() => ({
    "is-enabled": ActionStatus.value.hasSelChecked,
    "is-disabled": !ActionStatus.value.hasSelChecked,
  }));
  //-----------------------------------------------------
  function onCanSelect(payload: ListSelectEmitInfo) {
    _stat.can_checked_ids = Util.mapTruthyKeys(payload.checkedIds);
  }
  //-----------------------------------------------------
  function onCanOpen(it: ListItem) {
    let ids = _.clone(_stat.can_checked_ids || []);
    ids.push(it.value);
    _stat.can_checked_ids = _.uniq(ids);
    doAssign();
  }
  //-----------------------------------------------------
  function onSelSelect(payload: ListSelectEmitInfo) {
    _stat.sel_checked_ids = Util.mapTruthyKeys(payload.checkedIds);
  }
  //-----------------------------------------------------
  function onSelOpen(it: ListItem) {
    let ids = _.clone(_stat.sel_checked_ids || []);
    ids.push(it.value);
    _stat.sel_checked_ids = _.uniq(ids);
    doRemove();
  }
  //-----------------------------------------------------
  function doAssign() {
    if (ActionStatus.value.hasCanChecked) {
      let vals = _.concat(props.value || [], _stat.can_checked_ids);
      _stat.can_checked_ids = [];
      emit("change", vals);
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
      emit("change", vals);
    }
  }
  //-----------------------------------------------------
  // watch(
  //   () => _stat.sel_checked_ids,
  //   (newval, oldval) => {
  //     console.log("_stat.sel_checked_ids changed", newval, oldval);
  //   }
  // );
  //-----------------------------------------------------
  watch(
    () => props.options,
    (newval, oldval) => {
      if (!_.isEqual(newval, oldval)) {
        //console.log("watch options", _.isEqual(newval, oldval), newval, oldval);
        _transfer.reloadOptions();
      }
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => [props.value, _stat.options, _std_list.value],
    () => {
      //console.log("watch value");
      _transfer.loadSelectedList(_sel_list, OptionsMap.value);
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-transfer" :class="TopClass">
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
            _transfer.getListEmptyRoadblock(
              'i18n:ti-transfer-can-none',
              'fas-list'
            )
          "
          :data="CanList"
          @select="onCanSelect"
          @open="onCanOpen">
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
        <a :class="AssignButtonClass" @click="doAssign"
          ><i class="fa-solid fa-angles-right"></i>
        </a>
        <a :class="RemoveButtonClass" @click="doRemove"
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
            _transfer.getListEmptyRoadblock('i18n:nil-item', 'fas-arrow-left')
          "
          :data="_sel_list"
          @select="onSelSelect"
          @open="onSelOpen">
          <template v-slot:head>
            <div class="list-head transfer-menu">
              <div class="sel-text">
                {{ I18n.get("ti-transfer-sel-list") }}:
              </div>
              <TiActionBar :items="SelMenuActionItems" :vars="ActionStatus" />
            </div>
          </template>
        </TiList>
      </div>
    </main>
    <slot name="tail"></slot>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-transfer.scss";
</style>
