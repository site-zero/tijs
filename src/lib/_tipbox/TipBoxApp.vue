<script lang="ts" setup>
  import { computed } from "vue";
  import { Vars } from "../../_type";
  import { tiCheckComponent } from "../../core";
  import _ from "lodash";

  // -----------------------------------------------------
  const props = defineProps<{
    comType?: string;
    comConf: Vars;
    readyEvent?: string;
    updateDocking: () => void;
  }>();
  // -----------------------------------------------------
  const Com = computed(() => {
    return tiCheckComponent(props.comType || "TiTextSnippet");
  });
  // -----------------------------------------------------
  const onReadyEvents = computed(() => {
    if (props.readyEvent && _.isFunction(props.updateDocking)) {
      return {
        [props.readyEvent]: () => {
          props.updateDocking();
        },
      };
    }
  });
  // -----------------------------------------------------
</script>
<template>
  <component :is="Com.com" v-bind="props.comConf" v-on="onReadyEvents" />
</template>
