<template>
  <n-drawer
    v-model:show="opened"
    placement="right"
    :z-index="1000"
    :width="state.device === 'mobile' ? '75%' : '280px'"
    display-directive="show"
    :auto-focus="false"
  >
    <n-drawer-content title="系统设置" closable class="wrapper">
      <n-divider dashed>主题设置</n-divider>
      <n-grid>
        <n-grid-item
          v-for="(item, index) of themeList"
          :key="index"
          :span="12"
          class="example-wrapper"
        >
          <StyleExample
            :checked="item.checked"
            :left-bg="item.leftBg"
            :right-top-bg="item.rightTopBg"
            :right-bottom-bg="item.rightBottomBg"
            :tip-text="item.tipText"
            @click="themeClick(item)"
          />
        </n-grid-item>
      </n-grid>
      <n-divider dashed>侧边栏样式</n-divider>
      <n-grid>
        <n-grid-item
          v-for="(item, index) of sideExampleList"
          :key="index"
          :span="12"
          class="example-wrapper"
        >
          <StyleExample
            :checked="item.checked"
            :left-bg="item.leftBg"
            :right-top-bg="item.rightTopBg"
            :right-bottom-bg="item.rightBottomBg"
            @click="exampleClick(item)"
          />
        </n-grid-item>
      </n-grid>
      <n-divider dashed>布局模式</n-divider>
      <n-grid>
        <n-grid-item
          v-for="(item, index) of layoutExampleList"
          :key="index"
          :span="12"
          class="example-wrapper2"
        >
          <StyleExample
            :checked="item.checked"
            :left-bg="item.leftBg"
            :right-top-bg="item.rightTopBg"
            :right-bottom-bg="item.rightBottomBg"
            :class="[item.class || '']"
            :tip-text="item.tipText"
            @click="layoutExampleClick(item)"
          />
        </n-grid-item>
      </n-grid>
      <n-divider dashed>菜单设置</n-divider>
      <div class="setting-item-wrapper">
        <span style="width: 125px">菜单宽度</span>
        <n-input-number v-model:value="menuWidth" size="small" :min="200" :max="400" :step="10">
          <template #suffix>px</template>
        </n-input-number>
      </div>
      <div class="setting-item-wrapper flex justify-center">
        <span>手风琴模式</span>
        <n-switch
          v-model:value="state.accordionMenu"
          :checked-value="true"
          :unchecked-value="false"
          @update:value="onAccordionMenuChange"
        >
          <template #checked>开启</template>
          <template #unchecked>关闭</template>
        </n-switch>
      </div>
      <div class="setting-item-wrapper flex justify-center">
        <span>选中样式</span>
        <n-switch
          v-model:value="state.sideBarCheckedEffect"
          checked-value="clear"
          unchecked-value="slide"
          @update:value="onSideEffectChange"
        >
          <template #checked>明显</template>
          <template #unchecked>平滑</template>
        </n-switch>
      </div>

      <n-divider dashed>页签显示</n-divider>
      <div class="setting-item-wrapper">
        <span>显示页签</span>
        <n-switch v-model:value="state.isShowTabbar" @update:value="onShowTabbar" />
      </div>
      <n-divider dashed>主题颜色</n-divider>
      <n-space class="colors-wrapper">
        <div
          v-for="(item, index) of primartyColorList"
          :key="index"
          class="color-wrapper"
          :class="{ circle: item.checked }"
          :style="{ backgroundColor: item.value }"
          @click="colorClick(item)"
        ></div>
      </n-space>
      <n-divider dashed>页面切换动画</n-divider>
      <div class="setting-item-wrapper">
        <span style="width: 100px">动画效果</span>
        <n-select
          v-model:value="state.pageAnim"
          :options="animOptions"
          @update:value="onAnimUpdate"
        />
      </div>
      <n-divider dashed>按钮显示</n-divider>
      <div class="setting-item-wrapper">
        <span>固定顶部导航</span>
        <n-switch v-model:value="state.isFixedNavBar" :disabled="state.layoutMode === 'ttb'" />
      </div>
      <div class="setting-item-wrapper">
        <span>搜索</span>
        <n-switch v-model:value="state.actionItem.showSearch" />
      </div>
      <div class="setting-item-wrapper">
        <span>消息</span>
        <n-switch v-model:value="state.actionItem.showMessage" />
      </div>
      <div class="setting-item-wrapper">
        <span>刷新</span>
        <n-switch v-model:value="state.actionItem.showRefresh" />
      </div>
      <div class="setting-item-wrapper">
        <span>全屏</span>
        <n-switch v-model:value="state.actionItem.showFullScreen" />
      </div>
      <n-divider dashed>水印功能</n-divider>
      <div class="setting-item-wrapper">
        <span>开启水印</span>
        <n-switch v-model:value="state.isOpenWaterMark" @update:value="isOpenWater" />
      </div>
      <div class="p-2">
        <div>水印内容</div>
        <n-input
          @update:value="onWaterMarkChange"
          class="mt-1"
          size="small"
          v-model:value="state.waterMark"
        />
      </div>
      <n-divider dashed>颜色模式</n-divider>
      <div class="setting-item-wrapper">
        <span>灰色模式</span>
        <n-switch v-model:value="state.isGray" @update:value="onIsGray" />
      </div>
      <n-divider />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
  import { useLayoutStore } from '../../components/index'
  import { useMessage } from 'naive-ui'
  import { ModalDialogType } from '@/types/components'
  import { useChangeMenuWidth, useMenuWidth } from '@/hooks/useMenuWidth'
  import LeftBg from '@/assets/bg_img.webp'
  export default defineComponent({
    name: 'Setting',
    setup() {
      const appInfoDialog = ref<ModalDialogType | null>()
      const opened = ref(false)
      const store = useLayoutStore()
      const state = store?.state
      const message = useMessage()
      const showContact = ref(false)
      const menuWidth = ref(useMenuWidth())
      const themeList = reactive([
        {
          leftBg: '#ffffff',
          rightTopBg: '#ffffff',
          rightBottomBg: '#f5f5f5',
          checked: false,
          themeId: 'light',
          tipText: '明亮',
        },
        {
          leftBg: '#000000',
          rightTopBg: '#000000',
          rightBottomBg: '#333333',
          checked: false,
          themeId: 'dark',
          tipText: '暗黑',
        },
      ])
      const sideExampleList = reactive([
        {
          leftBg: '#000000',
          rightTopBg: '#ffffff',
          rightBottomBg: '#f5f5f5',
          checked: false,
          themeId: 'dark',
        },
        {
          leftBg: '#ffffff',
          rightTopBg: '#ffffff',
          rightBottomBg: '#f5f5f5',
          checked: false,
          themeId: 'white',
        },
        {
          leftBg: '#047fff',
          rightTopBg: '#ffffff',
          rightBottomBg: '#f5f5f5',
          checked: false,
          themeId: 'blue',
        },
        {
          leftBg: `url(${LeftBg})`,
          rightTopBg: '#ffffff',
          rightBottomBg: '#f5f5f5',
          checked: false,
          themeId: 'image',
        },
      ])
      const layoutExampleList = reactive([
        {
          leftBg: '#000000',
          rightTopBg: '#d4d4d4',
          rightBottomBg: '#d4d4d4',
          checked: true,
          layoutId: 'ltr',
          tipText: '左右',
        },
        {
          leftBg: '#d4d4d4',
          rightTopBg: '#ffffff',
          rightBottomBg: '#d4d4d4',
          checked: false,
          layoutId: 'ttb',
          class: 'extra-class',
          tipText: '上下',
        },
        {
          leftBg: '#000000',
          rightTopBg: '#d4d4d4',
          rightBottomBg: '#d4d4d4',
          checked: false,
          layoutId: 'lcr',
          class: 'extra-class-1',
          tipText: '左右分栏',
        },
        {
          leftBg: '#000000',
          rightTopBg: '#000000',
          rightBottomBg: '#d4d4d4',
          checked: false,
          layoutId: 'tlr',
          tipText: '上下分栏',
        },
      ])
      const primartyColorList = reactive([
        {
          name: 'cyan',
          value: '#18a058',
          checked: true,
        },
        {
          name: 'blue',
          value: '#409eff',
          checked: false,
        },
        {
          name: 'red',
          value: '#F5222D',
          checked: false,
        },
        {
          name: 'purple',
          value: '#722ED1',
          checked: false,
        },
        {
          name: 'ee4f12',
          value: '#ee4f12',
          checked: false,
        },
        {
          name: '0096c7',
          value: '#0096c7',
          checked: false,
        },
        {
          name: 'ff9801',
          value: '#ff9801',
          checked: false,
        },
        {
          name: 'ff3d68',
          value: '#ff3d68',
          checked: false,
        },
        {
          name: '01c1d4',
          value: '#01c1d4',
          checked: false,
        },
        {
          name: '71efa3',
          value: '#71efa3',
          checked: false,
        },
        {
          name: '171010',
          value: '#171010',
          checked: false,
        },
        {
          name: '78dec7',
          value: '#78dec7',
          checked: false,
        },
        {
          name: '1768ac',
          value: '#1768ac',
          checked: false,
        },
        {
          name: '1427df',
          value: '#1427df',
          checked: false,
        },
      ])
      const animOptions = reactive([
        {
          label: '渐隐渐现',
          value: 'opacity',
        },
        {
          label: '左右滑动',
          value: 'fade',
        },
        {
          label: '上下滑动',
          value: 'down',
        },
        {
          label: '缩放效果',
          value: 'scale',
        },
      ])
      onMounted(() => {
        themeList.forEach((it) => {
          it.checked = state?.theme === it.themeId
        })
        sideExampleList.forEach((it) => {
          it.checked = state?.sideBarBgColor === it.themeId
        })
        layoutExampleList.forEach((it) => {
          it.checked = state?.layoutMode === it.layoutId
        })
        primartyColorList.forEach((it) => {
          it.checked = state?.themeOverrides.common.primaryColor === it.value
        })
      })
      function openDrawer() {
        opened.value = true
      }
      function themeClick(item: any) {
        themeList.forEach((it) => {
          it.checked = it === item
        })
        if (item.themeId === 'dark') {
          exampleClick(sideExampleList[0])
        }
        message.success('开启' + (item.themeId === 'dark' ? '暗黑' : '明亮') + '主题')
        store.changeTheme(item.themeId)
      }
      function exampleClick(item: any) {
        if (store?.state.theme === 'dark') {
          message.error('深色模式下不能更改侧边栏颜色')
          return
        }
        sideExampleList.forEach((it) => {
          it.checked = it === item
        })
        message.success('已选择' + item.themeId + '菜单样式')
        store.changeSideBarBgColor(item.themeId)
      }
      function layoutExampleClick(item: any) {
        layoutExampleList.forEach((it) => {
          it.checked = it === item
        })
        message.success('已选择 ' + item.tipText + ' 布局模式')
        store.changeLayoutMode(item.layoutId)
      }
      function colorClick(item: any) {
        primartyColorList.forEach((it) => {
          it.checked = it === item
        })
        message.success('已选择 ' + item.name + ' 主题颜色')
        store.changePrimaryColor(item)
      }
      function isOpenWater(val: boolean) {
        message.success('已选择 ' + (val ? '开启' : '关闭') + ' 水印')
        store.changeOpenWaterMark(val)
      }
      function onIsGray(val: boolean) {
        message.success('已选择 ' + (val ? '开启' : '关闭') + ' 灰色模式')
        store.changeGray(val)
      }
      function onShowTabbar(val: boolean) {
        message.success('已' + (val ? '开启' : '关闭') + '显示标签栏')
        store.changeShowTabbar(val)
      }
      function onWaterMarkChange(val: string) {
        store.setWaterMark(val)
      }
      function openAppInfo() {
        appInfoDialog.value?.toggle()
      }
      function onAnimUpdate(val: any) {
        message.success('已选择 ' + val + ' 切换动画')
        store.changePageAnim(val as string)
      }
      function onSideEffectChange(val: any) {
        message.success('已设置' + val + '效果模式')
        store.changeSideBarCheckedEffect(val)
      }
      function onAccordionMenuChange(val: boolean) {
        message.success('已成功' + (val ? '开启' : '关闭') + '手风琴模式')
        store.changeAccordionMenu(val)
      }
      watch(
        () => menuWidth.value,
        (newVal) => {
          if (state.layoutMode !== 'ttb') {
            useChangeMenuWidth(newVal)
          }
        }
      )
      return {
        appInfoDialog,
        showContact,
        opened,
        themeList,
        sideExampleList,
        layoutExampleList,
        primartyColorList,
        state,
        openDrawer,
        themeClick,
        exampleClick,
        isOpenWater,
        onShowTabbar,
        onSideEffectChange,
        onAccordionMenuChange,
        onWaterMarkChange,
        layoutExampleClick,
        onAnimUpdate,
        colorClick,
        openAppInfo,
        animOptions,
        menuWidth,
        onIsGray,
      }
    },
  })
