<script lang="ts" setup>
  import { computed } from 'vue';
  import { TiInput } from '../../';
  import { InputPickerProps } from './ti-input-picker-types';

  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'change', payload: number): void;
  }>();
  //-----------------------------------------------------
  const props = defineProps<InputPickerProps>();
  //-----------------------------------------------------
  const InputProps = computed(() => props);
  //-----------------------------------------------------
</script>
<template>
  <TiInput v-bind="InputProps" />
</template>
