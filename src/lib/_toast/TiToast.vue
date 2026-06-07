<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { ToastProps } from "./ti-toast-types";
  import { positionToTransName } from "../_vue";
  import { useToastApi } from "./ti-toast-api";
  import { CssUtils } from "../../core";
  import _ from "lodash";
  //-----------------------------------------------------
  const props = withDefaults(
    defineProps<
      ToastProps & {
        releaseDom: () => void;
      }
    >(),
    {
      content: "",
      contentType: "text",
      tranSpeed: "normal",
      type: "primary",
      position: "top",
      duration: 200000,
    }
  );
  //-----------------------------------------------------
  const api = useToastApi(props);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      `origin-${props.position}`,
      `is-${props.type}`
    )
  );
  const TopStyle = computed(() => CssUtils.toStyle(props.style));
  //-----------------------------------------------------
  const TransName = computed(() => {
    let pos = props.position || "center";
    return positionToTransName(pos);
  });
  //-----------------------------------------------------
  onMounted(() => {
    _.delay(() => {
      props.releaseDom();
    }, props.duration || 3000);
  });
  //-----------------------------------------------------
</script>
<template>
  <Transition :name="TransName" appear>
    <div class="ti-toast" :class="TopClass" :style="TopStyle">
      <component
        :is="api.ToastCom.value.rawCom"
        v-bind="api.ToastCom.value.comConf" />
    </div>
  </Transition>
</template>
<style lang="scss">
  @use "./ti-toast.scss";
</style>
