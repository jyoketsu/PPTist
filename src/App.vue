<template>
  <Editor v-if="!screening" />
  <Screen v-else />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch } from 'vue'
import { MutationTypes, ActionTypes, useStore } from '@/store'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'

export default defineComponent({
  name: 'app',
  components: {
    Editor,
    Screen,
  },
  setup() {
    const store = useStore()
    const screening = computed(() => store.state.screening)
    const getDataApi = computed(() => store.state.getDataApi)
    const patchDataApi = computed(() => store.state.patchDataApi)

    if (process.env.NODE_ENV === 'production') {
      window.onbeforeunload = () => false
    }

    onMounted(() => {
      store.commit(MutationTypes.SET_AVAILABLE_FONTS)
      store.dispatch(ActionTypes.INIT_SNAPSHOT_DATABASE)
      const QUERY_PARAMS = new URLSearchParams(window.location.search)
      const getDataApiQuery = QUERY_PARAMS.get('getDataApi')
      const patchDataApiQuery = QUERY_PARAMS.get('patchDataApi')
      const token = QUERY_PARAMS.get('token') 
      
      if (getDataApiQuery && patchDataApiQuery) {
        const getDataApi = JSON.parse(decodeURIComponent(getDataApiQuery))
        const patchDataApi = JSON.parse(decodeURIComponent(patchDataApiQuery))
        store.commit(MutationTypes.SET_API, {
          getDataApi,
          patchDataApi,
          token 
        })
      }
    })

    watch([getDataApi, patchDataApi], () => {
      if (getDataApi.value && patchDataApi.value) {
        store.dispatch(ActionTypes.GET_DOC)
      }
    }, { deep: true, immediate: true })

    return {
      screening,
    }
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>