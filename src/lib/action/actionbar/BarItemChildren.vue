<script lang="ts" setup>
  import { DockMode, Dom, Point2D } from "../../../core/ti.ts";
  import _ from "lodash";
  import { inject, onMounted, onUnmounted, ref } from "vue";
  import ItemAsAction from "./ItemAsAction.vue";
  import ItemAsFolderGroup from "./ItemAsFolderGroup.vue";
  import ItemAsInlineGroup from "./ItemAsInlineGroup.vue";
  import ItemAsStatus from "./ItemAsStatus.vue";
  import { BAR_SUPPORT, BarItemProp } from "./action-bar-type";

  /*-------------------------------------------------------

                     Com Options

-------------------------------------------------------*/
  defineOptions({
    inheritAttrs: false
  });
  let { MENU_SPACE, setBarOpenState } = inject(BAR_SUPPORT)!;
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  let props = defineProps<BarItemProp>();
  /*-------------------------------------------------------

                       Observer

      监控子菜单的属性变化，如果打开了话，就尝试停靠

-------------------------------------------------------*/
  const $con = ref<HTMLElement>();
  const ob = new MutationObserver((mutList, _ob) => {
    for (let mut of mutList) {
      let $menu = mut.target as HTMLElement;
      let $item = Dom.closest($menu, ".bar-item");
      if (!$item) {
        return;
      }
      let $head = Dom.find(":scope > .bar-item-head", $item);
      if (!$head) {
        return;
      }
      // 如果打开的话，就停靠
      if (Dom.hasClass($menu, "opened") && !Dom.hasClass($menu, "ready")) {
        let uniqKey = $item.getAttribute("item-ukey");
        if (!uniqKey) {
          return;
        }
        let mode: DockMode = props.depth > 0 ? "V" : "H";
        let space: Point2D =
          "H" == mode ? { x: 0, y: MENU_SPACE } : { x: MENU_SPACE, y: 0 };
        Dom.dockTo($menu, $head, {
          mode,
          space,
          position: "fixed"
        });
        _.delay(() => {
          setBarOpenState(uniqKey!, "ready");
        }, 0);
      }

      //let uniqKey = mut.target.getAttribute("item-ukey")
    }
  });
  /*-------------------------------------------------------

                       Life Hook

-------------------------------------------------------*/
  onMounted(() => {
    if ($con && $con.value) {
      ob.observe($con.value, {
        attributes: true
      });
    }
  });
  onUnmounted(() => {
    ob.disconnect();
  });
</script>
<template>
  <div class="bar-item-con" :class="props.className" ref="$con">
    <template v-for="it in props.items" :key="it.uniqKey">
      <ItemAsAction
        v-if="'action' == it.type"
        v-bind="it"
        :ancestors="ancestors" />
      <ItemAsFolderGroup
        v-else-if="'group' == it.type"
        v-bind="it"
        :setBarOpenState="setBarOpenState"
        :ancestors="ancestors" />
      <ItemAsInlineGroup
        v-else-if="'inline-group' == it.type"
        v-bind="it"
        :ancestors="ancestors" />
      <ItemAsStatus
        v-else-if="'status' == it.type"
        v-bind="it"
        :ancestors="ancestors" />
      <div
        class="bar-sep"
        :item-depth="it.depth"
        :item-index="it.index"
        v-else-if="'sep' == it.type"></div>
      <div
        class="bar-unknwon"
        :item-depth="it.depth"
        :item-index="it.index"
        v-else>
        {{ it }}
      </div>
    </template>
  </div>
</template>