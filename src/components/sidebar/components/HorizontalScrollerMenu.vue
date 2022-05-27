<template>
  <n-scrollbar ref="scrollbarRef" :x-scrollable="true">
    <n-menu
      mode="horizontal"
      v-model:value="defaultPath"
      :collapsed="false"
      :options="menuOptions"
      :default-value="defaultPath"
      @update:value="onMenuClick"
    />
  </n-scrollbar>
</template>

<script lang="ts">
  import type { MenuOption, NScrollbar } from 'naive-ui'
  import {
    defineComponent,
    nextTick,
    onMounted,
    PropType,
    ref,
    shallowReactive,
    watch,
    watchEffect,
  } from 'vue'
  import { useRoute } from 'vue-router'
  import { useLayoutStore } from '../../../components/index'
  import { RouteRecordRawWithHidden } from '../../../types/store'
  import { isExternal, transfromMenu } from '../../../utils'

  export default defineComponent({
    name: 'HorizontalScrollerMenu',
    props: {
      routes: {
        type: Object as PropType<Array<RouteRecordRawWithHidden>>,
        require: true,
      },
    },
    emits: ['menu-update'],
    setup(props, { emit }) {
      const scrollbarRef = ref<InstanceType<typeof NScrollbar>>()
      const store = useLayoutStore()
      const menuOptions = shallowReactive([] as Array<MenuOption>)
      const defaultPath = ref('')
      const currentRoute = useRoute()
      defaultPath.value = '/' + currentRoute.fullPath.split('/')[1]
      function horizontalScrollTo() {
        if (store.state.layoutMode === 'tlr') {
          setTimeout(() => {
            const item = document.querySelector(
              '.n-menu.n-menu--horizontal .n-menu-item.n-menu-item--selected'
            ) as HTMLElement
            scrollbarRef.value?.scrollTo({
              left: item?.offsetLeft,
              behavior: 'smooth',
            })
          }, 300)
        }
      }
      function handleMenu(routes?: Array<RouteRecordRawWithHidden>) {
        menuOptions.length = 0
        const tempMenus = transfromMenu(routes || [])
        menuOptions.push(...tempMenus)
      }
      function onMenuClick(key: string) {
        if (isExternal(key)) return
        emit('menu-update', { path: key, type: 'click' })
        horizontalScrollTo()
      }
      onMounted(() => {
        nextTick(() => {
          emit('menu-update', { path: defaultPath.value, type: 'auto' })
        })
      })
      watch(
        () => currentRoute.fullPath,
        (newVal) => {
          defaultPath.value = '/' + newVal.split('/')[1]
          emit('menu-update', { path: defaultPath.value, type: 'auto' })
          horizontalScrollTo()
        }
      )
      watchEffect(() => {
        handleMenu(props.routes)
        horizontalScrollTo()
      })
      return {
        scrollbarRef,
        defaultPath,
        state: store?.state,
        menuOptions,
        onMenuClick,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.n-menu-item-content__icon) {
    font-size: 16px !important;
  }
  :deep(.n-menu .n-menu-item) {
    margin-top: 0;
    // margin-bottom: 5px;
  }
  :deep(.n-menu .n-menu-item::before) {
    left: 0;
    right: 0;
    border-radius: 3px;
    margin: 0 5px;
  }
  @import '../../../assets/styles/variables.scss';
</style>
