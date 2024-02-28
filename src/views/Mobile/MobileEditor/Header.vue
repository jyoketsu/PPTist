<template>
  <div class="mobile-editor-header">
    <div class="history">
      <div class="history-item" :class="{ 'disable': !canUndo }" @click.stop="undo()"><IconBack /> 撤销</div>
      <div class="history-item" :class="{ 'disable': !canRedo }" @click.stop="redo()"><IconNext /> 重做</div>
    </div>
    <div class="flex-space"/>
    <div class="back" @click="changeMode('preview')"><IconLogout /> 退出编辑</div>
    <!-- <div class="save" @click="saveSlides()">保存</div> -->
    <div class="save">{{ changed?'有更改':'已保存' }}</div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore, useSnapshotStore } from '@/store'
import { Mode } from '@/types/mobile'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import useSlideHandler from '@/hooks/useSlideHandler'

defineProps({
  changeMode: {
    type: Function as PropType<(mode: Mode) => void>,
    required: true,
  },
})

const slidesStore = useSlidesStore()
const { changed } = storeToRefs(slidesStore)
const { canUndo, canRedo } = storeToRefs(useSnapshotStore())
const { redo, undo } = useHistorySnapshot()
const { saveSlides } = useSlideHandler()
</script>

<style lang="scss" scoped>
.mobile-editor-header {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 18px;
  font-size: 13px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}
.flex-space {
  flex: 1;
}
.history {
  display: flex;
  justify-content: center;
  align-items: center;
}
.save {
  margin-left: 15px;
  margin-bottom: 0.1px;
}
.history-item {
  margin-right: 20px;

  &.disable {
    opacity: .5;
  }
}
</style>