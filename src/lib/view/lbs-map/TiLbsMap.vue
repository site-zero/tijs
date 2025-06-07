<script setup lang="ts">
  import "leaflet/dist/leaflet.css";
  import _ from "lodash";
  import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
  import { TiLoading } from "../../";
  import { CssUtils, LbsMapDrawContext } from "../../../";
  import {
    LbsMapEmitter,
    LbsMapProps,
    LbsMapShowInfo,
  } from "./ti-lbs-map-types";
  import { useLbsMap } from "./use-lbs-map";
  import { getMapData } from "./use-lbs-map-data";
  import { initMap, redrawMap } from "./use-lbs-map-view";
  //--------------------------------------------
  const $main = useTemplateRef<HTMLDivElement>("main");
  const emit = defineEmits<LbsMapEmitter>();
  //--------------------------------------------
  const props = withDefaults(defineProps<LbsMapProps>(), {
    zoom: 10,
    maxZoom: 18,
    valuePrecision: 6,
    valueCoords: "WGS84",
  });
  //--------------------------------------------
  const _dc: LbsMapDrawContext = {
    // 当前地图实例/活动图层
    $map: undefined,
    $live: undefined,
    // 地图处理后的值计算属性
    mapData: computed(() => getMapData(props, _dc.baseTileCoords)),
    // 当前地图地理信息摘要
    geo: ref({}),
    // 基础图层坐标系
    baseTileCoords: "WGS84",
    // 用户交互状态
    lastMove: 0, // 最后一次移动的时间
    loading: false,
    // 鼠标经纬度坐标
    pointerClick: ref(),
    pointerHover: ref(),
    // 冷却状态
    cooling: 0,
    is_check_cooling: false,
    // 监控器
    resizeObserver: null,
  };
  //--------------------------------------------
  const _api = computed(() => useLbsMap(props, _dc, emit));
  //--------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className);
  });
  //--------------------------------------------
  const TopStyle = computed(() => {
    return CssUtils.toStyle(props.style);
  });
  //--------------------------------------------
  const isShowInfo = computed(() => {
    return props.showInfo ? true : false;
  });
  //--------------------------------------------
  const ShowInfo = computed(() => {
    return _.assign(
      {
        zoom: true,
        center: false,
        latRange: false,
        lngRange: false,
        pointerHover: false,
        pointerClick: false,
      } as LbsMapShowInfo,
      props.showInfo
    );
  });
  //--------------------------------------------
  function _init_map() {
    initMap(() => $main.value, props, _dc, _api.value);
  }
  //--------------------------------------------
  // 不能 immediate ，因为 $main 容器还没创建
  watch(
    () => [props.valueCoords, props.tileLayer, props.editPoint],
    () => {
      _init_map();
    }
  );
  //--------------------------------------------
  watch(
    () => props.value,
    () => {
      // console.log("watch value", props.value);
      if (!_.isEqual(props.value, _dc.mapData.value)) {
        // console.log("redraw map")
        redrawMap(props, _dc, _api.value);
      }
      _api.value.fitView();
    }
  );
  //--------------------------------------------
  onMounted(() => {
    _init_map();
  });
  //--------------------------------------------
</script>

<template>
  <div class="ti-lbl-map fit-parent" :class="TopClass" :style="TopStyle">
    <!--
    Main for the map
  -->
    <main class="fit-parent" ref="main"></main>
    <!--
    Tip Info
  -->
    <div v-if="isShowInfo" class="wgl-map-info">
      <!--
        Zoom
      -->
      <div class="info-ele" v-if="ShowInfo.zoom">
        <i class="fas fa-search-location"></i>
        <span>{{ _dc.geo.value.zoom }}</span>
      </div>
      <!--
        Center
      -->
      <div class="info-ele" v-if="ShowInfo.center && _dc.geo.value.center">
        <i class="fas fa-arrows-alt"></i>
        <span>{{ _api.GeoPointStr(_dc.geo.value.center) }}</span>
      </div>
      <!--
        Latitude range
      -->
      <div class="info-ele" v-if="ShowInfo.latRange">
        <i class="fas fa-arrows-alt-v"></i>
        <span>{{ _api.GeoStr(_dc.geo.value.N) }}</span
        >/<span>{{ _api.GeoStr(_dc.geo.value.S) }}</span>
      </div>
      <!--
        Longitude range
      -->
      <div class="info-ele" v-if="ShowInfo.lngRange">
        <i class="fas fa-arrows-alt-h"></i>
        <span>{{ _api.GeoStr(_dc.geo.value.W) }}</span
        >/<span>{{ _api.GeoStr(_dc.geo.value.E) }}</span>
      </div>
      <!--
        Pointer Hover
      -->
      <div
        v-if="ShowInfo.pointerHover && !_.isEmpty(_dc.pointerHover)"
        class="info-ele">
        <i class="fas fa-map-marker"></i>
        <span
          >{{ _api.GeoStr(_dc.pointerHover.value?.lat) }},
          {{ _api.GeoStr(_dc.pointerHover.value?.lng) }}</span
        >
      </div>
      <!--
        Pointer Click
      -->
      <div
        v-if="ShowInfo.pointerClick && !_.isEmpty(_dc.pointerClick)"
        class="info-ele">
        <i
          class="fas fa-mouse"
          @click.left="_dc.pointerClick.value = undefined"></i>
        <span>{{ _api.GeoPointStr(_dc.pointerClick.value) }}</span>
      </div>
    </div>
    <!--
    Loading Info
  -->
    <TiLoading v-if="_dc.loading" v-bind="props.loadingRoadblock" />
  </div>
</template>

<style lang="scss">
  @use "./ti-lbs-map.scss";
</style>
