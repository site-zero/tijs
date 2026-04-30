<script lang="ts" setup>
  import _ from "lodash";
  import { computed, useTemplateRef } from "vue";
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
  const $el = useTemplateRef<HTMLElement>("el");
  const $lng = useTemplateRef<HTMLElement>("lng");
  const $lat = useTemplateRef<HTMLElement>("lat");
  //-----------------------------------------------------
  const emit = defineEmits<InputLngLatEmitter>();
  const props = withDefaults(defineProps<InputLngLatProps>(), {
    canInput: false,
  });
  const _api = useInputLatLngApi(props, {
    emit,
    getElement: () => $el.value,
    getLngElement: () => $lng.value?.parentElement || null,
    getLatElement: () => $lat.value?.parentElement || null,
  });
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
          icon: "fas-map-location-dot",
          className: "is-primary",
          tip: "i18n:ti-input-lng-lat-edit",
          action: () => {
            _api.doEditPoint();
          },
          items: [
            {
              icon: "far-copy",
              text: "i18n:copy",
              tip: "i18n:ti-input-lng-lat-copy",
              action: () => {
                _api.doCopyValue();
              },
            },
            {},
            {
              icon: "fas-map-location-dot",
              text: "i18n:edit",
              tip: "i18n:ti-input-lng-lat-edit",
              disabled: props.readonly,
              action: () => {
                _api.doEditPoint();
              },
            },
            {},
            {
              icon: "fas-trash-alt",
              text: "i18n:clear",
              disabled: props.readonly,
              tip: "i18n:ti-input-lng-lat-clear",
              action: () => {
                _api.doClearValue();
              },
            },
          ],
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
  <div class="ti-input-lnglat" ref="el">
    <TiInput
      v-bind="InputBoxConfig"
      :value="LatLng.lng"
      @change="_api.onUpdate('lng', $event)">
      <template v-slot:head>
        <div class="main-head" ref="lng">
          <span>{{ I18n.get("ti-input-lng-lat-k-lng") }}:</span>
          <div
            class="copy-icon"
            data-tip="i18n:ti-input-lng-lat-copy-lng"
            @click="_api.doCopyValue('lng')">
            <i class="far fa-copy"></i>
          </div>
        </div>
      </template>
    </TiInput>
    <TiInput
      v-bind="InputBoxConfig"
      :value="LatLng.lat"
      @change="_api.onUpdate('lat', $event)">
      <template v-slot:head>
        <div class="main-head" ref="lat">
          <span>{{ I18n.get("ti-input-lng-lat-k-lat") }}:</span>
          <div
            class="copy-icon"
            data-tip="i18n:ti-input-lng-lat-copy-lat"
            @click="_api.doCopyValue('lat')">
            <i class="far fa-copy"></i>
          </div>
        </div>
      </template>
    </TiInput>
    <TiActionBar v-bind="ActionBarConfig" />
  </div>
</template>
<style lang="scss" scoped>
  @use "./ti-input-lnglat.scss";
</style>
