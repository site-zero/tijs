<script setup lang="ts">
  import { computed } from "vue";
  import { EmitAdaptorOptions, TiIcon, useEmitAdaptor } from "../../";
  import { TextSnippetEmitter, TextSnippetProps } from "./text-snippet-types";
  import { useTextSnippet } from "./use-text-snippet";
  import { EmitAdaptorEvent } from "../../../_type";
  //-----------------------------------------------------
  const emit = defineEmits<TextSnippetEmitter>();
  //-----------------------------------------------------
  const props = defineProps<TextSnippetProps>();
  //-----------------------------------------------------
  const _text = computed(() => useTextSnippet(props));
  //const _text = ref<TextSnippetApi>();
  //-----------------------------------------------------
  const OnCustomizedlEvents = computed(() =>
    useEmitAdaptor("TiTextSnippet", { events: props.events }, {
      handler: (event: EmitAdaptorEvent) => {
        console.log("OnCustomizedlEvents.handler", event);
        emit(event.eventName, event.data);
      },
    } as EmitAdaptorOptions)
  );
  //-----------------------------------------------------
  // watch(
  //   () => [props.comType, props.text],
  //   (newval, oldval) => {
  //     _text.value = useTextSnippet(props);
  //   },
  //   { immediate: true }
  // );
  //-----------------------------------------------------
</script>
<template>
  <component
    v-if="_text"
    :is="_text.tag"
    :class="_text.TopClass"
    :style="_text.TopStyle"
    v-bind="_text.TopAttrs"
    :data-tip="props.ctrlTip"
    data-tip-modifier="CTRL"
    data-tip-max-width="640px"
    data-tip-content-type="html"
    data-tip-dock-mode="H"
    v-on="OnCustomizedlEvents">
    <template v-if="!_text.customized">
      <TiIcon
        v-if="props.prefixIcon"
        className="at-prefix"
        :logicType="props.logicType"
        :value="props.prefixIcon"
        :tip="props.prefixTip" />
      <template v-if="_text.text">
        <div
          v-if="'html' == props.textType"
          class="as-snippet-text"
          :style="props.textStyle"
          v-html="_text.text"></div>
        <div v-else class="as-snippet-text" :style="props.textStyle">
          {{ _text.text }}
        </div>
      </template>
      <TiIcon
        v-if="props.suffixIcon"
        className="at-suffix"
        :logicType="props.logicType"
        :value="props.suffixIcon"
        :tip="props.suffixTip" />
    </template>
  </component>
</template>
<style lang="scss"></style>
