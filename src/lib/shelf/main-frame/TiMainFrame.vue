<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { MainFrameProps, getDemoContent } from './use-main-frame';
  import { TiRoadblock } from '../../';

  const _chute_width = ref(200);

  const props = withDefaults(defineProps<MainFrameProps>(), {
    mode: 'Z',
    minChuteWidth: 50,
  });

  const MFMode = computed(() => props.mode || 'T');

  const TopStyle = computed(() => {
    //  Only in desktop mode,  we can support adjust chute size.
    if (/^[TCZ]$/.test(MFMode.value)) {
      let w = Math.max(props.minChuteWidth, _chute_width.value);
      return {
        'grid-template-columns': `${w}px 1fr`,
      };
    }
  });
</script>
<template>
  <div
    class="ti-main-frame"
    :mode="MFMode"
    :style="TopStyle">
    <!-- 
      =====Mobile Layout======  
    -->
    <template v-if="'mobile' == MFMode">
      <!--顶栏-->
      <div class="frame-part as-sky">
        <slot name="sky"><span>{Slot Sky}</span></slot>
      </div>
      <!--主区域-->
      <div class="frame-part as-arena">
        <slot>
          <div
            class="arena-con"
            v-html="getDemoContent()"></div>
        </slot>
      </div>
      <!--底栏-->
      <div class="frame-part as-foot">
        <slot name="foot"><span>{Slot Foot}</span></slot>
      </div>
    </template>
    <!--
      =====Desktop Layout====== 
    -->
    <template v-else>
      <!--顶栏-->
      <div class="frame-part as-sky">
        <slot name="sky"><span>{Slot Sky}</span></slot>
      </div>
      <!--主区域-->
      <div class="frame-part as-arena">
        <div class="part-con">
          <div class="part-scroller">
            <slot>
              <TiRoadblock icon="zmdi-widgets" text="Main Area" />
            </slot>
          </div>
        </div>
      </div>
      <!--侧边栏-->
      <div class="frame-part as-chute">
        <div class="part-con">
          <div class="part-scroller">
            <slot name="chute"><span>{Slot Chute}</span></slot>
          </div>
        </div>
        <!--调整条-->
        <div class="adjust-bar"></div>
      </div>
      <!--底栏-->
      <div class="frame-part as-foot">
        <slot name="foot"><span>{Slot Foot}</span></slot>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @use '../../../assets/style/_all.scss' as *;
  @import './ti-main-frame.scss';
</style>
