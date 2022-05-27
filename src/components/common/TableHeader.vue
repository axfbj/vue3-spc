<template>
  <div id="tableHeaderContainer" class="relative">
    <n-card
      :bordered="false"
      :content-style="{ padding: '0 0 5px 0' }"
      header-style="font-size: 16px; padding: 5px; border-radius: 0"
    >
      <n-card
        v-if="showFilter"
        class="search-content-container"
        :title="title"
        :bordered="false"
        :content-style="{ padding: '0', display: 'flex' }"
        header-style="font-size: 16px; padding: 5px 5px 20px 5px; border-radius: 0"
      >
        <div class="search-content-wrapper">
          <slot name="search-content"></slot>
        </div>
        <div class="divider-line"></div>
        <div class="search-content-action-wrapper">
          <n-button type="warning" size="small" @click="doResetSearch">重置</n-button>
          <n-button type="primary" size="small" @click="doSearch">搜索</n-button>
        </div>
      </n-card>
      <div class="flex justify-between">
        <slot name="actions"></slot>
        <div class="flex-1"></div>
        <slot name="table-config"></slot>
        <!-- <n-tooltip trigger="hover" v-if="showFilter">
          <template #trigger>
            <n-button
              class="ml-2"
              type="warning"
              size="small"
              circle
              @click="showSearchContent = !showSearchContent"
            >
              <template #icon>
                <n-icon>
                  <FilterIcon />
                </n-icon>
              </template>
            </n-button>
          </template>
          展开查询条件
        </n-tooltip> -->
      </div>
    </n-card>
  </div>
  <!-- <n-drawer
    v-model:show="showSearchContent"
    placement="top"
    :to="target"
    :height="searchContentHeight"
  >
    <n-drawer-content
      body-content-style="overflow: hidden"
      title="搜索条件"
      closable
      header-style="font-size: 16px; padding: 15px"
    >
      <template #default>
        <slot name="search-content"></slot>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <n-space>
            <n-button type="warning" size="small" @click="doResetSearch">重置</n-button>
            <n-button type="primary" size="small" @click="doSearch">搜索</n-button>
          </n-space>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer> -->
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue'

  export default defineComponent({
    name: 'TableHeader',
    props: {
      title: {
        type: String,
        default: '查询表格',
      },
      showFilter: {
        type: Boolean,
        default: true,
      },
      searchContentHeight: {
        type: String,
        default: '300px',
      },
    },
    emits: ['search', 'reset-search'],
    setup(props, { emit }) {
      const showSearchContent = ref(false)
      const target = ref<HTMLElement | null>(null)
      onMounted(() => {
        nextTick(() => {
          target.value = document.getElementById('tableHeaderContainer')
        })
      })
      function doSearch() {
        showSearchContent.value = false
        emit('search')
      }
      function doResetSearch() {
        emit('reset-search')
      }
      return {
        showSearchContent,
        target,
        doSearch,
        doResetSearch,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .search-content-container {
    &::after {
      content: '';
      height: 1px;
      width: 100%;
      background-color: var(--border-color);
      margin: 10px 0;
    }
    .search-content-wrapper {
      flex: 1;
    }
    .divider-line {
      border-right: 1px solid var(--border-color);
      height: 40px;
      margin: 0 1%;
    }
    .search-content-action-wrapper {
      display: flex;
      padding: 0 1%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .n-button + .n-button {
        margin-top: 10px;
      }
    }
  }
</style>
