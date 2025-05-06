<script setup lang="ts">
  import _ from 'lodash';
  import { computed, reactive } from 'vue';
  import { TiLoading } from '../../';
  import { CssUtils, LBSMapDrawContext, Vars } from '../../../';
  import { LbsMapEmitter, LbsMapProps } from './ti-lbs-map-types';
  import { useLbsMap } from './use-lbs-map';
  //--------------------------------------------
  const emit = defineEmits<LbsMapEmitter>();
  //--------------------------------------------
  const props = withDefaults(defineProps<LbsMapProps>(), {});
  //--------------------------------------------
  const _dc = reactive({
    $map: undefined,
    $live: undefined,

    pointerClick: undefined,
    pointerHover: undefined,

    geo: {},

    lastMove: 0,
    loading: false,
  } as LBSMapDrawContext);
  //--------------------------------------------
  const _api = useLbsMap(props, _dc);
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
</script>

<template>
  <div
    class="web-gsi-leaflet ti-fill-parent"
    :class="TopClass"
    :style="TopStyle">
    <!--
    Main for the map
  -->
    <div
      class="wgl-map-main ti-fill-parent"
      ref="main"></div>
    <!--
    Tip Info
  -->
    <div
      v-if="isShowInfo"
      class="wgl-map-info">
      <!--
        Zoom
      -->
      <div
        class="info-ele"
        v-if="ShowInfo.zoom">
        <i class="fas fa-search-location"></i>
        <span>{{ _dc.geo.zoom }}</span>
      </div>
      <!--
        Center
      -->
      <div
        class="info-ele"
        v-if="ShowInfo.center && _dc.geo.center">
        <i class="fas fa-arrows-alt"></i>
        <span>{{ _api.GeoPointStr(_dc.geo.center) }}</span>
      </div>
      <!--
        Latitude range
      -->
      <div
        class="info-ele"
        v-if="ShowInfo.latRange">
        <i class="fas fa-arrows-alt-v"></i>
        <span>{{ _api.GeoStr(_dc.geo.N) }}</span
        >/<span>{{ _api.GeoStr(_dc.geo.S) }}</span>
      </div>
      <!--
        Longitude range
      -->
      <div
        class="info-ele"
        v-if="ShowInfo.lngRange">
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
        <i
          class="fas fa-mouse"
          @click.left="_dc.pointerClick = undefined"></i>
        <span>{{ _api.GeoPointStr(_dc.pointerClick) }}</span>
      </div>
    </div>
    <!--
    Loading Info
  -->
    <TiLoading
      v-if="_dc.loading"
      v-bind="props.loadingRoadblock" />
  </div>
</template>

<style lang="scss" scoped></style>
