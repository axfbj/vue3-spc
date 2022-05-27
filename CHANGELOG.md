### 2022-5-16(v: 2.0.1)

- 升级：升级 `菜单图标` 支持 `xicon5`，涉及文件：

  - src/components/svg-icon/index.vue
  - src/utils/index.ts

- 修复：修复 `DataForm.ts` 中 `formConfig` 属性为 `null` 的 bug，涉及文件：

  - src/components/common/DataForm.ts

- 修复：修复 `TableHeader.vue` 中 `title` 不能动态设置的 bug，涉及文件：

  - src/components/common/TableHeader.vue

- 优化：由于 `iconfont` 图标库使用率不高且占用比较多的空间资源，所以从本版本开始 移除项目中所使用的所有 `iconfont` 图标库。默认推荐使用 `naive-ui` 官方推荐的 `xicons` 图标库。涉及文件：

  - src/main.ts
  - src/components/common/IconSelector.vue
  - src/components/svg-icon/index.vue
  - src/icons/iconfont（移除目录及以下的文件）
  - src/router/index.ts
  - src/views/other/chart/icon-selector.vue
  - src/views/system/menu.vue
  - src/views/draggable/card-draggable.vue

- 优化：在 `src/router/index.ts` 中定义路由的时候，可以不用指定 `meta` 中的 `icon` 和 `iconPrefix` 两个属性，默认配置成 `MenuOutline` 和 `xicon`，涉及文件：

  - src/utils/index.ts

### 2022-4-15(v: 2.0.0)

- 重要升级：项目名称由原来的 `Vue Admin Work P` 改为 `Admin Work Pro`

- 重要升级：优化 `tabbar` 中 `Nscrollbar` 组件的滑动流程代码，并修复在选择某个路由的时候，不会切换到对应的 `tab-item`的 bug，涉及文件：

  - src/store/modules/visited-view.ts
  - src/components/tabbar/index.vue

- 升级：优化 `菜单展开` 路径 `path` 处理流程。涉及文件：

  - src/components/sidebar/components/ScrollerMenu.vue

- 升级：升级 `menu` 中 `humburger` 样式。涉及文件：

  - src/components/humburger/index.vue
  - src/components/sidebar/components/ScrollerMenu.vue

- 修复：修复 `menu.vue` 页面，弹出 `drawer` 在某些浏览器中会闪屏的 bug，涉及文件：

  - src/views/system/menu.vue

- 修复：顶部刷新按钮在 `refresh` 操作的时候，频繁刷新引起的页面异常的 bug，涉及文件：

  - src/components/actions/index.vue

- 修复：修复 在 `上下模式` 下，可以设置 `menu` 宽度的 bug。涉及文件：

  - src/components/setting/index.vue

- 重要新增：新增 `Tabbar`标签栏 操作功能，并添加演示页面。涉及文件：

  - src/hooks/useTabbar.ts （新增）
  - src/view/index/tabbar.vue （新增）

- 重要新增：新增 app 配置功能：可以菜单 是否为 `手风琴` 模式，涉及文件：

  - src/components/setting/index.vue
  - src/components/sidebar/components/ScrollerMenu.vue
  - src/types/store.ts
  - src/setting/index.ts

### 2022-3-15(v: 1.1.12)

- 升级：升级 `naive-ui` 组件库版本至 `2.26.4`

- 新增：新增 `上下-左右分栏` 布局模式，涉及文件：

  - src/components/Layout.vue
  - src/components/header/index.vue
  - src/components/logo/index.vue
  - src/components/setting/index.vue
  - src/components/sidebar/SideBar.vue
  - src/components/sidebar/components/HorizontalScrollerMenu.vue (新增)
  - src/components/sidebar/components/ScrollerMenu.vue
  - src/types/store.ts

- 删除：删除没有用的代码，涉及文件：

  - src/store/index.ts

- 修复：修复 顶部 `action-bar` 不显示消息时，`n-popover` 组件没有触发元素而引起报错的 bug，涉及文件：

  - src/components/actions/index.vue

- 修复：修复在手机模式下 登录页面 没有 滑动组件而引起的异常信息

### 2022-2-7(v: 1.1.11)

- 新增：`VawVerifySimple`滑动验证组件，用于登录的时候进行简单的验证

