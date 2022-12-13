<template>
  <Screen v-if="screening" />
  <Editor v-else-if="_isPC" />
  <Mobile v-else />
  <Loading v-if="loading" />
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from './utils/common'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import Loading from '@/components/Loading.vue'

const _isPC = isPC()

const mainStore = useMainStore()
const snapshotStore = useSnapshotStore()
const { databaseId } = storeToRefs(mainStore)
const { screening } = storeToRefs(useScreenStore())
const slidesStore = useSlidesStore()
const { getDataApi, patchDataApi, loading } = storeToRefs(slidesStore)

if (process.env.NODE_ENV === 'production') {
  window.onbeforeunload = () => false
}

onMounted(async () => {
  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
  mainStore.setAvailableFonts()

  const QUERY_PARAMS = new URLSearchParams(window.location.search)
  const getDataApiQuery = QUERY_PARAMS.get('getDataApi')
  const patchDataApiQuery = QUERY_PARAMS.get('patchDataApi')
  const getUptokenApiQuery = QUERY_PARAMS.get('getUptokenApi')
  const token = QUERY_PARAMS.get('token') 
      
  if (getDataApiQuery && patchDataApiQuery && getUptokenApiQuery) {
    const getDataApi = JSON.parse(decodeURIComponent(getDataApiQuery))
    const patchDataApi = JSON.parse(decodeURIComponent(patchDataApiQuery))
    const getUptokenApi = JSON.parse(decodeURIComponent(getUptokenApiQuery))
    slidesStore.setApi({
      getDataApi,
      patchDataApi,
      getUptokenApi, 
      token 
    })
  }
})

watch([getDataApi, patchDataApi], () => {
  if (getDataApi.value && patchDataApi.value) {
    slidesStore.getSlidesByApi()
  }
}, { deep: true, immediate: true })

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('unload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>