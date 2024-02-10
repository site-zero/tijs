<script setup lang="ts">
import JSON5 from 'json5';
import _ from 'lodash';
import { Ref, ref, watch } from 'vue';
import { Vars } from '../../../core/ti';
import { formatExampleConfData } from './use-playground';

const emit = defineEmits<{
  (event: 'change', conf: Vars): void,
  (event: 'reset'): void,
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


const content = ref(formatData(props.configData || {}))
const parseErr: Ref<string | null | undefined> = ref(null)

watch(() => props.configData, function (data) {
  content.value = formatData(data || {})
})

watch(() => content.value, function (val) {
  try {
    let newData = JSON5.parse(val)
    parseErr.value = null
    if (!_.isEqual(newData, props.configData)) {
      emit('change', newData)
    }
  } catch (errMsg) {
    parseErr.value = errMsg as string
  }
})
</script>

<template>
  <div class="play-conf fit-parent">
    <textarea spellcheck="false" v-model="content"></textarea>
    <div v-if="parseErr" class="err-box">{{ parseErr }}</div>
    <button v-if="configChanged" @click="emit('reset')">
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
  border: 1px solid var(--ti-color-border-shallow);
  padding: 1em;
  line-height: 1.6em;
}

button {
  @include pos-abs($t: 6px, $r: 4px);
}

.err-box {
  border: 1px solid var(--ti-color-error);
  color: var(--ti-color-error);
  padding: .5em;
  margin: .5em;
  font-size: .8em;
  border-radius: .4em;
}
</style>