- 新增：`FormItem`类型新增 `optionItemsRef?: Ref<Array<SelectOptionItem | TreeSelectOption>>` 属性，方便在在异步获取 下拉选项的时候，动态添加数据。

  ```ts
  // 定义
  export interface FormItem extends TableSearchItem {
    required?: boolean
    validator?: (value: FormItem, message: MessageApi) => boolean
    hidden?: boolean
    inputType?: string
    maxLength?: number
    rows?: number
    disabled?: Ref<boolean> | boolean
    optionItems?: Array<SelectOptionItem | TreeSelectOption>
    optionItemsRef?: Ref<Array<SelectOptionItem | TreeSelectOption>>
    path?: string
    reset?: (formItem: FormItem) => void
    render?: (formItem: FormItem) => VNode
  }

  // 具体使用场景参考 `base-form-view.vue` 文件，部分源码如下
  const formItems = [
    ……
    {
      label: '起止地点',
      key: 'address',
      value: ref(null),
      optionItemsRef: ref([]),
      render: (formItem) =>
        renderSelect(formItem.value, formItem.optionItemsRef!.value as SelectOption[], {
          placeholder: '请选择会议地点',
          clearable: true,
        }),
    },
    ……
  ] as FormItem[]
  setTimeout(() => {
    const tempItem = formItems.find((it) => it.key === 'address')
    tempItem!.optionItemsRef!.value = [
      {
        label: '会议一室',
        value: 1,
      },
      {
        label: '会议二室',
        value: 2,
      },
      {
        label: '会议三室',
        value: 3,
      },
      {
        label: '会议四室',
        value: 4,
      },
    ]
  }, 3000)
  ```

- 优化：`权限按钮` 展示位置时是 `default`，（default 默认是所有位置都展示） `top` 和 `tablLine` 都展示

- 微调：`main.vue` 和 `work-place.vue` 块样式 和 间距

- 修复：`menu.vue`页面中没有`onPermissionButtonClick` 的 bug

- 优化：增大 `setting` 页面 `z-index` 的比重

### 2022-1-21(v: 1.1.10)

