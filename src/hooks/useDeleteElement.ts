import { computed } from 'vue'
import { MutationTypes, useStore } from '@/store'
import { Slide } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import api from '../api'

export default () => {
  const store = useStore()
  const activeElementIdList = computed(() => store.state.activeElementIdList)
  const currentSlide = computed<Slide>(() => store.getters.currentSlide)

  const { addHistorySnapshot } = useHistorySnapshot()

  // 删除全部选中元素
  const deleteElement = () => {
    if (!activeElementIdList.value.length) return
   
    const deleteSrcList: string[] = []
    const newElementList = currentSlide.value.elements.filter(el => {
      const noDelete = !activeElementIdList.value.includes(el.id)
      // 要删除的图片地址
      if (!noDelete && el.type === 'image') {
        deleteSrcList.push(el.src)
      }
      return noDelete
    })
    if (deleteSrcList.length) {
      // 删除七牛资源
      api.qiniu.deleteQiniu(deleteSrcList) 
    }
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: newElementList })
    addHistorySnapshot()
  }

  // 删除内面内全部元素(无论是否选中)
  const deleteAllElements = () => {
    if (!currentSlide.value.elements.length) return
    store.commit(MutationTypes.SET_ACTIVE_ELEMENT_ID_LIST, [])
    store.commit(MutationTypes.UPDATE_SLIDE, { elements: [] })
    addHistorySnapshot()
  }

  return {
    deleteElement,
    deleteAllElements,
  }
}