<template>
  <div class="loading-wrapper">
    <!-- <i class="loading"></i> -->
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
  .loading {
    width: 100px;
    height: 100px;
    background-image: url(/loading.gif);
    background-size: contain;
    background-repeat: no-repeat;
  }
</style>