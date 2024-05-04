<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { SideBarItem, TiIcon } from '../..';
  import { I18n } from '../../../core';

  let emit = defineEmits<(event: 'click-item', payload: SideBarItem) => void>();

  type BarItemProps = Omit<SideBarItem, 'key'> & {
    uniqKey: string;
    //useCapture: boolean;
    openNewTab: boolean;
  };
  const props = defineProps<BarItemProps>();

  const ItemTitle = computed(() =>
    props.title ? I18n.text(props.title) : null
  );

  const hasChild = computed(() => !_.isEmpty(props.items));

  const TopClass = computed(() => ({
    'has-child': hasChild.value,
    'at-top': 0 == props.depth,
    'at-sub': props.depth > 0,
  }));

  const DTClass = computed(() => ({
    'at-top': 0 == props.depth,
    'at-sub': props.depth > 0,
  }));

  function OnClickItem() {
    let it: SideBarItem = _.assign(
      { key: props.uniqKey },
      _.cloneDeep(_.omit(props, 'uniqKey', 'useCapture', 'openNewTab', 'items'))
    );
    emit('click-item', it);
  }
</script>
<template>
  <dl
    :depth="props.depth"
    class="sidebar-item"
    :class="TopClass">
    <dt :class="DTClass">
      <div
        v-for="_index in props.depth"
        class="as-indent-block"></div>
      <TiIcon
        v-if="props.icon"
        :value="props.icon" />
      <div class="as-title">
        <a
          v-if="href"
          :href="$props.href"
          :target="props.openNewTab ? '_blank' : undefined"
          @click.prevent="OnClickItem"
          >{{ ItemTitle }}</a
        >
        <span
          v-else
          @click="OnClickItem"
          >{{ ItemTitle }}</span
        >
      </div>
    </dt>
    <dd v-if="hasChild">
      <div class="bar-items-con">
        <TiSidebarItem
          v-for="child in props.items"
          v-bind="child"
          :openNewTab="openNewTab"
          :uniq-key="child.key"
          @click-item="emit('click-item', $event)" />
      </div>
    </dd>
  </dl>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './style/sidebar-item.scss';
</style>
