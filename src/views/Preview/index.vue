<template>
  <div class="pptist-editor">
    <div class="layout-content">
      <Thumbnails class="layout-content-left" />
      <div class="layout-content-center" ref="containerRef">
        <ThumbnailSlide class="thumbnail" :slide="currentSlide"  :size="screenWidth - 40"  visible />
        <div class="actions">
          <div class="screening"><IconPpt /></div>
          <div class="edit" @click="toEdit"><IconEdit /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useGlobalHotkey from '@/hooks/useGlobalHotkey'
import usePasteEvent from '@/hooks/usePasteEvent'

import Canvas from './Canvas/index.vue'
import Thumbnails from './Thumbnails/index.vue'
import ThumbnailSlide from '@/views/components/ThumbnailSlide/index.vue'
import useSlideHandler from '@/hooks/useSlideHandler'
import useScreening from '@/hooks/useScreening'

const mainStore = useMainStore()
const { dialogForExport, showSelectPanel } = storeToRefs(mainStore)
const closeExportDialog = () => mainStore.setDialogForExport('')
const { currentSlide } = storeToRefs(useSlidesStore())
const { toEdit } = useSlideHandler()
const { enterScreening } = useScreening()

const containerRef = ref<HTMLElement>()
const screenWidth = ref(0)

const handleResize = () => {
  if (!containerRef.value) return
  screenWidth.value = containerRef.value.clientWidth 
}

const handle2Edit = (e:MessageEvent) => {
  if (e.data.eventName === 'switch2edit') {
    toEdit()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
  window.addEventListener('message', handle2Edit)
  handleResize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('message', handle2Edit)
})

useGlobalHotkey()
usePasteEvent()
</script>

<style lang="scss" scoped>
.pptist-editor {
  height: 100%;
}
.layout-header {
  height: 40px;
}
.layout-content {
  height: 100%;
  display: flex;
}
.layout-content-left {
  width: 160px;
  height: 100%;
  flex-shrink: 0;
}
.layout-content-center {
  position: relative;
  width: calc(100% - 160px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.thumbnail{
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
}
.actions{
  display: flex;
  position: absolute;
  top: 15px;
  right: 15px;
}
.screening,.edit{
  cursor: pointer;
  margin-right: 15px;
}
</style>