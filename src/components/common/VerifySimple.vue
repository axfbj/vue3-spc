<template>
  <div class="vaw-verify-container" ref="container">
    <div
      class="drag-bg"
      :class="{ 'reset-width-anim': resetStatus }"
      :style="{ width: lockStyle.left + 'px' }"
    ></div>
    <span
      ref="lockBtn"
      class="lock-btn iconfont"
      :class="{ 'reset-left-anim': resetStatus }"
      :style="{
        left: lockStyle.left + 'px',
        color: verifySuccess ? '#7ac23c' : '737383',
        'font-size': verifySuccess ? '20px' : '26px',
      }"
      @touchstart="onMouseDown"
      @mousedown="onMouseDown"
    >
      <n-icon size="22">
        <MenuOutline v-if="!verifySuccess" />
        <CheckmarkCircleOutline v-else />
      </n-icon>
    </span>
    <div
      class="text-tip"
      :class="{ 'mask-slide': !verifySuccess }"
      :style="{ color: verifySuccess ? '#ffffff' : '#333333' }"
      >{{ textTip }}
    </div>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent, onMounted, onBeforeMount } from 'vue'
  import { MenuOutline, CheckmarkCircleOutline } from '@vicons/ionicons5'
  export default defineComponent({
    name: 'VawVerifySimple',
    components: {
      MenuOutline,
      CheckmarkCircleOutline,
    },
    emits: ['verify-fail', 'verify-success'],
    setup(props, { emit, expose }) {
      const lockStyle = ref({ left: 0 })
      const maxWidth = ref(0)
      const startX = ref(0)
      const endX = ref(0)
      const resetStatus = ref(false)
      const verifySuccess = ref(false)
      const canMove = ref(false)
      const textTip = ref('请按住滑块，拖动到最右边')

      const container = ref()
      const lockBtn = ref()

      function onMouseDown(e: any) {
        if (verifySuccess.value) return
        e.preventDefault()
        resetStatus.value = false
        startX.value = e.clientX || e.changedTouches[0].clientX
        canMove.value = true
      }
      function onMouseMove(e: any) {
        if (!canMove.value || verifySuccess.value) return
        endX.value = e.clientX || e.changedTouches[0].clientX
        const x = (endX.value || e.changedTouches[0].clientX) - startX.value
        lockStyle.value.left = Math.max(0, Math.min(x, maxWidth.value))
        if (lockStyle.value.left >= maxWidth.value) {
          handleSuccess()
        }
      }
      function onMouseUp() {
        if (verifySuccess.value) return
        emit('verify-fail')
        canMove.value = false
        resetStatus.value = true
        lockStyle.value.left = 0
      }
      function handleSuccess() {
        verifySuccess.value = true
        textTip.value = '验证通过'
        removeEventListener()
        emit('verify-success')
      }
      function reset() {
        addEventListener()
        resetStatus.value = true
        verifySuccess.value = false
        canMove.value = false
        textTip.value = '请按住滑块，拖动到最右边'
        lockStyle.value.left = 0
      }
      function addEventListener() {
        document.getElementsByTagName('html')[0].addEventListener('mousemove', onMouseMove)
        document.getElementsByTagName('html')[0].addEventListener('mouseup', onMouseUp)
        document.getElementsByTagName('html')[0].addEventListener('touchmove', onMouseMove)
        document.getElementsByTagName('html')[0].addEventListener('touchend', onMouseUp)
      }
      function removeEventListener() {
        document.getElementsByTagName('html')[0].removeEventListener('mousemove', onMouseMove)
        document.getElementsByTagName('html')[0].removeEventListener('mouseup', onMouseUp)
        document.getElementsByTagName('html')[0].removeEventListener('touchmove', onMouseMove)
        document.getElementsByTagName('html')[0].removeEventListener('touchend', onMouseUp)
      }
      onMounted(() => {
        maxWidth.value = container.value.clientWidth - lockBtn.value.clientWidth
        addEventListener()
      })
      onBeforeMount(() => {
        removeEventListener()
      })
      expose({
        reset,
      })
      return {
        container,
        lockBtn,
        lockStyle,
        maxWidth,
        startX,
        endX,
        resetStatus,
        verifySuccess,
        canMove,
        textTip,
        onMouseDown,
      }
    },
  })
</script>

<style>
  @keyframes masked-animation {
    0% {
      background-position: 400% 0;
    }
    100% {
      background-position: -400% 0;
    }
  }
</style>

<style scoped>
  .vaw-verify-container {
    position: relative;
    width: 100%;
    height: 32px;
    background-color: #e8e8e8;
  }
  .lock-btn {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    background-color: #ffffff;
    box-sizing: border-box;
    border: 1px solid #e8e8e8;
    height: 100%;
    width: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    color: #737383;
    cursor: move;
    z-index: 9;
  }
  .reset-left-anim {
    left: 0;
    transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .reset-width-anim {
    width: 0;
    transition: width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .drag-bg {
    width: 0;
    height: 100%;
    background-color: #7ac23c;
  }
  .text-tip {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #333333;
    font-size: 12px;
    line-height: 32px;
    font-weight: bold;
  }
  .mask-slide {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(0, #4d4d4d),
      color-stop(0.4, #4d4d4d),
      color-stop(0.5, #fff),
      color-stop(0.6, #4d4d4d),
      color-stop(1, #4d4d4d)
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 10s infinite linear;
  }
</style>
