<script lang="ts" setup>
import { computed } from 'vue';
import { MainFrameProps, getDemoContent } from './use-main-frame';

const props = withDefaults(defineProps<MainFrameProps>(), {
  mode: "Z"
})

const MFMode = computed(() => props.mode || "T")

</script>
<template>
  <div class="ti-main-frame" :mode="MFMode">
    <!-- 
      =====Mobile Layout======  
    -->
    <template v-if="'mobile' == MFMode">
      <!--顶栏-->
      <div class="frame-part as-sky">Sky</div>
      <!--主区域-->
      <div class="frame-part as-arena">
        <div class="arena-con" v-html="getDemoContent()"></div>
      </div>
      <!--底栏-->
      <div class="frame-part as-foot">Foot</div>
    </template>
    <!--
      =====Desktop Layout====== 
    -->
    <template v-else>
      <!--顶栏-->
      <div class="frame-part as-sky">Sky</div>
      <!--主区域-->
      <div class="frame-part as-arena">
        <div class="arena-con" v-html="getDemoContent()"></div>
      </div>
      <!--侧边栏-->
      <div class="frame-part as-chute">Chute</div>
      <!--底栏-->
      <div class="frame-part as-foot">Foot</div>
    </template>
  </div>
</template>
<style lang="scss" scoped>
@use '../../../assets/style/_all.scss' as *;
@import './ti-main-frame.scss';
</style>
