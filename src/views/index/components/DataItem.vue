<template>
  <n-card :content-style="{ padding: '10px' }" :header-style="{ padding: '5px' }" :segmented="true">
    <template #header>
      <n-skeleton text v-if="loading" width="60%" />
      <template v-else>
        <div class="flex items-center justify-between">
          <span class="text-sm text-bold">{{ dataModel.title }}</span>
          <SvgIcon style="font-size: 26px" :name="dataModel.iconClass" />
        </div>
      </template>
    </template>
    <n-skeleton text v-if="loading" :repeat="6" />
    <template v-else>
      <div style="height: 130px" class="flex flex-col justify-between overflow-hidden">
        <div>
          <span v-if="prefix">{{ prefix }}</span>
          <span class="text-2xl text-bold">{{ computedNum.toFixed(0) }}</span>
          <span v-if="suffix">{{ suffix }}</span>
        </div>
        <div class="flex flex-col justify-center flex-1">
          <slot name="extra" :extra="dataModel.extra"></slot>
        </div>
        <div class="divide"></div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-grey">{{ dataModel.bottomTitle }}</span>
          <span class="text-sm text-grey">{{ dataModel.totalSum }}</span>
        </div>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts">
  import { defineComponent, nextTick, onMounted, ref } from 'vue'
  import { useTransition } from '@vueuse/core'

  export default defineComponent({
    name: 'DataItem',
    props: {
      dataModel: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    setup(props) {
      const loading = ref(true)
      const num = ref(0)
      const computedNum = useTransition(num, {
        duration: 1000,
      })
      setTimeout(() => {
        loading.value = false
      }, 1000)
      onMounted(() => {
        nextTick(() => {
          setTimeout(() => {
            num.value = Number(props.dataModel.data)
          }, 1000)
        })
      })
      return {
        loading,
        computedNum,
        prefix: props.dataModel.prefix,
        suffix: props.dataModel.suffix,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .divide {
    margin: 10px 0;
    border-bottom: 1px solid #f5f5f5;
  }
</style>
