<script setup lang="ts">
const emit = defineEmits(["submitCallback"]);

defineProps({
  text: { type: String, default: "提交" }
});

const clickBack = () => {
  alert("点击提交dd");
  emit("submitCallback");
};
</script>

<template>
  <div class="main-container">
    <button class="button-container" @click="clickBack">{{ text }}</button>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  .button-container {
    padding: 8px 15px;

    background-color: #36c96d;
    border-width: 0px;
    border-radius: 2px;
    box-shadow: none;

    font-size: 14px;
    color: #fff;

    cursor: pointer;
  }
}
</style>
