<template>
  <n-config-provider :theme-overrides="themeOverThemes">
    <n-card
      class="vaw-side-bar-wrapper"
      :bordered="false"
      :style="{
        borderRadius: '0px',
        marginTop: state.layoutMode === 'ttb' || state.layoutMode === 'tlr' ? '48px' : 0,
        paddingTop: state.layoutMode === 'tlr' ? '10px' : 0,
      }"
      :content-style="{ padding: 0 }"
      :class="[
        !state.isCollapse ? 'open-status' : 'close-status',
        state.sideBarBgColor === 'image' ? 'sidebar-bg-img' : '',
      ]"
    >
      <transition name="logo">
        <Logo v-if="showLogo" />
      </transition>
      <ScrollerMenu :routes="state.layoutMode === 'tlr' ? tlrModeRoutes : routes" />
      <div class="mobile-shadow"></div>
    </n-card>
  </n-config-provider>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useLayoutStore } from '../../components/index'
  import { SideTheme, ThemeMode } from '../../types/store'
  export default defineComponent({
    name: 'SideBar',
    props: {
      showLogo: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const store = useLayoutStore()
      const routes = computed(() => {
        return store?.state.permissionRoutes.filter((it) => !!it.name)
      })
      const tlrModeRoutes = computed(() => {
        return store.state.currentRoutes
      })
      const menuVars = computed(() => {
        return store?.state.sideBarCheckedEffect === 'clear'
          ? {
              itemTextColorChildActive: '#ffffff',
              itemIconColorChildActive: '#ffffff',

              arrowColorChildActive: '#ffffff',
              arrowColorHover: '#ffffff',

              itemTextColorActive: '#ffffff',
              itemIconColorActive: '#ffffff',

              itemTextColorHover: '#ffffff',
              itemIconColorHover: '#ffffff',

              itemColorActive: 'var(--primary-color)',
            }
          : {}
      })
      const themeOverThemes = computed(() => {
        if (store?.state.theme === ThemeMode.DARK) {
          return {}
        }
        if (store?.state.sideBarBgColor === SideTheme.DARK)
          return {
            common: {
              cardColor: '#001428',
              textColor1: '#bbbbbb',
              textColor2: '#bbbbbb',
              popoverColor: 'rgb(72, 72, 78)',
              hoverColor: 'rgba(255, 255, 255, 0.09)',
              itemColorActive: 'rgba(24, 160, 88, 0.4)',
            },
            Menu: menuVars.value,
          }
        if (store?.state.sideBarBgColor === SideTheme.BLUE)
          return {
            common: {
              cardColor: '#047fff',
              textColor1: '#dddddd',
              textColor2: '#dddddd',
              primaryColor: '#fff',
              hoverColor: '#1b71cb',
              popoverColor: '#047fff',
              itemColorActive: '#ffffff',
            },
            Menu: {
              itemIconColorHover: '#cdcdcd',
              itemTextColorHover: '#cdcdcd',
              itemIconColorChildActive: '#fff',
            },
          }
        if (store?.state.sideBarBgColor === SideTheme.WHITE)
          return { common: { cardColor: '#ffffff' } }
        if (store?.state.sideBarBgColor === SideTheme.IMAGE)
          return {
            common: {
              textColor1: '#bbbbbb',
              textColor2: '#bbbbbb',
              hoverColor: 'rgba(255, 255, 255, 0.09)',
              popoverColor: 'rgb(72, 72, 78)',
            },
          }
        return {}
      })
      return {
        state: store?.state,
        routes,
        tlrModeRoutes,
        themeOverThemes,
      }
    },
  })
</script>

<style scoped lang="scss">
  @import '../../assets/styles/variables.scss';
  .sidebar-bg-img {
    background-image: url('../../assets/bg_img.webp') !important;
    background-size: cover;
  }
  .open-status {
    width: $menuWidth;
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.12);
    transition: all $transitionTime;
  }
  .close-status {
    width: $minMenuWidth;
    box-shadow: none;
    transition: all $transitionTime;
  }
  .vaw-side-bar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    overflow-x: hidden;
    height: 100%;
    box-sizing: border-box;
    z-index: 999;
    .vaw-menu-wrapper {
      overflow-x: hidden;
      color: white;
    }
  }
  .is-mobile {
    .open-status {
      width: $menuWidth;
      transform: translateX(0);
      transition: transform $transitionTime;
    }
    .close-status {
      width: $menuWidth;
      $negativeMenuWidth: calc(#{$menuWidth} * -1);
      transform: translateX($negativeMenuWidth);
      transition: transform $transitionTime;
      box-shadow: none;
    }
  }
</style>