- 新增：`按钮级别（功能点）权限控制` 重要功能，此功能涉及到的文件比较多，影响比较大，请各位小主慎重升级。下面说一下详细的升级内容

  ### 涉及的文件如下：

  - mock/router/index.js
  - mock/router/user/index.js

  - src/main.ts

  - src/components/index.ts
  - src/components/common/PermissionButtons.ts (新增)

  - src/directive/index.ts (新增)
  - src/directive/permission.ts (新增)

  - src/store/types.ts
  - src/store/modules/buttons.ts （新增）

  - src/utils/router.ts

  ---------以下是具体演示功能所用到文件---------

  - src/views/system/department.vue
  - src/views/system/menu.vue
  - src/views/system/role.vue
  - src/views/system/user.vue

  ### 用法说明

  对于 `按钮级别` 的权限控制，Vue Admin Work 框架提供了两种方式：

  - 基于后端的控制方式
  - 基于前端的控制方式

  #### 基于后端的控制方式

  基于后端的控制方式得需要后端开发人员进行配合，对于后端的具体实现我们不做介绍。主要是介绍一下这种方式下前端该怎么做：

  1. 首先是在 在 `getMenuListByRoleId` 接口下，在原来数据的基础上添加上 `按钮的数据`，格式如下：

  ```js
  {
    menuUrl: '/system',
    menuName: '系统管理',
    iconPrefix: 'iconfont',
    icon: 'setting',
    parentPath: '',
    children: [
      {
        parentPath: '/system',
        menuUrl: '/system/department',
        menuName: '部门管理',
        cacheable: true,
        // 这里就是按钮的数据，我们规定buttonList必须是一个数组，里面包含着具体的按钮信息
        buttonList: [
          {
            name: '添加', // 按钮名称
            code: 'add', // 按钮编码，要保证每一页面中此编码是唯一的
            roleCode: 'ROLE_admin', // 按钮所属的角色，我们规定：ROLE_all 代表所有角色都可以。默认是此编码
            placement: 'top', // 按钮所在的位置，我们默认提供了两种方式: top 和 tableLine 分别中在页面的顶部和表格中每一行展示
            type: 'primary', // 按钮的样式，此功能基于 naive-ui 的 n-button 的 type 属性
          },
          {
            name: '编辑',
            code: 'update',
            roleCode: 'ROLE_admin',
            placement: 'tableLine',
            type: 'warning',
          },
          {
            name: '删除',
            code: 'delete',
            roleCode: 'ROLE_all',
            placement: 'tableLine',
            type: 'error',
          },
        ],
      },
    ],
  },
  ```

  2. 在定义完上面的数据之后，我们就可以具体的使用。因为`按钮`是依附于页面而存在，所以我们以页面的 url 为 key ，把`按钮` 信息存储到 `pinia`中。看一下 store/modules/buttons.ts 的定义：

     ```tsx
     import { defineStore } from 'pinia'
     import { ButtonPlacement, RoleButton } from '../types'
     import useUserStore from './user'

     const useButtonStore = defineStore('permission-button', {
       state: () => {
         return {
           permissionButtonList: [] as { key: string; buttonList: RoleButton[] }[],
         }
       },
       actions: {
         addMenuButton(key: string, buttonList: Array<RoleButton>) {
           this.permissionButtonList.push({
             key,
             buttonList,
           })
         },
         /**
          * 根据当前用户的 roleCode 返回 某个 path 下所有的 button
          * @param key 路由 path
          * @returns buttons
          */
         getButtonsListByRoleCode(key: string) {
           const userStore = useUserStore()
           const userRoleCode = userStore.userRoleCode
           const result = this.permissionButtonList.find((it) => it.key === key)
           if (result) {
             if (Array.isArray(result.buttonList) && result.buttonList.length > 0) {
               return result.buttonList.filter(
                 (it) => userRoleCode.includes(it.roleCode) || it.roleCode === 'ROLE_all'
               )
             }
             return []
           } else {
             return []
           }
         },
         /**
          * 根据按钮的位置进行归类
          * @param key 路由 path
          * @returns buttons
          */
         getButtonListByPlacement(key: string) {
           const resultButtonList = this.getButtonsListByRoleCode(key)
           return resultButtonList.reduce((pre, cur) => {
             if (!(pre as any)[cur.placement]) {
               ;(pre as any)[cur.placement] = []
             }
             ;(pre as any)[cur.placement].push(cur)
             return pre
           }, {} as ButtonPlacement)
         },
       },
     })

     export default useButtonStore
     ```

  接下来就是如何把`按钮`数据保存到 `pinia` 中，因为是和菜单相关的，所以我们就直接在处理菜单数据的时候把数据保存下来。在 `src/utils/router.ts` 中

  ```ts
  ……
  import useButtonStore from '@/store/modules/buttons'
  import { RoleButton } from '@/store/types'

  const userStore = useUserStore(pinia)
  // 引入并使用我们之前创建好的 buttonStore
  const buttonStore = useButtonStore(pinia)

  interface OriginRoute {
    menuUrl: string
    menuName?: string
    hidden?: boolean
    outLink?: string
    affix?: boolean
    cacheable?: boolean
    iconPrefix?: string
    icon?: string
    badge?: string | number
    isSingle?: boolean
    children: Array<OriginRoute>
    // 在类型里面定义一个 buttonList 属性
    buttonList?: Array<RoleButton>
  }

  function generatorRoutes(res: Array<OriginRoute>) {
    const tempRoutes: Array<RouteRecordRawWithHidden> = []
    res.forEach((it) => {
      const route: RouteRecordRawWithHidden = {
        path: it.outLink && isExternal(it.outLink) ? it.outLink : it.menuUrl,
        name: getNameByUrl(it.menuUrl),
        hidden: !!it.hidden,
        component: isMenu(it.menuUrl) ? Layout : getComponent(it),
        meta: {
          title: it.menuName,
          affix: !!it.affix,
          cacheable: !!it.cacheable,
          icon: it.icon || 'menu',
          iconPrefix: it.iconPrefix || 'iconfont',
          badge: it.badge,
          isSingle: !!it.isSingle,
        },
      }
      // 这个地方就保存buttonList的地方
      if (it.buttonList) {
        buttonStore.addMenuButton(route.path, it.buttonList)
      }
      if (it.children) {
        route.children = generatorRoutes(it.children)
      }
      tempRoutes.push(route)
    })
    return tempRoutes
  }
  ……
  ```

  3. 在做完上面的步骤之后，就可以具体的使用按钮功能了，以 `department.vue` 为例：

  ```vue
  <template>
    <div class="main-container">
      <TableBody>
        <template #header>
          <TableHeader :show-filter="false">
            <template #actions>
              <!-- <AddButton @add="onAddItem" /> -->
              // 为了方便使用我们为按钮创建了一个 PermissionButtons容器，接收一个按钮列表属性
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
    </div>
  </template>

  <script lang="ts">
    // 引入 buttonStore
    import useButtonStore from '@/store/modules/buttons'
    import { useRoute } from 'vue-router'
    export default defineComponent({
      name: 'Department',
      setup() {
        // 使用 buttonStore
        const buttonStore = useButtonStore()
        const route = useRoute()
        // 我们根据 按钮的位置 进行了分类，如 buttonModel的数据结构可能如下：
        /**
        {
          top: [
            {
              name: '',
              code: '',
              placement: '',
              roleCode: '',
              type: ''
            },
            {
              name: '',
              code: '',
              placement: '',
              roleCode: '',
              type: ''
            }
          ],
          tableLine: [
            {
              name: '',
              code: '',
              placement: '',
              roleCode: '',
              type: ''
            },
            {
              name: '',
              code: '',
              placement: '',
              roleCode: '',
              type: ''
            }
          ],
        }
        **/
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
        // 这里我们对 buttonModel.tableLine 进行了优化，如果没有数据，就不对在 table 行中添加  操作 一列
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
                    // 根据 button 的 code 做出不同的 点击响应事件
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
        // 根据 button 的 code 做出不同的 点击响应事件
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
          // 这里把需要展示在顶部的按钮暴露出去，方便 <PermissionButtons :buttons="topButtons" @click="onPermissionButtonClick" /> 使用
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
  ```

  以上就是处理了 基于 后端 的按钮控制使用方式了，下面我们再介绍一下基于前端的 指令 方式

  #### 基于前端的控制方式

  这种方式比较简单，我们在 src/directive 文件夹下面定义 permission.ts 指令。

  源码如下：

  ```ts
  import useUserStore from '@/store/modules/user'
  import { App } from 'vue'

  export default {
    name: 'permission',
    install(app: App) {
      app.directive('permission', (el, binding) => {
        const userStore = useUserStore()
        const permission = binding.value
        let hasPermission = false
        if (Array.isArray(permission)) {
          if (permission.includes('ROLE_all')) {
            hasPermission = true
          } else {
            for (let index = 0; index < permission.length; index++) {
              const element = permission[index]
              hasPermission = userStore.userRoleCode.includes(element) || hasPermission
            }
          }
        } else if (typeof permission === 'string') {
          hasPermission = permission === 'ROLE_all' || userStore.userRoleCode.includes(permission)
        }
        if (!hasPermission) {
          ;(el as HTMLElement).parentElement?.remove()
        }
      })
    },
  }
  ```

  具体用法如下：

  ```vue
  <template>
    // 指令接收的参数如果是多个的话可以是一个数组，如果只有一个就直接是一个字符串就好
    <DeleteButton v-permission="['ROLE_admin', 'ROLE_editor']" />
    <DeleteButton v-permission="'ROLE_admin'" />
  </template>
  ```

  这种方式适合一些不方便在后端控制的按钮，直接在前端控制的场景下。用法也比较简单

