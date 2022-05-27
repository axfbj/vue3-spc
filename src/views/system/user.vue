<template>
  <div>
    <n-grid :x-gap="10">
      <n-grid-item :span="5">
        <n-card
          class="h-full"
          :content-style="{ padding: '5px' }"
          :header-style="{ padding: '5px' }"
          :segmented="true"
        >
          <template #header>
            <div class="flex items-center">
              <n-input class="mr-2" v-model:value="pattern" placeholder="搜索" size="small" />
              <n-switch size="small" v-model:value="expandAllFlag" />
            </div>
          </template>
          <n-tree
            :expanded-keys="getExpandedKeys"
            block-line
            :pattern="pattern"
            :data="departmentData"
            selectable
            :on-update:expanded-keys="onUpdateExpandedKeys"
            :on-update:selected-keys="onCheckedKeys"
          />
        </n-card>
      </n-grid-item>
      <n-grid-item :span="19">
        <div>
          <TableBody>
            <template #header>
              <TableHeader ref="tableHeaderRef" :show-filter="false">
                <template #actions>
                  <n-space>
                    <!-- <AddButton @add="onAddItem" />
                    <DeleteButton @delete="onDeleteItems" /> -->
                    <PermissionButtons :buttons="topButtons" @click="onPermissionButtonClick" />
                  </n-space>
                </template>
                <template #table-config>
                  <TableConfig
                    @update-border="onUpdateBorder"
                    @update-striped="onUpdateStriped"
                    @refresh="doRefresh"
                  />
                </template>
              </TableHeader>
            </template>
            <template #default>
              <n-data-table
                :loading="tableLoading"
                :data="dataList"
                :row-key="rowKey"
                :columns="tableColumns"
                :scroll-x="1500"
                :single-line="!bordered"
                :striped="striped"
                :style="{ height: `${tableHeight}px` }"
                :flex-height="true"
                @update:checked-row-keys="onRowCheck"
              />
            </template>
            <template #footer>
              <TableFooter ref="tableFooterRef" :pagination="pagination" />
            </template>
          </TableBody>
        </div>
      </n-grid-item>
    </n-grid>
    <ModalDialog ref="modalDialog" @confirm="onConfirm" content-height="30vh">
      <template #content>
        <DataForm ref="dataForm" :options="itemFormOptions" preset="grid-item" :cols="2" />
      </template>
    </ModalDialog>
  </div>
</template>

