<script lang="ts" setup>
  import { computed } from 'vue';
  import { CssUtils, I18n } from '../../../core';
  import { PagerEmitter, PagerProps } from './ti-pager-types';
  import { usePager } from './use-pager';

  const emit = defineEmits<PagerEmitter>();

  const props = withDefaults(defineProps<PagerProps>(), {
    brief: true,
    showText: true,
    canAskPageSize: true,
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
  const Text = computed(() => {
    if (props.showText) {
      return {
        head: I18n.get('paging-first'),
        prev: I18n.get('paging-prev'),
        next: I18n.get('paging-next'),
        tail: I18n.get('paging-last'),
      };
    }
    return {};
  });
</script>
<template>
  <div
    class="ti-pager"
    :class="TopClass">
    <!--==========<Jumper>===========-->
    <template v-if="'jumper' == Page.displayMode">
      <template v-if="!Page.avaliable">
        <div class="part head">
          <b><i :class="Icon.head"></i> {{ Text.head }}</b>
          <b><i :class="Icon.prev"></i> {{ Text.prev }}</b>
        </div>
        <div class="part pages">
          <span class="is-current">0</span>
        </div>
        <div class="part tail">
          <b>{{ Text.next }} <i :class="Icon.next"></i></b>
          <b>{{ Text.tail }} <i :class="Icon.tail"></i></b>
        </div>
      </template>
      <template v-else>
        <div
          class="part head"
          :class="Page.headPartClass">
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
            class="is-current"
            @click="Page.askPageNumber"
            >{{ Page.currentPN }}</a
          >
        </div>
        <div
          class="part tail"
          :class="Page.tailPartClass">
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
          v-if="Page.briefText"
          class="part brief"
          @click="Page.askPageSize">
          <a>{{ Page.briefText }}</a>
        </div>
        <div
          v-else-if="props.canAskPageSize"
          class="part ask-page-size"
          title="Change Page Size">
          <a @click="Page.askPageSize"><i class="zmdi zmdi-settings"></i></a>
        </div>
      </template>
    </template>
    <!--==========<Dotted>===========-->
    <template v-else-if="'dotted' == Page.displayMode">
      <div
        class="part pages"
        v-if="!Page.avaliable">
        <a class="pn as-dotted"></a>
        <a class="pn as-dotted"></a>
        <a class="pn as-dotted"></a>
      </div>
      <div
        class="part pages"
        v-else>
        <a
          v-if="Page.notStartFromHead"
          @click="Page.askPageNumber"
          >...</a
        >
        <a
          v-for="it in Page.PageNumberList"
          class="pn as-dotted"
          :class="it.className"
          @click="Page.gotoPage(it.value)"
          ><span>{{ it.value }}</span></a
        >
        <a
          v-if="Page.notStopAtTail"
          @click="Page.askPageNumber"
          >...</a
        >
      </div>
    </template>
    <!--==========<Button>===========-->
    <template v-else>
      <template v-if="!Page.avaliable">
        <div class="part head">
          <b><i :class="Icon.head"></i> {{ Text.head }}</b>
          <b><i :class="Icon.prev"></i> {{ Text.prev }}</b>
        </div>
        <div class="part pages">
          <span class="pn as-btn">...</span>
        </div>
        <div class="part tail">
          <b>{{ Text.next }} <i :class="Icon.next"></i></b>
          <b>{{ Text.tail }} <i :class="Icon.tail"></i></b>
        </div>
      </template>
      <template v-else>
        <div
          class="part head"
          :class="Page.headPartClass">
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
            v-if="Page.notStartFromHead"
            @click="Page.askPageNumber"
            >...</a
          >
          <a
            v-for="it in Page.PageNumberList"
            class="pn as-btn"
            :class="it.className"
            @click="Page.gotoPage(it.value)"
            >{{ it.value }}</a
          >
          <a
            v-if="Page.notStopAtTail"
            @click="Page.askPageNumber"
            >...</a
          >
        </div>
        <div
          class="part tail"
          :class="Page.tailPartClass">
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
    </template>
    <!--==========<-End->===========-->
  </div>
</template>
<style lang="scss" scoped>
  @use './ti-pager.scss';
</style>