- 新增：在 `src/hooks/api.ts` 下面新添加一个 快捷获取 菜单数据 的 hooks，文件位置：

  - `src/hooks/api.ts`

### 2022-1-14(v: 1.1.10-dev)

```ts
在运行新的代码之前，请先进行 `npm install` 操作，以便安装一下新的依赖！！！
在运行新的代码之前，请先进行 `npm install` 操作，以便安装一下新的依赖！！！
在运行新的代码之前，请先进行 `npm install` 操作，以便安装一下新的依赖！！！
```

- 新增：`dotenv` 第三方依赖

- 优化：`vite.config.ts` 中 `base` 选项的配置，数据值 根据 `mode` 分别从 `.env.[mode]` 中获取

  新增 `.env.development`、`.env.production`、`.env.staging` 文件中 `BUILD_PATH` 字段。根据不同的开发场景获取不同的值，避免修改 `vite.config.ts`中`base`的值。只需要改 以上三个文件 的值就可以

- 新增：`系统主题` 随着时间变化而自动变化，当 `当前时间` 在 18 点 至早上 6 点的时候，设置成 `dark` 模式，其它时间则是 `light` 模式

  ```ts
  // src/setting/index.ts
  const date = new Date()
  const currentHours = date.getHours()
  setting.theme = currentHours > 18 || currentHours < 6 ? 'dark' : 'light'
  ```

- 优化：`/index/work-place.vue` 页面，提高性能，此页面是演示是为了演示用的，不用升级

- 删除：`src/assets` 下面没用的 `图片`

- 修复：设置了系统属性 刷新后没有效果的 bug. 文件地址 `src/setting/index.ts`

==========================================

