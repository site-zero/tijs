<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { TiLabel, usePlaceholder } from '../../';
  import { TagItem, TagsProps } from './ti-tags-types';
  import { useTags } from './use-tags';
  //-----------------------------------------------------
  const emit = defineEmits<{
    (event: 'remove', payload: TagItem): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TagsProps>(), {
    defaultTagType: 'text',
    placeholder: 'i18n:nil-content',
    autoI18n: true,
    valueIsMatcher: undefined
  });
  //-----------------------------------------------------
  const tagItems = ref<TagItem[]>([]);
  //-----------------------------------------------------
  const Tags = computed(() => useTags(props, tagItems));
  const Placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const hasTagItems = computed(() => tagItems.value.length > 0);
  //-----------------------------------------------------
  watch(
    () => [
      props.value,
      props.valueIsMatcher,
      props.valueTranslators,
      props.nameTranslator,
    ],
    () => {
      console.log('Tags change');
      Tags.value.loadTagItems();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-tags"
    :nowrap="props.nowrap || undefined">
    <template v-if="hasTagItems">
      <TiLabel
        v-for="it in tagItems"
        class="show-border"
        :type="it.type"
        :className="it.className"
        :prefixIcon="it.icon"
        :suffixIcon="props.editable ? 'zmdi-close' : undefined"
        :suffixIconClickable="true"
        suffixIconClass="hover-rotate"
        :value="it.text"
        @click-suffix-icon="emit('remove', it)" />
    </template>
    <span
      v-else
      class="as-empty"
      >{{ Placeholder }}</span
    >
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-tags.scss';
</style>
