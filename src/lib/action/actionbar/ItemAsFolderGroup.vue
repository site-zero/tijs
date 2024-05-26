<script lang="ts" setup>
  import _ from 'lodash';
  import { computed, inject, ref, watch } from 'vue';
  import { DockMode, Dom, Point2D } from '../../../core';
  import BarItemTmpl from './BarItemTmpl.vue';
  import ItemAsAction from './ItemAsAction.vue';
  import { ABAR_STATE, ABarUsedItem } from './ti-action-bar-types';
  import { openBarItem } from './use-action-bar';
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  const state = inject(ABAR_STATE);
  //-------------------------------------------------------
  const props = defineProps<ABarUsedItem>();
  //-------------------------------------------------------
  const OpenStatus = computed(() => {
    if (state) {
      return state.opened.get(props.uniqKey);
    }
  });
  //-------------------------------------------------------
  const isOpened = computed(() => 'opened' == OpenStatus.value);
  const isReady = computed(() => 'ready' == OpenStatus.value);
  //-------------------------------------------------------
  const ConClass = computed(() => {
    return {
      'is-opened': isOpened.value,
      'is-ready': isReady.value,
    };
  });
  //-------------------------------------------------------
  function OnClickHead() {
    let st = OpenStatus.value ?? 'closed';
    console.log('OnClickHead', st);
    if (state && /^(closed)$/.test(st)) {
      openBarItem(state, props);
    }
  }
  //-------------------------------------------------------
  const $con = ref<HTMLElement>();
  const MENU_SPACE = 8;
  //-------------------------------------------------------
  watch(
    () => $con.value,
    () => {
      if (!$con.value) {
        return;
      }
      console.log('Show!!!', $con.value);
      let mode: DockMode = props.depth > 0 ? 'V' : 'H';
      let space: Point2D =
        'H' == mode ? { x: 0, y: MENU_SPACE } : { x: MENU_SPACE, y: 0 };
      let $menu = $con.value;
      let $info = $menu.previousElementSibling as HTMLElement;
      if (!$info) {
        return;
      }
      Dom.dockTo($menu, $info, {
        mode,
        space,
        position: 'fixed',
      });
      _.delay(() => {
        state?.opened.set(props.uniqKey, 'ready');
      }, 0);
    }
  );
  //-------------------------------------------------------
</script>
<template>
  <!-- 显示自己-->
  <BarItemTmpl
    v-bind="props"
    @click="OnClickHead">
    <template v-slot:suffix>
      <div
        v-if="props.depth > 0"
        class="item-suffix as-icon">
        <i class="zmdi zmdi-chevron-right"></i>
      </div>
    </template>
    <!--++++++: Children :+++++++-->
    <div
      v-if="isOpened || isReady"
      class="bar-item-con"
      :class="ConClass"
      ref="$con">
      <template
        v-for="it in props.items"
        :key="it.uniqKey">
        <template v-if="!it.hidden">
          <!--......|< Action >|......-->
          <ItemAsAction
            v-if="'action' == it.type"
            v-bind="it" />
          <!--......|< Group >|......-->
          <ItemAsFolderGroup
            v-else-if="'group' == it.type"
            v-bind="it" />
          <!--......|< Sep >|......-->
          <div
            v-else-if="'sep' == it.type"
            class="bar-sep"
            :aspect="it.aspect"
            :item-depth="it.depth"
            :item-index="it.index"></div>
          <!--......|< Unknown >|......-->
          <div
            v-else
            class="bar-unknwon"
            :aspect="it.aspect"
            :item-depth="it.depth"
            :item-index="it.index">
            {{ it }}
          </div>
        </template>
      </template>
    </div>
  </BarItemTmpl>
</template>
