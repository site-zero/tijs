<script setup lang="ts">
  import _ from "lodash";
  import { computed, onMounted } from "vue";
  import { positionToTransName } from "../_vue";
  import { useToastApi } from "./ti-toast-api";
  import { ToastBoxProps } from "./ti-toast-types";
  //-----------------------------------------------------
  const props = withDefaults(defineProps<ToastBoxProps>(), {
    icon: "fas-thumbstack",
    content: "",
    contentType: "text",
    tranSpeed: "normal",
    type: "warn",
    position: "top",
    duration: 3,
  });
  //-----------------------------------------------------
  const api = useToastApi(props);
  //-----------------------------------------------------
  const TransName = computed(() => {
    let pos = props.position || "center";
    return positionToTransName(pos);
  });
  //-----------------------------------------------------
  onMounted(() => {
    // 延缓设置以便有一个增长动画
    _.delay(() => {
      api.markReady();
      api.deferCloseToast();
    }, 1);
  });
  //-----------------------------------------------------
</script>
<template>
  <Transition :name="TransName" appear>
    <div class="ti-toast ti-trans" v-if="!api.isDead.value">
      <div
        class="trans-box"
        :class="api.TopClass.value"
        :style="api.TopStyle.value">
        <a class="box-icon as-pin" @click.left="api.togglePined()">
          <i class="fa-solid fa-thumbtack"></i>
        </a>
        <component
          :is="api.ToastCom.value.rawCom"
          v-bind="api.ToastCom.value.comConf" />
        <a @click.left="api.closeToast(true)" class="box-icon as-close">
          <i class="zmdi zmdi-close"></i>
        </a>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss">
  @use "./ti-toast.scss";
</style>