```ts
重要说明：
此次升级功能比较大，影响范围也比较多，主要是 用 pinia 把 vuex 替换。如果您不想使用 pinia 那么，此次升级可以把 这部分 忽略。
当然，以后我们会一直使用 pinia 作为状态管理工具，所以建议您还是升级一下。
```

- 升级：升级 `vue` 版本到 `3.2.26`，升级 `naive-ui` 版本到 `2.24.0`

- 新增：第三方依赖库 `pinia` 替换 `vuex`，同时移除 `vuex`依赖。涉及到的文件如下：

  - `src/components/avatar/VAWAvatar.vue`
  - `src/components/setting/index.vue`
  - `src/components/tabbar/index.vue`

  - `src/views/login/index.vue`
  - `src/views/login/LoginComponent.vue`

  - `src/store/modules/user.ts`
  - `src/store/modules/app.ts`(删除)
  - `src/store/pinia.ts`(新增)

  还有一些演示页面，不影响正常使用，这里不一一列举。

==========================================

- 新增（重要，此功能还没完全开发完成，所以这个功能暂时不要使用。下个版本会再统一升级）：按钮级权限，涉及到的文件有如下：

  - `mock/router/index.js`
  - `src/hooks/api.ts`
  - `src/utils/index.ts`
  - `src/views/system/menu.vue`

### 2022-1-9(v: 1.0.10)

- 修复：`menu.vue` 中默认图标 和 `sidebar` 中 默认图标不一致的 bug

- 修复：`SortableTable.vue` 中 `重置` 按钮点击没反应的 bug

- 调整：`BaseForm.ts` 中 把 红色提示 信息放到 `label`前面，之前在最后面

- 优化：`src/hooks/table.ts` 中 `useTableHeight` 方法代码逻辑

- 调整：`tabbar` 中的 `button` 样式 和 `表格`中的 `按钮` 样式

- 调整：`TableHeader.vue` 中的 `top-right` 插槽名称 修改为 `actions`

- 调整（重要升级）：`系统管理` 下面的功能，更符合实际项目，快速开发

- 修复：`系统设置` 默认值不起作用的 bug

### 2021-12-26(v: 1.0.9)

- 调整：调整 `ttb` 模式下的布局，把 `Menu` 进行横向排列。涉及到的文件有：

  - `src/components/Layout.vue`
  - `src/components/MainLayout.vue`
  - `src/components/header/index.vue`
  - `src/components/header/index.vue`
  - `src/components/sidebar/components/ScrollMenu.vue`
  - `src/components/tabbar/index.vue`

  tip: 如果您对这种布局没有特别的需要，建议慎重升级。因为需要改动的 `layouts` 里面的代码比较多。

- 修复：修复 `logo.vue` 组件在`上下模式`下标题不显示的 bug

- 调整：更好的适配 `手机`、`Pad`，`PC`中任何布局模式下 在 `手机` 上，回退到的 `ltr` 模式。

- 新增：`role.vue` 菜单权限演示获取 值
- 优化&修复（重要）：优化了 `菜单外链` 功能，把之前的 `redirect` 字段换成了 `outLink`。涉及到的文件如下：

  - `src/system/menu.vue`

  - `src/utils/router.ts`

  **对于 `外链` 功能，只要 `menuUrl` 或者 `outLink` 这现个字段 任一 满足以 `http://` 或者 `https://`开头都会当成是 `外链`。且链接优先级最高，比如: `menuUrl` 不是一个外链地址，而 `outLink` 是一个`外链`地址，则也会被判定是一个 `外链`。所以如果不是 `外链` 的话，请确定保 `menuUrl` 和 `outLink` 都不是一个 `外链`，`outLink` 设置成 '' 就好**

- 新增：把 `token` 等一些字段的 `key` 单独抽取成一个文件

  `src/store/keys.ts`

  方便修改

### 2021-12-18(v: 1.0.8)

- 调整：调整 `menu` 菜单的颜色搭配，更加柔和

- 新增：`base-form-view.vue` 添加 `preset` 属性演示

- 修复：页面不满一屏时，上下滑动的 bug

- 优化：当 `TabBar` 不显示的时候，添加 `NavBar`底部显示阴影的效果

- 新增：新增 `路由参数` 功能演示，涉及到的文件如下：

  - `src/components/Main.vue`
  - `src/components/breadcrumb/index.vue`
  - `src/views/route-params` 文件夹

- 新增：`Sidebar` 黑色模式下某个条目选中的效果: `slide` 和 `clear`，并且可以通过应用配置来进行自由选择

