<script lang="ts" setup>
  import { inject } from "vue";
  import BarItemChildren from "./BarItemChildren.vue";
  import BarItemTmpl from "./BarItemTmpl.vue";
  import { BAR_SUPPORT, BarItemProp } from "./action-bar-type";
  defineOptions({
    inheritAttrs: false
  });
  const { setBarOpenState, MENU_SPACE } = inject(BAR_SUPPORT)!;
  //
  // Props
  //
  let props = defineProps<BarItemProp>();
  //
  // Methods
  //
  function OnClickHead() {
    if (!props.opened) {
      setBarOpenState(props.uniqKey, "open");
    }
  }
</script>
<template>
  <BarItemTmpl v-bind="props" @click="OnClickHead">
    <BarItemChildren
      v-bind="props"
      :setBarOpenState="setBarOpenState"
      :space="MENU_SPACE" />
    <template v-slot:suffix>
      <div v-if="depth > 0" class="item-suffix as-icon">
        <i class="zmdi zmdi-chevron-right"></i>
      </div>
    </template>
  </BarItemTmpl>
</template>
