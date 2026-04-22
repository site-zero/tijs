<script lang="ts" setup>
  import { I18n, TiIcon } from "@site0/tijs";
  import _ from "lodash";
  import { computed } from "vue";
  import { SidebarItemEmitter, SidebarItemProps } from "./ti-sidebar-types";
  //-------------------------------------------------------
  let emit = defineEmits<SidebarItemEmitter>();
  //-------------------------------------------------------
  const props = defineProps<SidebarItemProps>();
  //-------------------------------------------------------
  const ItemTitle = computed(() =>
    props.title ? I18n.text(props.title) : null
  );
  //-------------------------------------------------------
  const hasChild = computed(() => !_.isEmpty(props.items));
  //-------------------------------------------------------
  const TopClass = computed(() => ({
    "has-child": hasChild.value,
    "at-top": 0 == props.depth,
    "at-sub": props.depth > 0,
    "is-current": props.current,
    "is-enabled": !props.disabled,
    "is-disabled": props.disabled,
  }));
  //-------------------------------------------------------
  const DTClass = computed(() => ({
    "at-top": 0 == props.depth,
    "at-sub": props.depth > 0,
  }));
  //-------------------------------------------------------
</script>
<template>
  <dl :depth="props.depth" class="sidebar-item" :class="TopClass">
    <dt :class="DTClass" @click="emit('click-item', props)">
      <div v-for="_index in props.depth" class="as-indent-block"></div>
      <TiIcon v-if="props.icon" :value="props.icon" />
      <div class="as-title">
        <a
          v-if="href"
          :href="$props.href"
          :target="props.openNewTab ? '_blank' : undefined"
          @click.prevent
          >{{ ItemTitle }}</a
        >
        <span v-else>{{ ItemTitle }}</span>
      </div>
    </dt>
    <dd v-if="hasChild">
      <div class="bar-items-con">
        <template v-for="barItem in props.items" :key="barItem.id">
          <template v-if="!barItem.hidden">
            <TiSidebarItem
              v-bind="barItem"
              :useCapture="useCapture"
              :openNewTab="openNewTab"
              @click-item="emit('click-item', $event)" />
          </template>
        </template>
      </div>
    </dd>
  </dl>
</template>
<style lang="scss">
  @use "./style/sidebar-item.scss";
</style>
