<template>
  <div class="main-container">
    <TableBody>
      <template #header>
        <TableHeader :show-filter="false">
          <template #actions>
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
    <ModalDialog ref="modalDialogRef" @confirm="onDataFormConfirm">
      <template #content>
        <DataForm ref="dataFormRef" :options="formItems" />
      </template>
    </ModalDialog>
    <ModalDialog
      ref="menuModalDialogRef"
      title="菜单权限"
      contentHeight="40vh"
      @confirm="onMenuCheckedConfirm"
    >
      <template #content>
        <n-tree
          :data="allMenu"
          checkable
          block-line
          cascade
          default-expand-all
          v-model:checked-keys="defaultCheckedKeys"
        />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
  import { post } from '@/api/http'
  import { getMenuListByRoleId, getRoleList } from '@/api/url'
  import { useMenuList } from '@/hooks/api'
  import {
    TableActionModel,
    useRenderAction,
    useRowKey,
    useTable,
    useTableColumn,
  } from '@/hooks/table'
  import useButtonStore from '@/store/modules/buttons'
  import { DataFormType, ModalDialogType, FormItem } from '@/types/components'
  import { DataTableColumn, NInput, TreeOption, useDialog, useMessage } from 'naive-ui'
  import { defineComponent, h, nextTick, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  const ROLE_CODE_FLAG = 'ROLE_'
  const formItems = [
    {
      label: '角色名称',
      type: 'input',
      key: 'name',
      value: ref(null),
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入角色名称')
          return false
        }
        return true
      },
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          placeholder: '请输入角色名称',
        })
      },
    },
    {
      label: '角色编码',
      key: 'roleCode',
      value: ref(null),
      maxLength: 20,
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入角色编码')
          return false
        }
        return true
      },
      render: (formItem) => {
        return h(
          NInput,
          {
            value: formItem.value.value,
            onUpdateValue: (val) => {
              formItem.value.value = val
            },
            placeholder: '请输入角色编码',
          },
          {
            prefix: () => h('div', ROLE_CODE_FLAG),
          }
        )
      },
    },
    {
      label: '角色描述',
      key: 'description',
      value: ref(null),
      maxLength: 50,
      inputType: 'text',
      validator: (formItem, message) => {
        if (!formItem.value.value) {
          message.error('请输入角色名称')
          return false
        }
        return true
      },
      render: (formItem) => {
        return h(NInput, {
          value: formItem.value.value,
          onUpdateValue: (val) => {
            formItem.value.value = val
          },
          placeholder: '请输入角色描述',
          type: 'textarea',
          rows: 3,
        })
      },
    },
  ] as FormItem[]
  function handleMenuData(menuData: Array<any>) {
    const tempMenus = [] as Array<TreeOption>
    menuData.forEach((it) => {
      const tempMenu = {} as TreeOption
      tempMenu.key = it.menuUrl
      tempMenu.label = it.menuName
      if (it.children) {
        tempMenu.children = handleMenuData(it.children)
      }
      tempMenus.push(tempMenu)
    })
    return tempMenus
  }
  export default defineComponent({
    name: 'Role',
    setup() {
      const modalDialogRef = ref<ModalDialogType | null>(null)
      const dataFormRef = ref<DataFormType | null>(null)
      const menuModalDialogRef = ref<ModalDialogType | null>(null)
      const table = useTable()
      const rowKey = useRowKey('id')
      const naiveDialog = useDialog()
      const message = useMessage()
      const allMenu = ref<Array<any>>([])
      const buttonStore = useButtonStore()
      const route = useRoute()
      const buttonModel = buttonStore.getButtonListByPlacement(route.path)
      const tableColumns = useTableColumn(
        [
          table.selectionColumn,
          table.indexColumn,
          {
            title: '角色名称',
            key: 'name',
          },
          {
            title: '角色编号',
            key: 'roleCode',
          },
          {
            title: '角色描述',
            key: 'description',
          },
          {
            title: '创建时间',
            key: 'createTime',
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
                  onClick: () => {
                    switch (it.code) {
                      case 'update':
                        onUpdateItem(rowData)
                        break
                      case 'delete':
                        onDeleteItem(rowData)
                        break
                      case 'menu':
                        onShowMenu(rowData)
                        break
                    }
                  },
                  type: it.type,
                } as TableActionModel
              }) || []
            )
          },
        })
      const defaultCheckedKeys = ref<Array<string>>([])
      function doRefresh() {
        post({
          url: getRoleList,
          data: {},
        })
          .then(table.handleSuccess)
          .catch(console.log)
      }
      function onAddItem() {
        modalDialogRef.value?.toggle()
        nextTick(() => {
          dataFormRef.value?.reset()
        })
      }
      function onUpdateItem(item: any) {
        modalDialogRef.value?.toggle()
        nextTick(() => {
          formItems.forEach((it) => {
            const key = it.key
            const propName = item[key]
            if (propName) {
              if (it.key === 'roleCode') {
                it.value.value = propName.replace(ROLE_CODE_FLAG, '')
              } else {
                it.value.value = propName
              }
            }
          })
        })
      }
      function onDeleteItem(data: any) {
        naiveDialog.warning({
          title: '提示',
          content: '是否要删除此菜单？',
          positiveText: '删除',
          onPositiveClick: () => {
            message.success('模拟菜单删除成功，参数为' + JSON.stringify(data))
          },
        })
      }
      function onDataFormConfirm() {
        if (dataFormRef.value?.validator()) {
          modalDialogRef.value?.toggle()
          naiveDialog.success({
            title: '提示',
            positiveText: '确定',
            content:
              '模拟菜单添加成功，参数为：' + JSON.stringify(dataFormRef.value.generatorParams()),
          })
        }
      }
      function onShowMenu(item: any) {
        post({
          url: getMenuListByRoleId,
          data: {
            roleId: item.id,
          },
        })
          .then((res) => {
            defaultCheckedKeys.value = []
            transformMenuUrl(res.data)
            menuModalDialogRef.value?.toggle()
          })
          .catch(console.log)
      }
      function transformMenuUrl(menu: Array<any>) {
        for (let index = 0; index < menu.length; index++) {
          const item = menu[index]
          defaultCheckedKeys.value.push(item.menuUrl)
          if (item.children) {
            transformMenuUrl(item.children)
          }
        }
      }
      function onMenuCheckedConfirm() {
        message.success('模拟菜单权限成功，参数为' + JSON.stringify(defaultCheckedKeys.value))
        menuModalDialogRef.value?.toggle()
      }
      function onPermissionButtonClick(btnCode: string) {
        switch (btnCode) {
          case 'add':
            onAddItem()
            break
        }
      }
      onMounted(async () => {
        const data = await useMenuList()
        allMenu.value = handleMenuData(data)
        doRefresh()
      })
      return {
        topButtons: buttonModel.top,
        modalDialogRef,
        menuModalDialogRef,
        dataFormRef,
        rowKey,
        allMenu,
        tableColumns,
        formItems,
        defaultCheckedKeys,
        ...table,
        onAddItem,
        onDataFormConfirm,
        onMenuCheckedConfirm,
        onPermissionButtonClick,
      }
    },
  })
</script>
