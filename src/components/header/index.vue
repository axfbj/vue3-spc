<template>
  <div class="vaw-header-layout">
    <div class="logo-wrapper">
      <Logo :always-show="true" />
    </div>
    <div class="menu-wrapper">
      <ScrollerMenu v-if="state.layoutMode === 'ttb'" :routes="routes" mode="horizontal" />
      <HorizontalScrollerMenu
        :routes="routes"
        v-if="state.layoutMode === 'tlr'"
        @menu-update="onMenuUpdate"
      />
    </div>
    <div v-if="state.device !== 'mobile'" class="right-wrapper">
      <ActionItems />
    </div>
    <div class="avatar-wrapper">
      <VAWAvatar />
    </div>
  </div>
</template>

<script lang="ts">
  import { RouteRecordRawWithHidden } from '@/types/store'
  import { defineComponent, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLayoutStore } from '../../components/index'
  export default defineComponent({
    name: 'VAWHeader',
    setup() {
      const store = useLayoutStore()
      const router = useRouter()
      const permissionRoutes = store?.state.permissionRoutes.filter((it) => !!it.name)
      const routes = computed(() => {
        if (store.state.layoutMode === 'ttb') {
          return permissionRoutes
        } else {
          return permissionRoutes.map((it) => {
            return {
              fullPath: it.fullPath,
              hidden: it.hidden,
              meta: it.meta,
              name: it.name,
              path: it.path,
            }
          })
        }
      })
      function onMenuUpdate({ path, type }: any) {
        store.state.currentRoutes = permissionRoutes.find((it) => {
          return it.path === path
        })?.children
        if (type === 'click') {
          const firstPath = findFirstPath(store.state.currentRoutes!)
          if (firstPath) {
            router.push(firstPath)
          }
        }
      }
      function findFirstPath(routes: Array<RouteRecordRawWithHidden>): string {
        const length = routes.length || 0
        let path = ''
        for (let i = 0; i < length; i++) {
          if (routes[i].children && routes[i].children!.length > 0) {
            return findFirstPath(routes[i].children!)
          } else {
            path = routes[i].fullPath!
            break
          }
        }
        return path
      }
      return {
        state: store?.state,
        routes,
        onMenuUpdate,
      }
    },
  })
</script>

<style scoped lang="scss">
  @import '../../assets/styles/variables.scss';
  :deep(.n-menu .n-menu-item-content .n-menu-item-content-header) {
    overflow: inherit;
  }
  :deep(.n-menu.n-menu--horizontal) {
    align-items: center;
  }
  .vaw-header-layout {
    height: $logoHeight;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid var(--border-color);
    .logo-wrapper {
      width: $menuWidth;
    }
    .menu-wrapper {
      flex: 1;
      overflow: hidden;
      margin: 0 50px 0 10px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -5px;
        bottom: 0;
        width: 5px;
        box-shadow: 5px 0 15px #eeeeee;
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: -5px;
        bottom: 0;
        width: 5px;
        transform: rotate(180deg);
        box-shadow: 5px 0 15px #eeeeee;
      }
    }
    .right-wrapper {
      height: 100%;
    }
    .avatar-wrapper {
      padding-right: 15px;
    }
  }
</style>
