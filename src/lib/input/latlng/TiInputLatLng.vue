<script lang="ts" setup>
  import { computed } from "vue";
  import { I18n } from "../../../core";
  import { isLatLngObj, isLatLngTuple } from "../../view/all-views";
  import { latlngTupleToObj } from "../../view/lbs-map/gis/use-lbs-support";
  import {
    InputLatLngEmitter,
    InputLatLngProps,
  } from "./ti-input-latlng-types";
  import { useInputLatLngApi } from "./use-input-latlng-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputLatLngEmitter>();
  const props = withDefaults(defineProps<InputLatLngProps>(), {});
  const _api = useInputLatLngApi(props, emit);
  //-----------------------------------------------------
  const LatLng = computed(() => {
    if (isLatLngTuple(props.value)) {
      return {
        ...latlngTupleToObj(props.value),
        valueType: props.valueType || "tuple",
      };
    }
    if (isLatLngObj(props.value)) {
      return {
        ...props.value,
        valueType: props.valueType || "obj",
      };
    }
    return {
      lat: undefined,
      lng: undefined,
      valueType: props.valueType || "obj",
    };
  });
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-input-latlng">
    <TiInput :value="LatLng.lat" />
    <TiInput :value="LatLng.lng" />
    <a>{{ I18n.get("edit") }}</a>
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-latlng.scss";
</style>
