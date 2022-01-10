import { computed, onMounted, onUnmounted } from 'vue'
import { useStore } from '@/store'
// import { getImageDataURL } from '@/utils/image'
import usePasteTextClipboardData from './usePasteTextClipboardData'
import useCreateElement from './useCreateElement'
import api from '@/api'
import qiniuUpload from '@/utils/qiniu'
import { message } from 'ant-design-vue'

export default () => {
  const store = useStore()
  const editorAreaFocus = computed(() => store.state.editorAreaFocus)
  const thumbnailsFocus = computed(() => store.state.thumbnailsFocus)
  const disableHotkeys = computed(() => store.state.disableHotkeys)
  const getUptokenApi = computed(() => store.state.getUptokenApi)

  const { pasteTextClipboardData } = usePasteTextClipboardData()
  const { createImageElement } = useCreateElement()

  // 粘贴图片到幻灯片元素
  const pasteImageFile = async (imageFile: File) => {
    // getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
    if (!imageFile) return
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

  /**
   * 粘贴事件监听
   * @param e ClipboardEvent
   */
  const pasteListener = (e: ClipboardEvent) => {
    if (!editorAreaFocus.value && !thumbnailsFocus.value) return
    if (disableHotkeys.value) return

    if (!e.clipboardData) return

    const clipboardDataItems = e.clipboardData.items
    const clipboardDataFirstItem = clipboardDataItems[0]

    if (!clipboardDataFirstItem) return

    // 如果剪贴板内有图片，优先尝试读取图片
    for (const item of clipboardDataItems) {
      if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
        const imageFile = item.getAsFile()
        if (imageFile) pasteImageFile(imageFile)
        return
      }
    }
    
    // 如果剪贴板内没有图片，但有文字内容，尝试解析文字内容
    if (clipboardDataFirstItem.kind === 'string' && clipboardDataFirstItem.type === 'text/plain') {
      clipboardDataFirstItem.getAsString(text => pasteTextClipboardData(text))
    }
  }

  onMounted(() => {
    document.addEventListener('paste', pasteListener)
  })
  onUnmounted(() => {
    document.removeEventListener('paste', pasteListener)
  })
}