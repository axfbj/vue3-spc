<template>
  <n-config-provider
    :theme-overrides="state.themeOverrides"
    :theme="state.theme === 'dark' ? darkTheme : null"
    :locale="zhCN"
    style="height: 100%"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-element
          class="vaw-layout-container"
          :class="[state.device === 'mobile' && 'is-mobile', state.theme]"
        >
          <div
            v-if="state.device === 'mobile'"
            class="mobile-shadow"
            :class="[state.isCollapse ? 'close-shadow' : 'show-shadow']"
            @click="closeMenu"
          ></div>
          <template v-if="state.device === 'mobile'">
            <SideBar />
            <MainLayout />
          </template>
          <template v-else>
            <template v-if="state.layoutMode === 'ttb'">
              <VAWHeader />
              <MainLayout :show-nav-bar="false" />
            </template>
            <template v-else-if="state.layoutMode === 'ltr'">
              <SideBar />
              <MainLayout />
            </template>
            <template v-else-if="state.layoutMode === 'lcr'">
              <TabSplitSideBar />
              <MainLayout />
            </template>
            <template v-else-if="state.layoutMode === 'tlr'">
              <VAWHeader />
              <SideBar :showLogo="false" />
              <MainLayout :show-nav-bar="false" />
            </template>
          </template>
        </n-element>
        <WaterMark />
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts">
  import UserTokenExpiredInterceptor from '@/api/interceptors/UserTokenExpiredInterceptor'
  import { AxiosResponse } from 'axios'
  import { darkTheme, useMessage, zhCN } from 'naive-ui'
  import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue'
  import { DeviceType, LayoutMode } from '../types/store'
  import { useLayoutStore } from './index'
  import useAxios from '@/hooks/useAxios'
  export default defineComponent({
    name: 'Layout',
    setup() {
      const store = useLayoutStore()
      const isShowHeader = computed(() => store?.isShowHeader())
      const axios = useAxios()
      const message = useMessage()
      axios.interceptors.response.use((response: AxiosResponse): AxiosResponse => {
        return UserTokenExpiredInterceptor(response, store, message)
      })
      onMounted(() => {
        handleScreenResize()
        window.addEventListener('resize', handleScreenResize)
      })
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleScreenResize)
      })
      function handleScreenResize() {
        const width = document.body.clientWidth
        if (width <= 768) {
          store?.changeDevice(DeviceType.MOBILE)
          store?.toggleCollapse(true)
          store.changeLayoutMode(LayoutMode.LTR)
        } else if (width < 992 && width > 768) {
          store?.changeDevice(DeviceType.PAD)
          store?.toggleCollapse(true)
          store.changeLayoutMode(LayoutMode.LTR)
        } else if (width < 1200 && width >= 992) {
          store?.changeDevice(DeviceType.PC)
          store?.toggleCollapse(false)
        } else {
          store?.changeDevice(DeviceType.PC)
          store?.toggleCollapse(false)
        }
      }
      function closeMenu() {
        store?.toggleCollapse(true)
      }
      return {
        state: store?.state,
        darkTheme,
        zhCN,
        isShowHeader,
        closeMenu,
      }
    },
  })
</script>

<style lang="scss">
  @import '../assets/styles/variables.scss';
  .vaw-layout-container {
    height: 100%;
    max-width: 100%;
    overflow-x: hidden;
    .mobile-shadow {
      display: none;
    }
    .layout-mode-ttb {
      margin-top: $logoHeight;
      transition: all $transitionTime;
    }
  }
  .is-mobile {
    .mobile-shadow {
      background-color: #000000;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 997;
    }
    .close-shadow {
      display: none;
    }
    .show-shadow {
      display: block;
      opacity: 0.5;
      transition: all $transitionTime;
    }
  }
</style>
