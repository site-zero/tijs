<script lang="ts" setup>
  import _ from 'lodash';
  import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    useTemplateRef,
    watch,
  } from 'vue';
  import { TiActionBar, TiLabel, usePlaceholder } from '../../';
  import { Vars } from '../../../_type';
  import { CssUtils, I18n } from '../../../core';
  import { TagItem, TagsProps } from './ti-tags-types';
  import { useTags } from './use-tags';
  import { useTagsSortable } from './use-tags-sortable';
  //-----------------------------------------------------
  const $el = useTemplateRef<HTMLElement>('el');
  //-----------------------------------------------------
  const emit = defineEmits<{
    // 对于 TagItem[] 型的 value
    (event: 'click-tag', payload: TagItem): void;
    // 对于 TagItem[] 型的 value
    (event: 'remove', payload: TagItem): void;
    // 对于 Vars 型的 value
    (event: 'change', payload: Vars): void;
  }>();
  //-----------------------------------------------------
  const props = withDefaults(defineProps<TagsProps>(), {
    placeholder: 'i18n:nil-content',
    autoI18n: true,
    valueIsMatcher: undefined,
  });
  //-----------------------------------------------------
  const _sorting = computed(() =>
    useTagsSortable({
      getView: () => $el.value,
      enabled: props.editable,
    })
  );
  //-----------------------------------------------------
  const tagItems = ref<TagItem[]>([]);
  //-----------------------------------------------------
  const _tags = computed(() => useTags(props, tagItems));
  const _placeholder = computed(() => usePlaceholder(props));
  //-----------------------------------------------------
  const hasTagItems = computed(() => tagItems.value.length > 0);
  //-----------------------------------------------------
  const TopClass = computed(() =>
    CssUtils.mergeClassName({
      'is-readonly': !props.editable,
      'is-editable': props.editable,
    })
  );
  //-----------------------------------------------------
  function onClickItem(it: TagItem) {
    if (props.tagClickable) {
      emit('click-tag', it);
    }
  }
  //-----------------------------------------------------
  function onRemoveItem(it: TagItem) {
    console.log('onRemoveItem', it);
    if (props.editable) {
      // 对于 TagItem[] 型的 value
      if (_.isArray(props.value)) {
        emit('remove', it);
      }
      // 对于 Vars 型的 value
      else if (props.value && it.name) {
        let val = _.cloneDeep(props.value);
        let v2 = _.omit(val, it.name);
        if (!_.isEqual(v2, props.value)) {
          emit('change', v2);
        }
      }
    }
  }
  //-----------------------------------------------------
  watch(
    () => [
      props.value,
      props.valueIsMatcher,
      props.valueTranslators,
      props.nameTranslator,
    ],
    async () => {
      //console.log('Tags change');
      await _tags.value.loadTagItems();
    },
    { immediate: true }
  );
  //-----------------------------------------------------
  watch(
    () => props.editable,
    () => {
      if (props.editable) {
        _sorting.value.startWatching();
      } else {
        _sorting.value.clearWatching();
      }
    }
  );
  //-----------------------------------------------------
  onMounted(() => {
    _sorting.value.startWatching();
  });
  //-----------------------------------------------------
  onUnmounted(() => {
    _sorting.value.clearWatching();
  });
  //-----------------------------------------------------
</script>
<template>
  <div
    class="ti-tags"
    :class="TopClass"
    :nowrap="props.nowrap || undefined"
    ref="el">
    <div
      class="as-title"
      v-if="props.title">
      {{ I18n.text(props.title) }}
    </div>
    <template v-if="hasTagItems">
      <!--======<Tab Labels>======-->
      <TiLabel
        v-for="it in tagItems"
        class="show-border as-tag-item"
        :style="props.defaultTagStyle"
        :type="it.type"
        :clickable="props.tagClickable"
        :className="it.className"
        :prefixIcon="it.icon"
        :suffixIcon="props.editable ? 'zmdi-close' : undefined"
        :suffixIconFor="props.editable ? 'click' : undefined"
        suffixIconClass="hover-rotate"
        :value="it.text"
        @click-suffix-icon="onRemoveItem(it)"
        @click-prefix-icon="onClickItem(it)"
        @click="onClickItem(it)" />
    </template>
    <span
      v-else
      class="as-empty"
      >{{ _placeholder }}</span
    >
    <!--======<Tab Actions>======-->
    <template v-if="props.actions">
      <TiActionBar v-bind="props.actions" />
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-tags.scss';
</style>
