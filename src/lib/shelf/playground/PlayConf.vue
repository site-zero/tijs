<script setup lang="ts">
  import JSON5 from 'json5';
  import _ from 'lodash';
  import { Ref, computed, ref } from 'vue';
  import { Vars } from '../../../core/ti';
  import { formatExampleConfData } from './use-playground';

  const emit = defineEmits<{
    (event: 'change', conf: Vars): void;
    (event: 'reset'): void;
  }>();

  function formatData(data: any) {
    return formatExampleConfData(data);
  }

  /**
   * 本控件要接入的属性
   */
  const props = defineProps<{
    configData: Vars;
    configChanged: boolean;
  }>();

  const ConfigText = computed(() => {
    return formatData(props.configData);
  });

  const content = ref('{}');
  const parseErr: Ref<string | null | undefined> = ref(null);

  function OnTextChange(evt: Event) {
    let val = (evt.target as HTMLTextAreaElement).value;
    let str = _.trim(val);
    try {
      let newData = JSON5.parse(str);
      parseErr.value = null;
      if (!_.isEqual(newData, props.configData)) {
        emit('change', newData);
      }
    } catch (errMsg) {
      parseErr.value = errMsg as string;
    }
  }
</script>

<template>
  <div class="play-conf fit-parent">
    <textarea
      spellcheck="false"
      :value="ConfigText"
      @change="OnTextChange"></textarea>
    <div
      v-if="parseErr"
      class="err-box">
      {{ parseErr }}
    </div>
    <button
      v-if="configChanged"
      @click="emit('reset')">
      {{ 'Reset' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;

  .play-conf {
    @include flex-align-v-nowrap;
    position: relative;
    overflow: hidden;
  }

  textarea {
    @include font-fixed;
    flex: 1 1 auto;
    font-size: SZ(14);
    outline: none;
    resize: none;
    border: 0;
    padding: 1em;
    line-height: 1.6em;
  }

  button {
    @include pos-abs($t: 6px, $r: 4px);
  }

  .err-box {
    border: 1px solid var(--ti-color-error);
    color: var(--ti-color-error);
    padding: 0.5em;
    margin: 0.5em;
    font-size: 0.8em;
    border-radius: 0.4em;
  }
</style>
