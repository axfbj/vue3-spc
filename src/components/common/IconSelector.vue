<template>
  <n-popover trigger="click" placement="bottom" width="400">
    <template #trigger>
      <n-button>
        <template #icon v-if="selectItem">
          <n-icon size="20">
            <component :is="selectItem" />
          </n-icon>
        </template>
        {{ selectItem }}
      </n-button>
    </template>
    <n-scrollbar class="grid-wrapper">
      <n-grid :cols="3" style="height: 300px">
        <n-grid-item v-for="item of icons" :key="item">
          <div
            class="flex flex-col items-center justify-center p-2 icon-wrapper"
            @click="onIconClick(item)"
          >
            <n-icon size="20">
              <component :is="item" />
            </n-icon>
            <n-ellipsis :line-clamp="1" :style="{ fontSize: '12px', marginTop: '10px' }">
              {{ item }}
            </n-ellipsis>
          </div>
        </n-grid-item>
      </n-grid>
    </n-scrollbar>
    <div class="flex justify-end mt-2 mb-2">
      <n-pagination
        :page="currentPage"
        :page-size="pageSize"
        :page-slot="5"
        :item-count="itemCount"
        @update-page="onUpdatePage"
      />
    </div>
  </n-popover>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, shallowReactive, toRef, unref } from 'vue'
  import * as xicons from '@vicons/ionicons5'
  const xiconsKeys = Object.keys(xicons)

  export default defineComponent({
    name: 'IconSelector',
    components: xicons,
    props: {
      value: String,
      onUpdateIcon: Function,
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      const value = toRef(props, 'value')
      const pageSize = 40
      const icons = shallowReactive(xiconsKeys.slice(0, 40))
      const currentPage = ref(1)
      const itemCount = computed(() => xiconsKeys.length)
      const selectItem = computed({
        get: () => unref(value) || '选择图标',
        set: (val) => {
          return val
        },
      })
      function onUpdatePage(page: number) {
        currentPage.value = page
        icons.length = 0
        const start = (currentPage.value - 1) * pageSize
        icons.push(...xiconsKeys.slice(start, start + pageSize))
      }
      function onIconClick(item: string) {
        selectItem.value = item
        emit('update:value', item)
      }
      return {
        icons,
        selectItem,
        currentPage,
        pageSize,
        itemCount,
        onUpdatePage,
        onIconClick,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .grid-wrapper {
    .icon-wrapper {
      cursor: pointer;
      border: 1px solid #f5f5f5;
    }
  }
</style>
