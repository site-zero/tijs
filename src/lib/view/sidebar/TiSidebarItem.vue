<script lang="ts" setup>
  import _ from 'lodash';
  import { computed } from 'vue';
  import { SideBarItem, TiIcon } from '../..';
  import { I18n } from '../../../core';

  type BarItemProps = Omit<SideBarItem, 'key'> & {
    uniqKey: string;
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
</script>
<template>
  <dl
    :depth="props.depth"
    :class="TopClass">
    <dt :class="DTClass">
      <TiIcon
        v-if="props.icon"
        :value="props.icon" />
      <div class="as-title">{{ ItemTitle }}</div>
    </dt>
    <dd v-if="hasChild">
      <div class="bar-items-con">
        <TiSidebarItem
          v-for="child in props.items"
          v-bind="child"
          :uniq-key="child.key" />
      </div>
    </dd>
  </dl>
</template>
<style lang="scss">
  @use '../../../assets/style/_all.scss' as *;

  dl {
    margin: 0;
    &.at-top {
      margin-block-start: SZ(6);
      margin-block-end: 1.2em;
    }
  }

  dt {
    @include flex-align-nowrap;
    padding: var(--ti-measure-box-pad);
    > .ti-icon {
      width: 24px;
      font-size: 16px;
    }
    > .as-title {
      padding: 0 SZ(6);
      font-weight: bold;
    }
    &.at-top {
      border-bottom: 1px solid var(--ti-color-border-shallow);
    }
    &.at-sub > .as-title {
      font-size: 0.8em;
    }
  }

  dd {
    margin-inline-start: SZ(30);
  }
</style>
