<script setup lang="ts">
  import { computed } from 'vue';

  const props = defineProps<{
    content: string;
  }>();

  const snippetInnerHtml = computed(() => {
    return props.content || '<strong>HTML <em>snippet</em></strong>';
  });
</script>
<template>
  <div
    class="ti-html-snippet"
    v-html="snippetInnerHtml"></div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './msg-box.scss';
</style>
