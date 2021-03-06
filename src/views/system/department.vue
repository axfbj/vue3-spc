<template>
  <div class="main-container">
    <TableBody>
      <template #header>
        <TableHeader :show-filter="false">
          <template #actions>
            <!-- <AddButton @add="onAddItem" /> -->
            <PermissionButtons :buttons="topButtons" @click="onPermissionButtonClick" />
          </template>
        </TableHeader>
      </template>
      <template #default>
        <n-data-table
          :loading="tableLoading"
          :data="dataList"
          :columns="tableColumns"
          :row-key="rowKey"
        />
      </template>
    </TableBody>
    <ModalDialog ref="modalDialog" @confirm="onDataFormConfirm">
      <template #content>
        <DataForm ref="itemDataFormRef" :options="itemFormOptions" />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
  import { getDepartmentList } from '@/api/url'
  import { TableActionModel, useTable, useRenderAction, useTableColumn } from '@/hooks/table'
  import { defineComponent, h, nextTick, onMounted, ref, shallowReactive } from 'vue'
  import _ from 'lodash'
  import {
    DataTableColumn,
    NInput,
    NTag,
    NTreeSelect,
    TreeSelectOption,
    useDialog,
    useMessage,
  } from 'naive-ui'
  import { DataFormType, ModalDialogType, FormItem } from '@/types/components'
  import usePost from '@/hooks/usePost'
  import { transformTreeSelect } from '@/utils'
  import useButtonStore from '@/store/modules/buttons'
  import { useRoute } from 'vue-router'
  interface Department {
    parentId: number
    id: number
    name: string
    depCode: string
    order: number
    status: number
    children: Array<Department>
  }
  const DP_CODE_FLAG = 'dp_code_'
  const itemFormOptions = [
    {
      key: 'parentId',
      label: '父级部门',
      value: ref(null),
      optionItems: shallowReactive([] as Array<TreeSelectOption>),
      render: (formItem) => {
        return h(NTreeSelect, {
          value: formItem.value.value,
          onUpdateValue: (val: any) => {
            formItem.value.value = val
          },
          placeholder: '请选择父级部门',
          options: formItem.optionItems as Array<TreeSelectOption>,
        })
      },
    },
    {
      key: 'name',
      label: '部门名称',
      type: 'input',
      value: ref(null),
      required: true,
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (newVal) => {
            formItem.value.value = newVal
          },
          maxlength: 50,
          placeholder: '请输入部门名称',
        })
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入部门名称')
          return false
        }
        return true
      },
    },
    {
      label: '部门编号',
      key: 'depCode',
      value: ref(null),
      required: true,
      render: (formItem) => {
        return h(
          NInput,
          {
            value: formItem.value.value,
            onUpdateValue: (val) => {
              formItem.value.value = val
            },
            placeholder: '请输入部门编号',
          },
          {
            prefix: () => DP_CODE_FLAG,
          }
        )
      },
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入部门编号')
          return false
        }
        return true
      },
    },
  ] as Array<FormItem>
  export default defineComponent({
    name: 'Department',
    setup() {
      const table = useTable()
      const message = useMessage()
      const naiveDailog = useDialog()
      const buttonStore = useButtonStore()
      const route = useRoute()
      const buttonModel = buttonStore.getButtonListByPlacement(route.path)
      const tableColumns = useTableColumn(
        [
          {
            title: '部门名称',
            key: 'name',
          },
          {
            title: '部门编号',
            key: 'depCode',
          },
          {
            title: '排序',
            key: 'order',
          },
          {
            title: '状态',
            key: 'status',
            render: (rowData) => {
              return h(
                NTag,
                {
                  type: !!rowData.status ? 'success' : 'error',
                  size: 'small',
                },
                {
                  default: () => (!!rowData.status ? '正常' : '禁用'),
                }
              )
            },
          },
        ],
        {
          align: 'center',
        } as DataTableColumn
      )
      buttonModel.tableLine &&
        buttonModel.tableLine.length > 0 &&
        tableColumns.push({
          title: '操作',
          key: 'actions',
          align: 'center',
          render: (rowData) => {
            return useRenderAction(
              buttonModel.tableLine?.map((it) => {
                return {
                  label: it.name,
                  // onClick: eval(it.code + `.bind(null,rowData)`),
                  onClick: () => {
                    switch (it.code) {
                      case 'update':
                        onUpdateItem(rowData)
                        break
                      case 'delete':
                        onDeleteItem(rowData)
                        break
                    }
                  },
                  type: it.type,
                } as TableActionModel
              }) || []
            )
          },
        })
      const itemDataFormRef = ref<DataFormType | null>(null)
      const searchDataFormRef = ref<DataFormType | null>(null)
      const modalDialog = ref<ModalDialogType | null>(null)
      const post = usePost()
      function doRefresh() {
        post({
          url: getDepartmentList,
        })
          .then(({ data = [] }) => {
            table.tableLoading.value = false
            table.dataList.length = 0
            table.dataList.push(...data)
            return data
          })
          .then((res) => {
            const parentFormItem = itemFormOptions.find((it) => it.key === 'parentId') as FormItem
            ;(parentFormItem.optionItems as Array<TreeSelectOption>).length = 0
            parentFormItem?.optionItems?.push(...transformTreeSelect(res, 'name', 'id'))
          })
      }
      function filterItems(srcArray: Array<Department>, filterItem: Department) {
        for (let index = 0; index < srcArray.length; index++) {
          const element = srcArray[index]
          if (element.id === filterItem.id) {
            if (!_.isEmpty(element.children)) {
              message.error('当前部门下有子部门，不能删除')
              return
            }
            srcArray.splice(index, 1)
            return
          } else {
            if (!_.isEmpty(element.children)) {
              filterItems(element.children, filterItem)
            }
          }
        }
      }
      const onDeleteItem = (item: any) => {
        naiveDailog.warning({
          title: '提示',
          content: '确定要删除此信息，删除后不可恢复？',
          positiveText: '删除',
          negativeText: '再想想',
          onPositiveClick: () => {
            filterItems(table.dataList, item)
          },
        })
      }
      function onAddItem() {
        itemDataFormRef.value?.reset()
        nextTick(() => {
          modalDialog.value?.toggle()
        })
      }
      function onDataFormConfirm() {
        if (itemDataFormRef.value?.validator()) {
          modalDialog.value?.toggle()
          naiveDailog.success({
            title: '提示',
            positiveText: '确定',
            content:
              '模拟部门添加/编辑成功，数据为：' +
              JSON.stringify(itemDataFormRef.value.generatorParams()),
          })
        }
      }
      function onUpdateItem(item: any) {
        itemFormOptions.forEach((it) => {
          const key = it.key
          const propName = item[key]
          if (propName) {
            if (it.key === 'depCode') {
              it.value.value = propName.replace(DP_CODE_FLAG, '')
            } else {
              it.value.value = propName || ''
            }
          } else {
            it.value.value = ''
          }
        })
        nextTick(() => {
          modalDialog.value?.toggle()
        })
      }
      function rowKey(rowData: any) {
        return rowData.id
      }
      function onPermissionButtonClick(btnCode: string) {
        switch (btnCode) {
          case 'add':
            onAddItem()
            break
        }
      }
      onMounted(() => {
        doRefresh()
      })
      return {
        topButtons: buttonModel.top,
        itemDataFormRef,
        searchDataFormRef,
        onDataFormConfirm,
        tableColumns,
        onUpdateItem,
        ...table,
        onDeleteItem,
        onAddItem,
        onPermissionButtonClick,
        itemFormOptions,
        rowKey,
        modalDialog,
      }
    },
  })
</script>
