<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { IconTextState, TiIcon } from '../../';
  import { I18n } from '../../../core';
  import { RoadblockProps } from './ti-roadblock-types';
  import { RoadblockEvents, useRoadblock } from './use-roadblock';
  //--------------------------------------------
  // 自己创建状态
  const state: IconTextState = reactive({
    iconHovered: false,
    textHovered: false,
  });
  //--------------------------------------------
  let props = withDefaults(defineProps<RoadblockProps>(), {
    className: '',
    icon: 'fas-exclamation-triangle',
    autoI18n: true,
  });
  //--------------------------------------------
  let emit = defineEmits<{
    (event: RoadblockEvents): void;
  }>();
  //--------------------------------------------
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
      emit,
      emitIcon: 'click-icon',
      emitText: 'click-text',
      defaultIcon: 'fas-exclamation-triangle',
      defaultText: 'i18n:nil',
    })
  );
  //--------------------------------------------
</script>

<template>
  <main
    class="roadblock"
    :class="Roadblock.TopClass"
    :style="Roadblock.TopStyle">
    <!--Icon---->
    <section
      class="part-icon"
      v-if="Roadblock.showIcon">
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
    <section
      v-if="Roadblock.hasLinks"
      class="part-links">
      <ul class="raw">
        <li
          v-for="li in props.links"
          class="link-item">
          <a
            :href="li.href"
            :target="li.target">
            <!--Link Icon-->
            <TiIcon
              v-if="li.icon"
              class="link-icon"
              :value="li.icon" />
            <!--Link Text-->
            <span
              v-if="li.text"
              class="link-text"
              >{{ I18n.text(li.text) }}</span
            >
          </a>
        </li>
      </ul>
    </section>
  </main>
</template>
