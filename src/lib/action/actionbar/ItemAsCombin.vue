<script lang="ts" setup>
  import { computed } from "vue";
  import { CssUtils } from "../../../core/web";
  import ItemAsAction from "./ItemAsAction.vue";
  import ItemAsCombin from "./ItemAsCombin.vue";
  import ItemAsCustomized from "./ItemAsCustomized.vue";
  import ItemAsGroup from "./ItemAsGroup.vue";
  import { ABarUsedItem } from "./ti-action-bar-types";
  //-------------------------------------------------------
  defineOptions({
    inheritAttrs: false,
  });
  //-------------------------------------------------------
  let props = withDefaults(defineProps<ABarUsedItem>(), {});
  //-------------------------------------------------------
  const TopClass = computed(() => {
    return CssUtils.mergeClassName(props.className, {
      "is-disabled": props.disabled,
      "is-enabled": !props.disabled,
    });
  });
  //-------------------------------------------------------
</script>
<template>
  <div
    class="bar-item as-combin"
    :class="TopClass"
    :aspect="props.aspect"
    :type="props.type"
    :item-depth="props.depth"
    :item-index="props.index"
    :item-ukey="props.uniqKey">
    <template v-for="it in props.items" :key="it.uniqKey">
      <template v-if="!it.hidden">
        <!--......|< Action >|......-->
        <ItemAsAction v-if="'action' == it.type" v-bind="it" />
        <!--......|< Group >|......-->
        <ItemAsGroup v-else-if="'group' == it.type" v-bind="it" />
        <!--......|< Combin >|......-->
        <ItemAsCombin v-else-if="'combin' == it.type" v-bind="it" />
        <!--......|< Customized >|......-->
        <ItemAsCustomized v-else-if="'customized' == it.type" v-bind="it" />
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
</template>
