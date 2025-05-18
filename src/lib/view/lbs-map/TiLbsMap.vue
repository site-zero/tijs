<script setup lang="ts">
  import _ from "lodash";
  import { computed, onMounted, reactive, useTemplateRef, watch } from "vue";
  import { TiLoading } from "../../";
  import { CssUtils, LbsMapDrawContext, Vars } from "../../../";
  import { LbsMapEmitter, LbsMapProps } from "./ti-lbs-map-types";
  import { useLbsMap } from "./use-lbs-map";
  import { getMapData } from "./use-lbs-map-data";
  import { initMap } from "./use-lbs-map-view";
  //--------------------------------------------
  const $main = useTemplateRef<HTMLDivElement>("main");
  const emit = defineEmits<LbsMapEmitter>();
  //--------------------------------------------
  const props = withDefaults(defineProps<LbsMapProps>(), {
    zoom: 10,
  });
  //--------------------------------------------
  const _dc: LbsMapDrawContext = reactive({
    $map: undefined,
    $live: undefined,

    geo: {},

    baseTileCoords: "WGS84",

    lastMove: 0,
    loading: false,

    pointerClick: undefined,
    pointerHover: undefined,

    cooling: 0,
    is_check_cooling: false,
  });
  //--------------------------------------------
  const _api = computed(() => useLbsMap(props, _dc, emit));
  const _map_data = computed(() => getMapData(props, _dc.baseTileCoords));
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
    if (!props.showInfo) return {} as Vars;

    return _.assign(
      {
        zoom: true,
        center: false,
        latRange: false,
        lngRange: false,
        pointerHover: false,
        pointerClick: false,
      },
      props.showInfo
    );
  }) as Vars;
  //--------------------------------------------
  function _init_map() {
    initMap(() => $main.value, props, _dc, _api.value, _map_data.value);
  }
  //--------------------------------------------
  watch(
    () => props.value,
    () => {
      _init_map();
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
        <span>{{ _dc.geo.zoom }}</span>
      </div>
      <!--
        Center
      -->
      <div class="info-ele" v-if="ShowInfo.center && _dc.geo.center">
        <i class="fas fa-arrows-alt"></i>
        <span>{{ _api.GeoPointStr(_dc.geo.center) }}</span>
      </div>
      <!--
        Latitude range
      -->
      <div class="info-ele" v-if="ShowInfo.latRange">
        <i class="fas fa-arrows-alt-v"></i>
        <span>{{ _api.GeoStr(_dc.geo.N) }}</span
        >/<span>{{ _api.GeoStr(_dc.geo.S) }}</span>
      </div>
      <!--
        Longitude range
      -->
      <div class="info-ele" v-if="ShowInfo.lngRange">
        <i class="fas fa-arrows-alt-h"></i>
        <span>{{ _api.GeoStr(_dc.geo.W) }}</span
        >/<span>{{ _api.GeoStr(_dc.geo.E) }}</span>
      </div>
      <!--
        Pointer Hover
      -->
      <div
        v-if="ShowInfo.pointerHover && !_.isEmpty(_dc.pointerHover)"
        class="info-ele">
        <i class="fas fa-map-marker"></i>
        <span
          >{{ _api.GeoStr(_dc.pointerHover.lat) }},
          {{ _api.GeoStr(_dc.pointerHover.lng) }}</span
        >
      </div>
      <!--
        Pointer Click
      -->
      <div
        v-if="ShowInfo.pointerClick && !_.isEmpty(_dc.pointerClick)"
        class="info-ele">
        <i class="fas fa-mouse" @click.left="_dc.pointerClick = undefined"></i>
        <span>{{ _api.GeoPointStr(_dc.pointerClick) }}</span>
      </div>
    </div>
    <!--
    Loading Info
  -->
    <TiLoading v-if="_dc.loading" v-bind="props.loadingRoadblock" />
  </div>
</template>

<style lang="scss" scoped>
  @use "./ti-lbs-map.scss";
</style>
