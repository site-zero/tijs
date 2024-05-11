<script lang="ts" setup>
  import { computed } from 'vue';
  import { CssUtils, I18n } from '../../../core';
  import { PagerProps } from './ti-pager-types';
  import { usePager } from './use-pager';

  const props = withDefaults(defineProps<PagerProps>(), {
    brief: true,
  });
  const Page = computed(() => usePager(props));
  const TopClass = computed(() =>
    CssUtils.mergeClassName(props.className, `mode-${Page.value.displayMode}`, {
      'is-avaliable': Page.value.avaliable,
      'no-avaliable': !Page.value.avaliable,
    })
  );
  const Icon = {
    head: 'zmdi zmdi-skip-previous',
    prev: 'zmdi zmdi-chevron-left',
    next: 'zmdi zmdi-chevron-right',
    tail: 'zmdi zmdi-skip-next',
  };
  const Text = {
    head: I18n.get('paging-first'),
    prev: I18n.get('paging-prev'),
    next: I18n.get('paging-next'),
    tail: I18n.get('paging-last'),
  };
</script>
<template>
  <div
    class="ti-pager"
    :class="TopClass">
    <!--==========<Jumper>===========-->
    <template v-if="'jumper' == Page.displayMode">
      <div class="part head">
        <a class="b"><i :class="Icon.head"></i> {{ Text.head }}</a>
        <a class="b"><i :class="Icon.prev"></i> {{ Text.prev }}</a>
      </div>
      <div class="part pages">
        <a class="is-current">{{ Page.currentPN }}</a>
      </div>
      <div class="part tail">
        <a class="b">{{ Text.next }} <i :class="Icon.next"></i></a>
        <a class="b">{{ Text.tail }} <i :class="Icon.tail"></i></a>
      </div>
      <div
        class="part brief"
        v-if="Page.briefText">
        <a>{{ Page.briefText }}</a>
      </div>
    </template>
    <!--==========<Dotted>===========-->
    <template v-else-if="'dotted' == Page.displayMode">
      <div class="part pages">
        <a
          v-for="it in Page.PageNumberList"
          class="pn as-dotted"
          :class="it.className"
          ><span>{{ it.value }}</span></a
        >
      </div>
    </template>
    <!--==========<Button>===========-->
    <template v-else>
      <div class="part head">
        <a class="b"><i :class="Icon.head"></i> {{ Text.head }}</a>
        <a class="b"><i :class="Icon.prev"></i> {{ Text.prev }}</a>
      </div>
      <div class="part pages">
        <a
          v-for="it in Page.PageNumberList"
          class="pn as-btn"
          :class="it.className"
          >{{ it.value }}</a
        >
      </div>
      <div class="part tail">
        <a class="b">{{ Text.next }} <i :class="Icon.next"></i></a>
        <a class="b">{{ Text.tail }} <i :class="Icon.tail"></i></a>
      </div>
    </template>
    <!--==========<-End->===========-->
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-pager.scss';
</style>
