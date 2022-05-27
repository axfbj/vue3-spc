<template>
  <router-view v-slot="{ Component }">
    <transition :name="state.pageAnim + '-transform'" mode="out-in" appear>
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="key" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import store from '../store'
  export default defineComponent({
    name: 'Main',
    setup() {
      const state = store.state
      const cachedViews = computed(() => {
        return state.cachedView.map((it: string) => it)
      })
      const route = useRoute()
      const key = ref(route.fullPath)
      watch(
        () => route.fullPath,
        (newVal) => {
          key.value = newVal
        }
      )
      return {
        key,
        state,
        cachedViews,
      }
    },
  })
</script>
