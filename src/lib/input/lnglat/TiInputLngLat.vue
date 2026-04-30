<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import { ActionBarProps, InputBoxProps, TiActionBar, TiInput } from "../../";
  import { I18n } from "../../../core";
  import { isLngLatObj, isLngLatTuple } from "../../view/all-views";
  import { lnglatTupleToObj } from "../../view/lbs-map/gis/use-lbs-support";
  import {
    InputLngLatEmitter,
    InputLngLatProps,
  } from "./ti-input-lnglat-types";
  import { useInputLatLngApi } from "./use-input-lnglat-api";
  //-----------------------------------------------------
  const emit = defineEmits<InputLngLatEmitter>();
  const props = withDefaults(defineProps<InputLngLatProps>(), {
    canInput: false,
  });
  const _api = useInputLatLngApi(props, emit);
  //-----------------------------------------------------
  const InputBoxConfig = computed(() => {
    return _.assign(
      {
        boxFontSize: "s",
        boxPadding: "m",
        boxRadius: "s",
      },
      props.boxAspect,
      {
        readonly: props.readonly || !props.canInput,
        canInput: props.canInput && !props.readonly,
      }
    ) as InputBoxProps;
  });
  //-----------------------------------------------------
  const ActionBarConfig = computed(() => {
    return {
      style: {
        height: "2.4em",
        padding: 0,
        marginLeft: "0.3em",
      },
      topItemAspectMode: "button",
      topItemMinWidth: "auto",
      items: [
        {
          icon: "zmdi-pin",
          tip: "i18n:ti-input-lng-lat-edit",
          className: "is-primary-r",
          action: () => {
            _api.doEditPoint();
          },
        },
      ],
    } as ActionBarProps;
  });
  //-----------------------------------------------------
  const LatLng = computed(() => {
    if (isLngLatTuple(props.value)) {
      return {
        ...lnglatTupleToObj(props.value),
        valueType: props.valueType || "tuple",
      };
    }
    if (isLngLatObj(props.value)) {
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
  <div class="ti-input-lnglat">
    <div class="prefix-actions" v-if="!props.readonly">
      <a
        data-tip="i18n:ti-input-lng-lat-clear"
        @click.left.stop="_api.doClearValue()">
        <i class="fa-solid fa-map-location-dot"></i>
        <i class="zmdi zmdi-close"></i>
      </a>
    </div>
    <TiInput
      v-bind="InputBoxConfig"
      :value="LatLng.lng"
      @change="_api.onUpdate('lng', $event)">
      <template v-slot:head
        ><div class="main-head">
          {{ I18n.get("ti-input-lng-lat-k-lng") }}:
        </div></template
      >
    </TiInput>
    <TiInput
      v-bind="InputBoxConfig"
      :value="LatLng.lat"
      @change="_api.onUpdate('lat', $event)">
      <template v-slot:head
        ><div class="main-head">
          {{ I18n.get("ti-input-lng-lat-k-lat") }}:
        </div></template
      >
    </TiInput>
    <TiActionBar v-bind="ActionBarConfig" />
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-lnglat.scss";
</style>
