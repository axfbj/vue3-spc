<template>
  <div class="logo-wrapper">
    <img v-if="showLogo" class="logo-img" src="../../assets/logo.png" />
    <div
      v-if="showTitle"
      class="logo-title-wrapper"
      :class="[!state.isCollapse || alwaysShow ? 'show-title' : 'close-title']"
    >
      <span class="logo-title">{{ projectName }}</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue'
  import { useLayoutStore } from '../../components/index'
  import { projectName } from '../../setting'
  export default defineComponent({
    name: 'Logo',
    props: {
      showTitle: {
        type: Boolean,
        default: true,
      },
      showLogo: {
        type: Boolean,
        default: true,
      },
      alwaysShow: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const store = useLayoutStore()
      const titleColor = computed(() => {
        if (store.state.theme === 'dark') {
          return '#ffffff'
        } else {
          if (store.state.layoutMode === 'ttb' || store.state.layoutMode === 'tlr') {
            return '3333333'
          }
          const sideBg = store.state.sideBarBgColor
          switch (sideBg) {
            case 'dark':
              return '#ffffff'
            case 'image':
              return '#ffffff'
            case 'white':
              return '#333333'
            case 'blue':
              return '#ffffff'
          }
          return '#ffffff'
        }
      })
      return {
        state: store?.state,
        projectName,
        titleColor,
      }
    },
  })
</script>
<style lang="scss" scoped>
  @import '../../assets/styles/variables.scss';
  .logo-wrapper {
    height: $logoHeight;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px dashed var(--border-color);
    .logo-img {
      width: 32px;
      height: 32px;
    }
    .logo-title {
      font-weight: bold;
      color: v-bind(titleColor);
    }
    .logo-img + .logo-title-wrapper {
      margin-left: 10px;
    }
    .show-title {
      transform: scale(1);
      width: auto;
      transition: transform 0.2s ease-in;
    }
    .close-title {
      transform: scale(0);
      width: 0;
    }
  }
</style>
