<script setup lang="ts">
  import { computed, inject, reactive } from 'vue';
  import { BUS_KEY, IconTextState, TiEvent, TiIcon, useBusEmit } from '../../';
  import { TiInputInfo } from '../../input/box/ti-input-index.ts';
  import {
    RoadblockEvents,
    RoadblockProps,
    useRoadblock,
  } from './use-roadblock';
  /*-------------------------------------------------------

                        State

-------------------------------------------------------*/
  // 自己创建状态
  const state: IconTextState = reactive({
    iconHovered: false,
    textHovered: false,
  });
  /*-------------------------------------------------------

                        Props

-------------------------------------------------------*/
  let props = withDefaults(defineProps<RoadblockProps>(), {
    className: '',
    icon: 'fas-exclamation-triangle',
  });
  /*-------------------------------------------------------

                    Event Bus 

-------------------------------------------------------*/
  let emit = defineEmits<{
    (event: RoadblockEvents, payload: TiEvent<undefined>): void;
  }>();
  let bus = inject(BUS_KEY);
  let notify = useBusEmit(TiInputInfo, props, emit, bus);
  /*-------------------------------------------------------

                      Features

-------------------------------------------------------*/
  // const {
  //   Roadblock,
  //   TopClass,
  //   IconClass,
  //   DisplayIcon,
  //   DisplayText,
  //   hasLinks,
  //   setIconHover,
  //   setTextHover
  // } = useRoadblock(state, props, {
  //   notify,
  //   notifyIcon: ["click-icon", undefined],
  //   notifyText: ["click-text", undefined],
  //   defaultIcon: "fas-exclamation-triangle",
  //   defaultText: "i18n:nil"
  // });
  const Roadblock = computed(() =>
    useRoadblock(state, props, {
      notify,
      notifyIcon: ['click-icon', undefined],
      notifyText: ['click-text', undefined],
      defaultIcon: 'fas-exclamation-triangle',
      defaultText: 'i18n:nil',
    }),
  );
</script>

<template>
  <main
    class="roadblock"
    :class="Roadblock.TopClass"
    :style="Roadblock.TopStyle">
    <!--Icon---->
    <section class="part-icon" v-if="Roadblock.showIcon">
      <TiIcon
        :class="Roadblock.IconClass"
        :value="Roadblock.DisplayIcon"
        :style="Roadblock.IconStyle"
        @click="Roadblock.OnClickIcon"
        @mouseenter="Roadblock.setIconHover(true)"
        @mouseleave="Roadblock.setIconHover(false)" />
    </section>
    <!--Text---->
    <section class="part-text">
      <span
        :class="Roadblock.TextClass"
        :style="Roadblock.TextStyle"
        @click="Roadblock.OnClickText"
        @mouseenter="Roadblock.setTextHover(true)"
        @mouseleave="Roadblock.setTextHover(false)"
        >{{ Roadblock.DisplayText }}</span
      >
    </section>
    <!--Links-->
    <section v-if="Roadblock.hasLinks" class="part-links">
      <ul class="raw">
        <li v-for="li in props.links" class="link-item">
          <a :href="li.href" :target="li.target">
            <!--Link Icon-->
            <TiIcon v-if="li.icon" class="link-icon" :value="li.icon" />
            <!--Link Text-->
            <span v-if="li.text" class="link-text">{{ li.text }}</span>
          </a>
        </li>
      </ul>
    </section>
  </main>
</template>
