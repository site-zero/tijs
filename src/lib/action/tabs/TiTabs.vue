<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { CommonProps, TabDisplayItem, TabsProps, TiIcon } from '../../';
  import { CssUtils, I18n } from '../../../core';

  const props = withDefaults(defineProps<CommonProps & TabsProps>(), {
    wrapTabs: false,
    tabItemSpace: 'm',
    tabsAt: 'top',
    tabsAlign: 'center',
  });

  const TabItems = computed(() => {
    let items = [] as TabDisplayItem[];
    _.forEach(props.options, (it, index) => {
      let item = {
        className: {},
        current: false,
        index,
        icon: it.icon,
        value: it.value ?? index,
      } as TabDisplayItem;

      if (it.text) {
        item.text = I18n.text(it.text);
      }

      if (_.isEqual(item.value, props.value)) {
        item.current = true;
        item.className['is-current'] = true;
      }

      items.push(item);
    });
    return items;
  });

  const TopClass = computed(() =>
    CssUtils.mergeClassName(
      props.className,
      {
        'wrap-tabs': props.wrapTabs,
      },
      `tabs-at-${props.tabsAt}`,
      `tabs-align-${props.tabsAlign}`,
      `tab-item-space-${props.tabItemSpace}`
    )
  );

  const emit = defineEmits<{
    (eventName: 'change', current: TabDisplayItem, old?: TabDisplayItem): void;
  }>();
  function onClickItem(it: TabDisplayItem) {
    let old = _.cloneDeep(_.find(TabItems.value, (it) => it.current));
    let current = _.cloneDeep(it);
    emit('change', current, old);
  }
</script>
<template>
  <div
    class="ti-tabs"
    :class="TopClass">
    <ul>
      <li
        v-for="it in TabItems"
        :class="it.className"
        @click="onClickItem(it)">
        <span
          class="as-icon"
          v-if="it.icon"
          ><TiIcon :value="it.icon"
        /></span>
        <span
          class="as-text"
          v-if="it.text"
          >{{ it.text }}</span
        >
      </li>
    </ul>
  </div>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-tabs.scss';
</style>
