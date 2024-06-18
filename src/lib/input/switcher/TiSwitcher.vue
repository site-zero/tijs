<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { SwitcherProps } from './ti-switcher-types';
  import { useSwitcher } from './use-switcher';
  import { TiIcon } from '../../';
  //-----------------------------------------------------
  const props = defineProps<SwitcherProps>();
  //-----------------------------------------------------
  const Swt = computed(() => useSwitcher(props));
  //-----------------------------------------------------
  watch(
    () => props.options,
    () => {
      Swt.value.loadOptions();
    },
    {
      immediate: true,
    }
  );
  //-----------------------------------------------------
</script>
<template>
  <div class="ti-switcher">
    <div
      v-for="it in Swt.options.value"
      class="sw-item">
      <div
        class="it-icon"
        v-if="it.icon">
        <TiIcon :value="it.icon" />
      </div>
      <div
        class="it-icon"
        v-if="it.text">
        {{ it.text }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-switcher.scss';
</style>
