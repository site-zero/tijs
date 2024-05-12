<script lang="ts" setup>
  import { computed } from 'vue';
  import { CssUtils, I18n } from '../../../core';
  import { PagerEmitter, PagerProps } from './ti-pager-types';
  import { usePager } from './use-pager';

  const emit = defineEmits<PagerEmitter>();

  const props = withDefaults(defineProps<PagerProps>(), {
    brief: true,
  });
  const Page = computed(() => usePager(props, { emit }));
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
    <!--==========<Not Avliable>===========-->
    <template v-if="!Page.avaliable">
      <i class="fa-solid fa-pager"></i>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </template>
    <!--==========<Jumper>===========-->
    <template v-else-if="'jumper' == Page.displayMode">
      <div class="part head">
        <a
          class="b"
          @click="Page.gotoPage(1)"
          ><i :class="Icon.head"></i> {{ Text.head }}</a
        >
        <a
          class="b"
          @click="Page.jumpPage(-1)"
          ><i :class="Icon.prev"></i> {{ Text.prev }}</a
        >
      </div>
      <div class="part pages">
        <a class="is-current">{{ Page.currentPN }}</a>
      </div>
      <div class="part tail">
        <a
          class="b"
          @click="Page.jumpPage(1)"
          >{{ Text.next }} <i :class="Icon.next"></i
        ></a>
        <a
          class="b"
          @click="Page.gotoPage(Page.lastPN)"
          >{{ Text.tail }} <i :class="Icon.tail"></i
        ></a>
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
        <a
          class="b"
          @click="Page.gotoPage(1)"
          ><i :class="Icon.head"></i> {{ Text.head }}</a
        >
        <a
          class="b"
          @click="Page.jumpPage(-1)"
          ><i :class="Icon.prev"></i> {{ Text.prev }}</a
        >
      </div>
      <div class="part pages">
        <a
          v-for="it in Page.PageNumberList"
          class="pn as-btn"
          :class="it.className"
          @click="Page.gotoPage(it.value)"
          >{{ it.value }}</a
        >
      </div>
      <div class="part tail">
        <a
          class="b"
          @click="Page.jumpPage(1)"
          >{{ Text.next }} <i :class="Icon.next"></i
        ></a>
        <a
          class="b"
          @click="Page.gotoPage(Page.lastPN)"
          >{{ Text.tail }} <i :class="Icon.tail"></i
        ></a>
      </div>
    </template>
    <!--==========<-End->===========-->
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-pager.scss';
</style>
