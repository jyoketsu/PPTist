import { onMounted, onUnmounted, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import { parseText2Paragraphs } from '@/utils/textParser'
import useCreateElement from '@/hooks/useCreateElement'
import api from '@/api'
import qiniuUpload from '@/utils/qiniu'
import { message } from 'ant-design-vue'

export default (elementRef: Ref<HTMLElement | undefined>) => {
  const { disableHotkeys } = storeToRefs(useMainStore())

  const { createImageElement, createTextElement } = useCreateElement()

  const slidesStore = useSlidesStore()
  const { getUptokenApi } = storeToRefs(slidesStore)

  // 拖拽元素到画布中
  const handleDrop = async (e: DragEvent) => {
    if (!e.dataTransfer || e.dataTransfer.items.length === 0) return
    const dataTransferItem = e.dataTransfer.items[0]

    // 检查事件对象中是否存在图片，存在则插入图片，否则继续检查是否存在文字，存在则插入文字
    if (dataTransferItem.kind === 'file' && dataTransferItem.type.indexOf('image') !== -1) {
      const imageFile = dataTransferItem.getAsFile()
      if (imageFile) {
        if (getUptokenApi.value) {
          // eslint-disable-next-line
          const res: any = await api.request.get(getUptokenApi.value.url, {...getUptokenApi.value.params, ...{token: api.getToken()}})
          if (res.statusCode === '200') {
            const upToken = res.result
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            qiniuUpload(upToken, imageFile).then((url: any) => createImageElement(url)).catch((error) => message.warn(error.msg || '上传失败！'))
          }
          else {
            message.warn('获取上传token失败！')
          }
        }
      }
    }
    else if (dataTransferItem.kind === 'string' && dataTransferItem.type === 'text/plain') {
      dataTransferItem.getAsString(text => {
        if (disableHotkeys.value) return
        const string = parseText2Paragraphs(text)
        createTextElement({
          left: 0,
          top: 0,
          width: 600,
          height: 50,
        }, { content: string })
      })
    }
  }

  onMounted(() => {
    elementRef.value && elementRef.value.addEventListener('drop', handleDrop)

    document.ondragleave = e => e.preventDefault()
    document.ondrop = e => e.preventDefault()
    document.ondragenter = e => e.preventDefault()
    document.ondragover = e => e.preventDefault()
  })
  onUnmounted(() => {
    elementRef.value && elementRef.value.removeEventListener('drop', handleDrop)

    document.ondragleave = null
    document.ondrop = null
    document.ondragenter = null
    document.ondragover = null
  })
}