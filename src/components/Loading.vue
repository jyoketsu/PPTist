<template>
  <div class="loading-wrapper">
    <Spin size="large" />
  </div>
</template>

<script lang="ts">
import { Spin } from 'ant-design-vue'
export default {
  name: 'loading',
  components: {
    Spin
  }
}
</script>
<style scoped>
  .loading-wrapper {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>