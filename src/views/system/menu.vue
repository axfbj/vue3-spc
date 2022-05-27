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
          :row-key="rowKey"
          :columns="tableColumns"
          :style="{ height: `${tableHeight}px` }"
          :flex-height="true"
        />
      </template>
    </TableBody>
    <ModalDialog ref="modalDialog" @confirm="onConfirm" content-height="50vh">
      <template #content>
        <DataForm ref="dataForm" :options="itemFormOptions" />
      </template>
    </ModalDialog>
    <ModalDialog ref="buttonModalDialog" @confirm="onButtonConfirm" content-height="40vh">
      <template #content>
        <DataForm ref="buttonDataForm" :options="buttonItemFormOptions" />
      </template>
    </ModalDialog>
    <n-drawer
      v-model:show="showButtons"
      display-directive="show"
      width="40%"
      placement="right"
      :auto-focus="false"
    >
      <n-drawer-content title="按钮管理" closable :body-content-style="{ padding: '5px' }">
        <n-data-table
          :loading="tableLoading"
          :data="buttonList"
          :row-key="rowKey"
          :columns="buttonsColumns"
          :bordered="false"
          :style="{ height: `${buttonTableContainerHeight}px` }"
          :flex-height="true"
        >
          <template #empty>
            <n-button size="small" type="primary" @click="onAddButton"> 添加一条 </n-button>
          </template>
        </n-data-table>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts">
  import { defineComponent, h, nextTick, onMounted, ref, Ref } from 'vue'
  import { post } from '@/api/http'
  import { getMenuList } from '@/api/url'
  import {
    TableActionModel,
    useRenderAction,
    useRowKey,
    useTable,
    useTableColumn,
    useTableHeight,
  } from '@/hooks/table'
  import { NBadge, NButton, NIcon, NInput, NTag, useDialog, useMessage } from 'naive-ui'
  import { TableColumn } from 'naive-ui/lib/data-table/src/interface'
  import SvgIcon from '@/components/svg-icon/index.vue'
  import IconSelector from '@/components/common/IconSelector.vue'
  import { DataFormType, ModalDialogType, FormItem } from '@/types/components'
  import {
    renderInput,
    renderRadioButtonGroup,
    renderSelect,
    renderSwitch,
    renderTreeSelect,
  } from '@/hooks/form'
  import { findRouteByUrl, transformTreeSelect } from '@/utils'
  import { useLayoutStore } from '@/components'
  import { useRoleList } from '@/hooks/api'
  import { Type } from 'naive-ui/lib/button/src/interface'
  import useButtonStore from '@/store/modules/buttons'
  import { useRoute } from 'vue-router'
  import * as xicons from '@vicons/ionicons5'

  export default defineComponent({
    name: 'Menu',
    setup() {
      let actionModel = 'add'
      let tempItem: { menuUrl: string } | null = null
      const table = useTable()
      const naiveDialog = useDialog()
      const message = useMessage()
      const layoutStore = useLayoutStore()
      const modalDialog = ref<ModalDialogType | null>(null)
      const dataForm = ref<DataFormType | null>(null)
      const rowKey = useRowKey('menuUrl')
      const showButtons = ref(false)
      const buttonStore = useButtonStore()
      const route = useRoute()
      const buttonModel = buttonStore.getButtonListByPlacement(route.path)
      const tableColumns = useTableColumn(
        [
          {
            title: '菜单名称',
            key: 'menuName',
          },
          {
            title: '菜单地址',
            key: 'menuUrl',
          },
          {
            title: '菜单图标',
            key: 'icon',
            render: (rowData) => {
              if (!rowData.iconPrefix) {
                rowData.iconPrefix = 'xicon'
                rowData.icon = 'MenuOutline'
              }
              return rowData.iconPrefix === 'xicon'
                ? h(NIcon, null, {
                    default: () => {
                      return h((xicons as any)[(rowData.icon ?? 'MenuOutline') as string])
                    },
                  })
                : h(SvgIcon, {
                    prefix: rowData.iconPrefix ? (rowData.iconPrefix as string) : 'svg',
                    name: rowData.icon ? (rowData.icon as string) : 'menu',
                  })
            },
          },
          {
            title: '提示信息',
            key: 'badge',
            render: (rowData) => {
              return rowData.badge
                ? h(NBadge, {
                    value: rowData.badge as string,
                    dot: rowData.badge === 'dot',
                  })
                : h('span', null, { default: () => '--' })
            },
          },
          {
            title: '是否缓存',
            key: 'cacheable',
            render: (rowData) => {
              return h(
                NTag,
                {
                  type: rowData.cacheable ? 'success' : 'error',
                  size: 'small',
                },
                { default: () => (rowData.cacheable ? '是' : '否') }
              )
            },
          },
          {
            title: '是否隐藏',
            key: 'hidden',
            render: (rowData) => {
              return h(
                NTag,
                {
                  type: rowData.hidden ? 'success' : 'error',
                  size: 'small',
                },
                { default: () => (rowData.hidden ? '是' : '否') }
              )
            },
          },
          {
            title: '是否固定标题栏',
            key: 'affix',
            render: (rowData) => {
              return h(
                NTag,
                {
                  type: rowData.hidden ? 'success' : 'error',
                  size: 'small',
                },
                { default: () => (rowData.affix ? '是' : '否') }
              )
            },
          },
        ],
        {
          align: 'center',
        } as TableColumn
      )
      buttonModel.tableLine &&
        buttonModel.tableLine.length > 0 &&
        tableColumns.push({
          title: '操作',
          key: 'actions',
          align: 'center',
          width: 200,
          render: (rowData) => {
            return useRenderAction(
              buttonModel.tableLine?.map((it) => {
                return {
                  label: it.name,
                  disabled: it.code === 'button' && !!rowData.children ? true : false,
                  onClick: () => {
                    switch (it.code) {
                      case 'update':
                        onUpdateItem(rowData)
                        break
                      case 'delete':
                        onDeleteItem(rowData)
                        break
                      case 'button':
                        onShowButtonManage(rowData)
                        break
                    }
                  },
                  type: it.type,
                } as TableActionModel
              }) || []
            )
          },
        })
      // 按钮管理 相关的属性
      const roleList = ref([])
      const buttonModalDialog = ref<ModalDialogType | null>(null)
      const buttonDataForm = ref<DataFormType | null>(null)
      const buttonTableContainerHeight = document.body.clientHeight - 51 - 61 - 10
      const buttonsColumns = useTableColumn(
        [
          {
            title: '按钮名称',
            key: 'buttonName',
            render: (rowData) => {
              return h(
                NButton,
                { size: 'small', type: rowData.type as Type },
                { default: () => rowData.buttonName }
              )
            },
          },
          {
            title: '按钮编码',
            key: 'buttonCode',
          },
          {
            title: '所属角色',
            key: 'roleCode',
            // render: (rowData) => {
            //   return h('div', null, {
            //     default: () =>
            //       !!rowData.role
            //         ? getLabelByValue(roleList.value, rowData.role as number, {
            //             label: 'name',
            //             value: 'id',
            //           })
            //         : '全部',
            //   })
            // },
          },
          {
            title: '展示位置',
            key: 'placement',
          },
          {
            title: '按钮类型',
            key: 'type',
          },
          {
            title: '操作',
            key: 'actions',
            width: 150,
            render: (rowData) => {
              return useRenderAction([
                {
                  label: '添加',
                  type: 'primary',
                  onClick: onAddButton.bind(null, rowData),
                },
                {
                  label: '删除',
                  type: 'error',
                  onClick: onDeleteButtonItem.bind(null, rowData),
                },
              ] as TableActionModel[])
            },
          },
        ],
        {
          align: 'center',
        } as TableColumn
      )
      const buttonList = ref([])
      const buttonItemFormOptions = [
        {
          label: '按钮名称',
          key: 'buttonName',
          required: true,
          value: ref(null),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入按钮名称')
              return false
            }
            return true
          },
          reset: (formItem) => {
            formItem.value.value = null
          },
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入按钮名称',
            }),
        },
        {
          label: '按钮编码',
          key: 'buttonCode',
          required: true,
          value: ref(null),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入按钮编码')
              return false
            }
            return true
          },
          reset: (formItem) => {
            formItem.value.value = null
          },
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入按钮编码',
            }),
        },
        {
          label: '所属角色',
          key: 'role',
          value: ref(null),
          reset: (formItem) => {
            formItem.value.value = null
          },
          render: (formItem) =>
            renderSelect(
              formItem.value,
              roleList.value.map((it: any) => ({
                label: it.name,
                value: it.id,
              })),
              {
                placeholder: '请选择所属角色，不选择默认是全部角色',
              }
            ),
        },
        {
          label: '展示位置',
          key: 'placement',
          value: ref(0),
          reset: (formItem) => {
            formItem.value.value = 0
          },
          render: (formItem) =>
            renderSelect(formItem.value, [
              {
                label: '所有位置',
                value: 0,
              },
              {
                label: '顶部',
                value: 1,
              },
              {
                label: '表格行',
                value: 2,
              },
            ]),
        },
        {
          label: '按钮类型',
          key: 'showType',
          value: ref('default'),
          reset: (formItem) => {
            formItem.value.value = 'default'
          },
          render: (formItem) =>
            renderSelect(formItem.value, [
              {
                label: 'default',
                value: 'default',
              },
              {
                label: 'primary',
                value: 'primary',
              },
              {
                label: 'success',
                value: 'success',
              },
              {
                label: 'warning',
                value: 'warning',
              },
              {
                label: 'error',
                value: 'error',
              },
            ]),
        },
      ] as Array<FormItem>
      function onButtonConfirm() {
        if (buttonDataForm.value?.validator()) {
          message.success(
            '模拟添加按钮成功，参数' + JSON.stringify(buttonDataForm.value?.generatorParams())
          )
          buttonModalDialog.value?.close()
        }
      }
      // 菜单管理 相关的属性
      const itemFormOptions = [
        {
          label: '上级菜单',
          key: 'parentPath',
          value: ref(null),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请选择上级菜单')
              return false
            }
            return true
          },
          render: (formItem) =>
            renderTreeSelect(
              formItem.value,
              transformTreeSelect(table.dataList, 'menuName', 'menuUrl')
            ),
        },
        {
          label: '菜单名称',
          key: 'menuName',
          required: true,
          value: ref(null),
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入菜单名称',
            }),
        },
        {
          label: '菜单地址',
          key: 'menuUrl',
          required: true,
          value: ref(null),
          disabled: ref(false),
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入菜单地址',
              disabled: (formItem.disabled as Ref<boolean>).value,
            }),
          reset: (formItem) => {
            formItem.value.value = null
            ;(formItem.disabled as Ref<boolean>).value = false
          },
        },
        {
          label: '外链地址',
          key: 'outLink',
          value: ref(null),
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入外链地址',
            }),
        },
        {
          label: '菜单图标',
          key: 'icon',
          value: ref(null),
          render: (formItem) => {
            return h(IconSelector, {
              value: formItem.value.value,
              'onUpdate:value': (newIcon: any) => {
                formItem.value.value = newIcon
              },
            })
          },
        },
        {
          label: '提示信息',
          key: 'badge',
          value: ref(null),
          render: (formItem) => {
            return h('div', null, {
              default: () => {
                return [
                  renderRadioButtonGroup(formItem.value, [
                    {
                      label: '红点',
                      value: 'dot',
                    },
                    {
                      label: 'new',
                      value: 'new',
                    },
                  ]),
                  h(NInput, {
                    placeholder: '如果此项为空，则说明不需要提示信息',
                    class: 'mt-4',
                    value: formItem.value.value,
                    onUpdateValue: (newVal) => {
                      formItem.value.value = newVal
                    },
                  }),
                ]
              },
            })
          },
        },
        {
          label: '是否缓存',
          key: 'cacheable',
          value: ref(false),
          render: (formItem) => renderSwitch(formItem.value),
        },
        {
          label: '是否隐藏',
          key: 'hidden',
          value: ref(false),
          render: (formItem) => renderSwitch(formItem.value),
        },
        {
          label: '是否固定',
          key: 'affix',
          value: ref(true),
          render: (formItem) => renderSwitch(formItem.value),
        },
      ] as Array<FormItem>
      function doRefresh() {
        post({
          url: getMenuList,
          data: {},
        })
          .then(table.handleSuccess)
          .catch(console.log)
      }
      function onAddItem() {
        actionModel = 'add'
        modalDialog.value?.show().then(() => {
          dataForm.value?.reset()
        })
      }
      function onUpdateItem(item: any) {
        actionModel = 'edit'
        tempItem = item
        itemFormOptions.forEach((it) => {
          it.value.value = item[it.key] || null
          if (it.key === 'menuUrl' && it.disabled) {
            ;(it.disabled as Ref<boolean>).value = true
          }
        })
        modalDialog.value?.show()
      }
      function onConfirm() {
        if (actionModel === 'add') {
          if (dataForm.value?.validator()) {
            message.success(
              '模拟创建菜单成功, 参数为:' + JSON.stringify(dataForm.value?.generatorParams())
            )
          }
        } else {
          if (dataForm.value?.validator()) {
            const params = dataForm.value?.generatorParams()
            if (tempItem) {
              const tempRoute = findRouteByUrl(layoutStore.state.permissionRoutes, tempItem.menuUrl)
              if (tempRoute && tempRoute.meta && tempRoute.meta.badge) {
                ;(tempRoute.meta as any).badge = (params as any).badge || ''
              }
            }
            message.success('模拟修改菜单成功, 参数为:' + JSON.stringify(params))
          }
        }
      }
      function onDeleteItem(item: any) {
        naiveDialog.warning({
          title: '提示',
          content: '是否要删除此数据？',
          positiveText: '删除',
          onPositiveClick: () => {
            message.success('模拟删除成功，参数为：' + JSON.stringify(item))
          },
        })
      }
      function onShowButtonManage(item: any) {
        if (item.children) {
          message.error('目录下不能有按钮')
          return
        }
        showButtons.value = true
        nextTick(() => {
          if (item.buttonList && Array.isArray(item.buttonList)) {
            buttonList.value = item.buttonList.map((it: any) => ({
              buttonName: it.name,
              buttonCode: it.code,
              roleCode: it.roleCode,
              placement: it.placement,
              type: it.type,
            }))
          } else {
            buttonList.value = []
          }
        })
      }
      function onAddButton() {
        buttonDataForm.value?.reset()
        buttonModalDialog.value?.show()
      }
      function onDeleteButtonItem(item: any) {
        naiveDialog.warning({
          title: '提示',
          content: '确定要删除此按钮吗？',
          positiveText: '删除',
          negativeText: '取消',
          onPositiveClick: () => {
            message.success('模拟删除成功' + JSON.stringify(item))
          },
        })
      }
      function onPermissionButtonClick(btnCode: string) {
        switch (btnCode) {
          case 'add':
            onAddItem()
            break
        }
      }
      onMounted(async () => {
        table.tableHeight.value = await useTableHeight()
        roleList.value = await useRoleList()
        doRefresh()
      })
      return {
        topButtons: buttonModel.top,
        rowKey,
        buttonModalDialog,
        buttonDataForm,
        showButtons,
        buttonItemFormOptions,
        buttonList,
        modalDialog,
        dataForm,
        ...table,
        itemFormOptions,
        buttonTableContainerHeight,
        tableColumns,
        buttonsColumns,
        onAddItem,
        onDeleteItem,
        onConfirm,
        onAddButton,
        onButtonConfirm,
        onPermissionButtonClick,
      }
    },
  })
</script>
<style lang="scss" scoped>
  .icon-wrapper {
    list-style: none;
    border: 1px solid #f5f5f5;
    overflow: hidden;
    padding: 0;
    .icon-item {
      float: left;
      width: 25%;
      font-size: 26px;
      border-right: 1px solid #f5f5f5;
      border-bottom: 1px solid #f5f5f5;
      text-align: center;
      cursor: pointer;
      & > div {
        font-size: 12px;
      }
      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      }
    }
  }
</style>