### 2021-12-16（v: 1.0.7）

- 新增：在 `table-custom.vue` 页面新加 `斑马纹` 效果，涉及到的文件有：

  - `src/views/table-custom.vue`
  - `src/components/common/TableConfig.vue`
  - `src/hooks/table.ts`

- 升级：升级`NaiveUI`组件库到最新版 `2.21.3` 版本，在运行项目之前，请先运行 `npm install` 安装最新版 UI 库

- 新增：添加用户登录过期 `axios` 拦截器。添加的文件有
  - `src/api/interceptors/UserTokenExpiredInterceptor.ts` 如果对系统自带的处理逻辑不满足，可以修改此文件来满足您的需求

### 2021-12-3（v: 1.0.6）

- 修复：在路由对象没有 `name` 属性时，不在 `tabbar` 中显示的 bug

- 演示：点击 `个人中心` 时，带着 `query` 参数

- 修改：把 `src/components/Layout.vue`中 `<n-el></n-el>` 标签替换成 `<n-element></n-element>`

- 删除：删除 `src/components/index.ts` 中注册 `NaiveUI组件的流程`，现在组件加载的方式改成 `vite-plugin-components`。具体配置请参照：`vite.config.ts`中的`plugins`属性中的`ViteComponents()`方法

- 新增：增加菜单项`children`属性只有一个元素时，可以在 `菜单栏` 单独显示，不用展开。但前提是要设置 菜单项中 `meta`的 `isSingle` 属性为 `true`。只有同时满足 菜单项 `children` 元素有且仅有一个 和 `meta.isSingle` 为 true 才可以。例子如下：

```ts
{
    path: '/personal',
    name: 'personal',
    component: Layout,
    meta: {
      title: '个人中心',
      isSingle: true // 一定要设置成 `true`
    },
    children: [ // 里面的元素有且仅有一个，只有同时满足这两个条件才会单独显示
      {
        path: '',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: '个人中心',
        },
      },
    ],
  },
```

### 2021-11-26（v: 1.0.5）

- 新增：新添加 控制 页签（tabbar）显示 的功能

### 2021-11-24（v: 1.0.4）

- 新增：引入 `VueUse` 工具库。删除了 `clipboard`, `fullscreen`, `countup.js`, `LayoutStore` 中的 `useTitle` 函数。以上功能都由 `VueUse` 工具库提供

- 修复：切换账号不能更换路由的 bug `url.ts文件中 getMenuListByRoleId 更换成 getMenusByRoleId`

- 修改：echart 渲染引擎全部替换成 `svg`

- 修复：修复头像组件，在昵称较短的时候，下拉框架超出的 bug

- 修改：调整 icon 目录结构，把 IconFont 的图标和 xicons 图标分开，删除 icon.vue 页面。修复不能复制的 bug

- 修改：把 `echarts` 由全局改改成按需引用，在 `src/utils` 文件夹下面新增 `echarts.ts` 文件

- 修改：删除不必要的图片，重构 `work-splace.vue` 的中 样式

- 依赖升级：以下依赖升级到指定版本，请在运行之前先安装

  "typescript": "^4.4.4", "vite": "^2.6.14", "vue-tsc": "^0.3.0"

### 2021-11-18（v: 1.0.3）

- 修复：table 列表页面 switch 不能点击的 bug

- 修改：给 footer 加 上边距

- 修复：在 build 模式下，CitySelector.vue 文件 和 css-animation.vue 文件报错的 bug 文件位置：

  - CitySelector.vue：`src/components/common/CitySelctor.vue` 第 11 行

    ```vue
    @on-update:value="onValueChange" 替换为： :on-update:value="onValueChange"
    ```

  - css-animation.vue：`src/views/other/css-animation.vue` 第 6 行

    ```
    <span :class="[item.class]" style="position: relative; z-index: 1 ">
    替换为：
    <span :class="[item.class]" :style="{ position: 'relative', zIndex: 1 }">
    ```

### 2021-11-15（v: 1.0.2）

- 新增：大图预览组件 功能

- 新增：省市区选择组件 功能

- 新增：图标选择组件 功能

- 新增：增加了几个主流的 主题颜色

### 2021-11-12（v: 1.0.1）

- 新增：`颜色模式-灰色模式` 功能

- 修复：隐藏全屏按键，会把设置按钮也隐藏的 bug

- 修复：升级 NaiveUI 版本之后，tabbar 中 scrollbar 报错的问题
