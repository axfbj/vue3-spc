<template>
  <n-space align="center">
    <n-tooltip class="item" trigger="hover" placement="top">
      刷新页面
      <template #trigger>
        <n-button circle type="warning" size="small" @click="doRefresh">
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
        </n-button>
      </template>
    </n-tooltip>
    <SortableTable
      v-if="columns && columns.length > 0"
      class="ml-4"
      :columns="columns"
      @update="onUpdateTable"
    />
    <n-tooltip class="item" trigger="hover" placement="top">
      设置表格边框
      <template #trigger>
        <n-button circle :type="border ? 'primary' : 'default'" size="small" @click="updateBorder">
          B
        </n-button>
      </template>
    </n-tooltip>
    <n-tooltip class="item" trigger="hover" placement="top">
      设置斑马纹
      <template #trigger>
        <n-button
          circle
          :type="striped ? 'primary' : 'default'"
          size="small"
          @click="updateStriped"
        >
          S
        </n-button>
      </template>
    </n-tooltip>
  </n-space>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref } from 'vue'
  import { RefreshOutline as RefreshIcon } from '@vicons/ionicons5'
  import { TablePropsType } from '@/types/components'

  export default defineComponent({
    name: 'TableConfig',
    components: { RefreshIcon },
    props: {
      columns: {
        type: Array as PropType<TablePropsType[]>,
        default: () => [],
      },
    },
    emits: ['refresh', 'update-border', 'update-striped', 'onUpdateTable'],
    setup(props, { emit }) {
      function doRefresh() {
        emit('refresh')
      }
      const border = ref(false)
      const striped = ref(false)
      function updateBorder() {
        border.value = !border.value
        emit('update-border', border.value)
      }
      function updateStriped() {
        striped.value = !striped.value
        emit('update-striped', striped.value)
      }
      function onUpdateTable(newColumns: Array<TablePropsType>) {
        emit('onUpdateTable', newColumns)
      }
      return {
        border,
        striped,
        doRefresh,
        updateBorder,
        updateStriped,
        onUpdateTable,
      }
    },
  })
</script>
