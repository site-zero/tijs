<script lang="ts" setup>
  import _ from "lodash";
  import { computed } from "vue";
  import { ActionBarProps, InputBoxProps, TiActionBar, TiInput } from "../../";
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
  const props = withDefaults(defineProps<InputLatLngProps>(), {
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
      items: [
        {
          icon: "zmdi-pin",
          tip: "i18n:ti-input-lat-lng-edit",
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
    <div class="prefix-actions" v-if="!props.readonly">
      <a data-tip="i18n:ti-input-lat-lng-clear" @click.left.stop="_api.doClearValue()">
        <i class="fa-solid fa-map-location-dot"></i>
        <i class="zmdi zmdi-close"></i>
      </a>
    </div>
    <TiInput v-bind="InputBoxConfig" :value="LatLng.lat">
      <template v-slot:head
        ><div class="main-head">
          {{ I18n.get("ti-input-lat-lng-k-lat") }}:
        </div></template
      >
    </TiInput>
    <TiInput v-bind="InputBoxConfig" :value="LatLng.lng">
      <template v-slot:head
        ><div class="main-head">
          {{ I18n.get("ti-input-lat-lng-k-lng") }}:
        </div></template
      >
    </TiInput>
    <TiActionBar v-bind="ActionBarConfig" />
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-latlng.scss";
</style>
