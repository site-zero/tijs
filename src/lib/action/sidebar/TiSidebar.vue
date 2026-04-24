<script lang="ts" setup>
  import { computed } from "vue";
  import TiSidebarItem from "./TiSidebarItem.vue";
  import { useSidebarApi } from "./_support/use-sidebar-item";
  import { SidebarEmitter, SidebarProps } from "./ti-sidebar-types";
  //-------------------------------------------------------
  let emit = defineEmits<SidebarEmitter>();
  //-------------------------------------------------------
  const props = withDefaults(defineProps<SidebarProps>(), {
    useCapture: false,
    openNewTab: false,
  });
  //-------------------------------------------------------
  const api = computed(() => useSidebarApi(props, emit));
  //-------------------------------------------------------
</script>
<template>
  <nav class="ti-sidebar">
    <template v-for="barItem in api.BarItems.value" :key="barItem.id">
      <template v-if="!barItem.hidden">
        <TiSidebarItem
          v-bind="barItem"
          :useCapture="useCapture"
          :openNewTab="openNewTab"
          @click-item="api.onClickItem" />
      </template>
    </template>
  </nav>
</template>
<style lang="scss">
  @use "./ti-sidebar.scss";
</style>
