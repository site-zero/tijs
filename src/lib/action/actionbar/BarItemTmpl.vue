<script lang="ts" setup>
import { inject, ref } from "vue";
import { TiIcon } from "../../";
import { BAR_SUPPORT, BarItemProp } from "./action-bar-type";
defineOptions({
  inheritAttrs: false
});
const emit = defineEmits(["click", "enter", "leave"]);
const { clearBarOpenStateExcept, makeSureOpen } = inject(BAR_SUPPORT)!;
const $item = ref<HTMLElement>();
//
// Props
//
let props = defineProps<BarItemProp>();
//
// Methods
//
function OnEnter() {
  //console.log("OnEnter", props.uniqKey);
  // 找到自己自己所有的祖先，如果是组，还需要找到自己
  let ans = [...(props.ancestors.get(props.uniqKey) || [])];
  if ("group" == props.type && props.depth > 0) {
    ans.push(props.uniqKey);
  }
  // 确保这条链是打开的
  makeSureOpen(ans);
  // 而其他是关闭的
  clearBarOpenStateExcept(...ans);
}
</script>
<template>
  <div ref="$item" class="bar-item" :type="props.type" :item-depth="props.depth"
    :item-index="props.index" :item-ukey="props.uniqKey" :class="props.className">
    <div class="bar-item-head" @click.left="emit('click')" @mouseenter="OnEnter">
      <div class="item-icon">
        <TiIcon v-if="props.icon" :value="props.icon" />
      </div>
      <div class="item-text" v-if="props.text">
        {{ props.text }}
      </div>
      <slot name="suffix"></slot>
    </div>
    <slot></slot>
  </div>
</template>