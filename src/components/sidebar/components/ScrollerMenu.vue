<template>
  <div style="position: relative" :class="{ scrollbar: mMode === 'vertical' }">
    <n-scrollbar ref="scrollbarRef" :x-scrollable="mMode == 'horizontal'">
      <n-menu
        :mode="mMode"
        :value="defaultPath"
        :collapsed="state.isCollapse"
        :options="menuOptions"
        :default-value="defaultPath"
        :expanded-keys="defaultExpandKeys"
        :collapsed-icon-size="22"
        :collapsed-width="63"
        :indent="15"
        :accordion="state.accordionMenu"
        @update:value="onMenuClick"
        @update:expanded-keys="onMenuExpandedKeysClick"
      />
    </n-scrollbar>
    <span v-if="mMode === 'vertical'" class="collpase-wrapper">
      <Humburger />
    </span>
  </div>
</template>

<script lang="ts">
  import type { MenuOption, NScrollbar } from 'naive-ui'
  import {
    computed,
    defineComponent,
    PropType,
    ref,
    shallowReactive,
    watch,
    watchEffect,
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLayoutStore } from '../../../components/index'
  import { RouteRecordRawWithHidden } from '../../../types/store'
  import { isExternal, transfromMenu } from '../../../utils'

  export default defineComponent({
    name: 'ScrollerMenu',
    props: {
      routes: {
        type: Object as PropType<Array<RouteRecordRawWithHidden>>,
        require: true,
      },
      mode: {
        type: String,
        default: 'vertical',
      },
    },
    setup(props) {
      const scrollbarRef = ref<InstanceType<typeof NScrollbar>>()
      const store = useLayoutStore()
      const menuOptions = shallowReactive([] as Array<MenuOption>)
      const defaultPath = ref('')
      const defaultExpandKeys = ref([] as Array<string>)
      const currentRoute = useRoute()
      const router = useRouter()
      const mMode = computed(() => props.mode)
      defaultPath.value = currentRoute.fullPath
      handleExpandPath()
      function horizontalScrollTo() {
        if (store.state.layoutMode === 'ttb') {
          setTimeout(() => {
            let subItem = document.querySelector(
              '.n-menu.n-menu--horizontal .n-menu-item-content.n-menu-item-content--child-active'
            ) as HTMLElement
            if (subItem) {
              scrollbarRef.value?.scrollTo({
                left: subItem?.parentElement?.offsetLeft,
                behavior: 'smooth',
              })
            } else {
              const item = document.querySelector(
                '.n-menu-item.n-menu-item--selected'
              ) as HTMLElement
              scrollbarRef.value?.scrollTo({
                left: item?.offsetLeft,
                behavior: 'smooth',
              })
            }
          }, 300)
        }
      }
      function handleMenu(routes?: Array<RouteRecordRawWithHidden>) {
        menuOptions.length = 0
        const tempMenus = transfromMenu(routes || [])
        menuOptions.push(...tempMenus)
      }
      function handleExpandPath() {
        const keys = currentRoute.fullPath.split('/')
        const resultPath = keys
          .filter((it) => !!it)
          .reduce((pre, cur) => {
            const lastPath = pre[pre.length - 1]
            if (!lastPath) {
              pre.push('/' + cur)
            } else {
              pre.push(lastPath + '/' + cur)
            }
            return pre
          }, [] as string[])
        defaultExpandKeys.value = store.state.accordionMenu
          ? resultPath
          : Array.from(new Set([...defaultExpandKeys.value, ...resultPath]))
      }
      function onMenuClick(key: string) {
        if (isExternal(key)) return
        router.push(key)
        if (store.state.device === 'mobile') {
          store.toggleCollapse(true)
        }
      }
      function onMenuExpandedKeysClick(keys: string[]) {
        defaultExpandKeys.value = keys
      }
      watch(
        () => currentRoute.fullPath,
        (newVal) => {
          defaultPath.value = newVal
          handleExpandPath()
          horizontalScrollTo()
        }
      )
      watchEffect(() => {
        handleMenu(props.routes)
        horizontalScrollTo()
      })
      return {
        scrollbarRef,
        mMode,
        defaultPath,
        defaultExpandKeys,
        state: store?.state,
        menuOptions,
        onMenuClick,
        onMenuExpandedKeysClick,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.n-menu .n-submenu .n-menu-item-content__icon) {
    font-size: 16px !important;
  }
  :deep(.n-menu .n-menu-item-content .n-menu-item-content__icon) {
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
  .scrollbar {
    height: calc(100vh - #{$logoHeight}) !important;
  }
  .collpase-wrapper {
    position: absolute;
    right: 5%;
    bottom: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--primary-color);
    border-radius: 50%;
    width: 30px;
    height: 29px;
    z-index: 9;
  }
</style>
