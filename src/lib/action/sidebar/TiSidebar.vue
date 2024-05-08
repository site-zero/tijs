<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { SideBarItem } from '../..';
  import TiSidebarItem from './TiSidebarItem.vue';

  let emit = defineEmits<(event: 'fire', payload: SideBarItem) => void>();

  const props = withDefaults(
    defineProps<{
      items: SideBarItem[];
      isCurrent?: (item: SideBarItem) => boolean;
      useCapture?: boolean;
      openNewTab?: boolean;
    }>(),
    {
      useCapture: false,
      openNewTab: false,
    }
  );

  function tidyBarItem(
    it: SideBarItem,
    { index = 0, depth = 0 } = {}
  ): SideBarItem {
    it.depth = depth;
    it.key = it.key ?? `D${depth}-I${index}`;
    it.id = it.id ?? it.key;
    if (_.isFunction(props.isCurrent)) {
      it.current = props.isCurrent(it);
    }
    if (it.items) {
      let list = [] as SideBarItem[];
      for (let i = 0; i < it.items.length; i++) {
        let child = tidyBarItem(it.items[i], { index: i, depth: depth + 1 });
        list.push(child);
      }
      it.items = list;
    }
    return it;
  }

  const BarItems = computed(() => {
    let items = _.cloneDeep(props.items);
    for (let i = 0; i < items.length; i++) {
      let it = items[i];
      tidyBarItem(it, { index: i });
    }
    return items;
  });

  function OnClickItem(it: SideBarItem) {
    emit('fire', it);
  }
</script>
<template>
  <nav class="ti-sidebar">
    <TiSidebarItem
      v-for="child in BarItems"
      v-bind="child"
      :useCapture="useCapture"
      :openNewTab="openNewTab"
      :uniq-key="child.key"
      @click-item="OnClickItem" />
  </nav>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;

  nav {
    user-select: none;
    padding: SZ(1);
    width: 100%;
    height: 100%;
    overflow: auto;
  }
</style>