<script lang="ts">
  import { post } from '@/api/http'
  import { getDepartmentList, getRoleList, getUserList } from '@/api/url'
  import { renderInput, renderRadioButtonGroup, renderSelect, renderTreeSelect } from '@/hooks/form'
  import {
    TableActionModel,
    usePagination,
    useRenderAction,
    useRowKey,
    useTable,
    useTableColumn,
    useTableHeight,
  } from '@/hooks/table'
  import useButtonStore from '@/store/modules/buttons'
  import { FormItem } from '@/types/components'
  import { transformTreeSelect } from '@/utils'
  import { DataTableColumn, NAvatar, NTag, useDialog, useMessage } from 'naive-ui'
  import { defineComponent, h, onMounted, ref, shallowReactive, watch } from 'vue'
  import { useRoute } from 'vue-router'
  export default defineComponent({
    name: 'UserList',
    setup() {
      const table = useTable()
      const rowKey = useRowKey('id')
      const naiveDialog = useDialog()
      const message = useMessage()
      const pagination = usePagination(doRefresh)
      const checkedRowKeys = ref<Array<any>>([])
      const modalDialog = ref()
      const dataForm = ref()
      const departmentList = ref<any[]>([])
      const roleList = ref<any[]>([])
      const actionMode = ref('add')
      const itemFormOptions = [
        {
          label: '用户名称',
          key: 'nickName',
          required: true,
          value: ref(null),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入用户名称')
              return false
            }
            return true
          },
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入用户名称',
            }),
        },
        {
          label: '手机号码',
          key: 'mobile',
          required: true,
          value: ref(null),
          validator: (formItem, message) => {
            if (!formItem.value.value) {
              message.error('请输入手机号码')
              return false
            }
            return true
          },
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入手机号码',
            }),
        },
        {
          label: '邮箱地址',
          key: 'email',
          value: ref(null),
          render: (formItem) =>
            renderInput(formItem.value, {
              placeholder: '请输入邮箱地址',
            }),
        },
        {
          label: '用户性别',
          key: 'gender',
          value: ref(0),
          render: (formItem) =>
            renderRadioButtonGroup(formItem.value, [
              {
                label: '男',
                value: 0,
              },
              {
                label: '女',
                value: 1,
              },
            ]),
          reset: (formItem) => {
            formItem.value.value = 0
          },
        },
        {
          label: '所属部门',
          key: 'departmentId',
          value: ref(null),
          required: true,
          render: (formItem) =>
            renderTreeSelect(
              formItem.value,
              transformTreeSelect(departmentList.value, 'name', 'id')
            ),
        },
        {
          label: '所属角色',
          key: 'roleId',
          value: ref(null),
          required: true,
          render: (formItem) => renderSelect(formItem.value, roleList.value),
        },
      ] as Array<FormItem>
      const departmentData = [
        {
          label: '东部地区',
          key: 1,
          children: [
            {
              label: '总裁部',
              key: 11,
            },
            {
              label: '财务部',
              key: 12,
            },
            {
              label: '技术部',
              key: 13,
            },
            {
              label: '销售部',
              key: 14,
            },
          ],
        },
        {
          label: '西部地区',
          key: 2,
          children: [
            {
              label: '总裁部',
              key: 21,
            },
            {
              label: '财务部',
              key: 22,
            },
            {
              label: '技术部',
              key: 23,
            },
            {
              label: '销售部',
              key: 24,
            },
          ],
        },
        {
          label: '南部地区',
          key: 3,
          children: [
            {
              label: '总裁部',
              key: 31,
            },
            {
              label: '财务部',
              key: 32,
            },
            {
              label: '技术部',
              key: 33,
            },
            {
              label: '销售部',
              key: 34,
            },
          ],
        },
        {
          label: '北部地区',
          key: 4,
          children: [
            {
              label: '总裁部',
              key: 41,
            },
            {
              label: '财务部',
              key: 42,
            },
            {
              label: '技术部',
              key: 43,
            },
            {
              label: '销售部',
              key: 44,
            },
          ],
        },
      ]
      const buttonStore = useButtonStore()
      const route = useRoute()
      const buttonModel = buttonStore.getButtonListByPlacement(route.path)
      const tableColumns = useTableColumn(
        [
          table.selectionColumn,
          table.indexColumn,
          {
            title: '名称',
            key: 'nickName',
            width: 130,
          },
          {
            title: '头像',
            key: 'avatar',
            width: 80,
            render: (rowData: any) => {
              return h(
                NAvatar,
                {
                  circle: true,
                  size: 'small',
                },
                {
                  default: () => rowData.nickName.substring(0, 1),
                }
              )
            },
          },
          {
            title: '手机号',
            key: 'mobile',
            width: 120,
          },
          {
            title: '邮箱',
            key: 'email',
            width: 120,
          },
          {
            title: '性别',
            key: 'gender',
            width: 80,
            render: (rowData) => {
              return h('div', rowData.gender === 0 ? '男' : '女')
            },
          },
          {
            title: '所属部门',
            key: 'departmentId',
            width: 80,
            render: (rowData) => {
              return h(
                'div',
                getDepartmentName(departmentList.value, rowData.departmentId as number)
              )
            },
          },
          {
            title: '所属角色',
            key: 'roleId',
            width: 80,
            render: (rowData) => {
              return h('div', getRoleName(rowData.roleId as number))
            },
          },
          {
            title: '登录时间',
            key: 'lastLoginTime',
            width: 120,
          },
          {
            title: '登录IP',
            key: 'lastLoginIp',
            width: 120,
          },
          {
            title: '状态',
            key: 'status',
            width: 80,
            render: (rowData) => {
              return h(
                NTag,
                {
                  type: rowData.status ? 'success' : 'error',
                  size: 'small',
                },
                {
                  default: () => (rowData.status ? '正常' : '禁用'),
                }
              )
            },
          },
        ],
        {
          align: 'center',
        } as DataTableColumn
      )
      const tableActionButtons = buttonModel.tableLine!
      tableActionButtons.length > 0 &&
        tableColumns.push({
          title: '操作',
          key: 'actions',
          align: 'center',
          fixed: 'right',
          width: 130,
          render: (rowData) => {
            return useRenderAction(
              tableActionButtons?.map((it) => {
                return {
                  label: it.name,
                  onClick: () => {
                    switch (it.code) {
                      case 'update':
                        onEditItem(rowData)
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
      const expandAllFlag = ref(false)
      async function getDpAnRoleList() {
        // 获取所有部门信息
        const depRes = await post({
          url: getDepartmentList,
        })
        departmentList.value = depRes.data
        // 获取所的角色信息
        const roleRes = await post({
          url: getRoleList,
        })
        roleList.value = roleRes.data.map((it: any) => {
          return {
            label: it.name,
            value: it.id,
          }
        })
      }
      function doRefresh() {
        post({
          url: getUserList,
          data: () => {
            return {
              page: pagination.page,
              pageSize: pagination.pageSize,
            }
          },
        })
          .then((res) => {
            table.handleSuccess(res)
            pagination.setTotalSize((res as any).totalSize)
          })
          .catch(console.log)
      }
      function onAddItem() {
        actionMode.value = 'add'
        itemFormOptions.forEach((it) => {
          it.reset ? it.reset(it) : (it.value.value = null)
        })
        modalDialog.value?.toggle()
      }
      function onDeleteItems() {
        if (checkedRowKeys.value.length === 0) {
          message.error('请先选择要删除的数据')
          return
        }
        naiveDialog.warning({
          title: '提示',
          content: '确定要删除此数据吗？',
          positiveText: '确定',
          onPositiveClick: () => {
            message.success('数据模拟删除成功，参数为：' + JSON.stringify(checkedRowKeys.value))
          },
        })
      }
      function onDeleteItem(item: any) {
        naiveDialog.warning({
          title: '提示',
          content: '确定要删除此数据吗？',
          positiveText: '确定',
          onPositiveClick: () => {
            table.dataList.splice(table.dataList.indexOf(item), 1)
          },
        })
      }
      function onEditItem(item: any) {
        actionMode.value = 'edit'
        itemFormOptions.forEach((it) => {
          it.value.value = item[it.key]
        })
        modalDialog.value?.toggle()
      }
      function getDepartmentName(list: any[], id: number): string {
        for (let index = 0; index < list.length; index++) {
          const element = list[index]
          if (element.id === id) {
            return element.name
          } else {
            if (element.children) {
              const name = getDepartmentName(element.children, id)
              if (name) {
                return name
              } else {
                continue
              }
            } else {
              continue
            }
          }
        }
        return ''
      }
      function getRoleName(id: number) {
        const item = roleList.value.find((it: any) => it.value === id)
        return item ? item.label : ''
      }
      function onRowCheck(rowKeys: Array<any>) {
        checkedRowKeys.value = rowKeys
      }
      function onUpdateExpandedKeys(keys: any) {
        getExpandedKeys.length = 0
        getExpandedKeys.push(...keys)
      }
      function onCheckedKeys(keys: any) {
        message.success('选中的值为--->' + JSON.stringify(keys))
      }
      const getExpandedKeys = shallowReactive([] as Array<number>)
      watch(
        () => expandAllFlag.value,
        (newVal) => {
          newVal
            ? getExpandedKeys.push(...departmentData.map((it) => it.key))
            : (getExpandedKeys.length = 0)
        }
      )
      function onUpdateBorder(isBordered: boolean) {
        table.bordered.value = isBordered
      }
      function onUpdateStriped(isStriped: boolean) {
        table.striped.value = isStriped
      }
      function onConfirm() {
        if (actionMode.value === 'add') {
          if (dataForm.value.validator()) {
            message.success(
              '模拟添加成功：参数为：' + JSON.stringify(dataForm.value.generatorParams())
            )
            modalDialog.value.close()
          }
        } else {
          if (dataForm.value.validator()) {
            message.success(
              '模拟修改成功：参数为：' + JSON.stringify(dataForm.value.generatorParams())
            )
            modalDialog.value.close()
          }
        }
      }
      function onPermissionButtonClick(btnCode: string) {
        switch (btnCode) {
          case 'add':
            onAddItem()
            break
          case 'delete':
            onDeleteItems()
            break
        }
      }
      onMounted(async () => {
        table.tableHeight.value = await useTableHeight()
        await getDpAnRoleList()
        doRefresh()
      })
      return {
        topButtons: buttonModel.top,
        ...table,
        rowKey,
        doRefresh,
        pattern: ref(''),
        expandAllFlag,
        departmentData,
        tableColumns,
        pagination,
        modalDialog,
        dataForm,
        itemFormOptions,
        onConfirm,
        onAddItem,
        onDeleteItem,
        onDeleteItems,
        onRowCheck,
        getExpandedKeys,
        onUpdateExpandedKeys,
        onCheckedKeys,
        onUpdateBorder,
        onUpdateStriped,
        onPermissionButtonClick,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .avatar-container {
    position: relative;
    width: 30px;
    margin: 0 auto;
    vertical-align: middle;
    .avatar {
      width: 100%;
      border-radius: 50%;
    }
    .avatar-vip {
      border: 2px solid #cece1e;
    }
    .vip {
      position: absolute;
      top: 0;
      right: -9px;
      width: 15px;
      transform: rotate(60deg);
    }
  }
  .gender-container {
    .gender-icon {
      width: 20px;
    }
  }
</style>

function getDepartmentName(departmentId: unknown): any { throw new Error('Function not
implemented.') }
