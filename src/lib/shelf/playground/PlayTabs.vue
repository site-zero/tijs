<script setup lang="ts">
import { computed } from 'vue';
import { TiCom } from '../../../lib';
import { DemoPlayMode } from './use-play-mode';
import { getExampleList } from './use-playground';

const emit = defineEmits<(event: string, payload: string) => void>();
/**
 * 本控件要接入的属性
 */
const props = defineProps<{
  com: TiCom,
  currentExample?: string,
  mode?: DemoPlayMode,
  exampleAsRouterLink: boolean
}>();

const ExampleList = computed(() => {
  return getExampleList(props.com, props.currentExample);
});

</script>

<template>
  <ul :mode="mode">
    <li v-for="ex in ExampleList" :class="ex.className">
      <RouterLink v-if="props.exampleAsRouterLink" :to="ex.href">{{ ex.text }}
      </RouterLink>
      <a v-else @click="emit('change', ex.name)">{{ ex.text }}</a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@use '../../../assets/style/_all.scss' as *;

ul {
  list-style: none;
  padding: .5em;
  margin: 0;
}

li>a {
  display: block;
  border: 1px solid var(--ti-color-border-shallow);
  color: var(--ti-color-tab-f);
  background-color: var(--ti-color-tab);
  padding: SZ(8) SZ(10);
  border-radius: SZ(4);
  margin: SZ(3);
  cursor: pointer;
}

li.is-highlight>a {
  color: var(--ti-color-primary-r);
  background-color: var(--ti-color-primary);
  cursor: default;
}

ul[mode='H'],
ul[mode='F'] {
  @include flex-align($ai: stretch, $ac: stretch);
}

ul[mode='V'] {
  padding-left: .5em;
}
</style>