</script>

<style lang="scss" scoped>
  $width: 60px;
  .set-container {
    position: fixed;
    right: 0;
    top: 0;
    margin-top: calc(50vh - 100px);
    z-index: 999;
    max-width: calc(#{$width} + 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .tip-wrapper {
      width: $width;
      height: $width;
      border-radius: 4px;
      font-size: 10px;
      transition: color 0.15s ease, background-color 0.15s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      & > i {
        font-size: 20px;
        margin-bottom: 8px;
      }
    }
    .tip-wrapper + .tip-wrapper {
      margin-top: 10px;
    }
    .bg1 {
      color: #1bc3bb;
    }
    .bg1:hover {
      background-color: #1bc3bb;
      color: #ffffff;
    }
    .bg2 {
      color: #3698fd;
    }
    .bg2:hover {
      background-color: #3698fd;
      color: #ffffff;
    }
  }
  .wrapper {
    .close-wrapper {
      text-align: right;
      font-size: 20px;
    }
    .colors-wrapper {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .color-wrapper {
        width: 20px;
        height: 20px;
        border-radius: 5px;
        border: 1px solid #c1c1c1;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .circle::after {
        content: '';
        display: block;
        margin: 0 auto;
        margin-top: 25px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgb(3, 190, 50);
        text-align: center;
      }
    }
    .setting-item-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      font-size: 14px;
    }
  }
  .example-wrapper + .example-wrapper {
    margin-bottom: 30px;
  }
  .example-wrapper2 + .example-wrapper2 {
    margin-bottom: 50px;
  }
  .info-key {
    width: 40%;
  }
</style>
