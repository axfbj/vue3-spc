<template>
  <span
    class="fold-wrapper iconfont"
    :class="[state.isCollapse ? 'fold-close-status' : 'fold-open-status']"
    @click="toggleFold"
  >
    <SvgIcon name="expand" />
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useLayoutStore } from '../../components/index'
  export default defineComponent({
    name: 'Humburger',
    setup() {
      const store = useLayoutStore()
      function toggleFold() {
        store?.toggleCollapse(!store.state.isCollapse)
      }
      return {
        state: store?.state,
        toggleFold,
      }
    },
  })
</script>

<style lang="scss" scoped>
  @import '../../assets/styles/variables.scss';
  .fold-open-status {
    transform: rotate(180deg);
  }
  .fold-close-status {
    transform: rotate(0);
  }
  .fold-wrapper {
    box-sizing: border-box;
    display: inline-block;
    line-height: $logoHeight;
    text-align: center;
    padding: 0 10px;
    font-size: 22px;
    transition: transform $transitionTime;
    .svg-icon:hover {
      fill: #f5f5f5;
      transform: rotate(180deg);
      transition: transform 0.5s ease;
    }
    .svg-icon {
      fill: #fff;
      transform: rotate(0);
      transition: transform 0.5s ease;
    }
  }
  .fold-wrapper:hover {
    // color: #999999;
    cursor: pointer;
  }
</style>
