import { getMenuList } from '@/api/url'
import Mock from 'mockjs'

export const adminRoutes = [
  {
    menuUrl: '/system',
    menuName: '系统管理',
    iconPrefix: 'xicon',
    icon: 'SettingsOutline',
    parentPath: '',
    children: [
      {
        parentPath: '/system',
        menuUrl: '/system/department',
        menuName: '部门管理',
        buttonList: [
          {
            name: '添加',
            code: 'add',
            roleCode: 'ROLE_admin',
            placement: 'top',
            type: 'primary',
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
      {
        parentPath: '/system',
        menuUrl: '/system/user',
        menuName: '用户管理',
        buttonList: [
          {
            name: '添加',
            code: 'add',
            roleCode: 'ROLE_admin',
            placement: 'top',
            type: 'primary',
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
            roleCode: 'ROLE_admin',
            placement: 'default',
            type: 'error',
          },
        ],
      },
      {
        parentPath: '/system',
        menuUrl: '/system/role',
        menuName: '角色管理',
        buttonList: [
          {
            name: '添加',
            code: 'add',
            roleCode: 'ROLE_admin',
            placement: 'top',
            type: 'primary',
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
            roleCode: 'ROLE_admin',
            placement: 'tableLine',
            type: 'error',
          },
          {
            name: '菜单管理',
            code: 'menu',
            roleCode: 'ROLE_admin',
            placement: 'tableLine',
            type: 'success',
          },
        ],
      },
      {
        parentPath: '/system',
        menuUrl: '/system/menu',
        menuName: '菜单管理',
        buttonList: [
          {
            name: '添加',
            code: 'add',
            roleCode: 'ROLE_admin',
            placement: 'top',
            type: 'primary',
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
            roleCode: 'ROLE_admin',
            placement: 'tableLine',
            type: 'error',
          },
          {
            name: '按钮管理',
            code: 'button',
            roleCode: 'ROLE_admin',
            placement: 'tableLine',
            type: 'success',
          },
        ],
      },
    ],
  },
  // {
  //   menuUrl: '/exception',
  //   menuName: '异常页面',
  //   iconPrefix: 'iconfont',
  //   icon: 'error',
  //   parentPath: '',
  //   children: [
  //     {
  //       parentPath: '/exception',
  //       menuUrl: '/exception/404',
  //       menuName: '404页面',
  //     },
  //     {
  //       parentPath: '/exception',
  //       menuUrl: '/exception/403',
  //       menuName: '403页面',
  //     },
  //     {
  //       parentPath: '/exception',
  //       menuUrl: '/exception/500',
  //       menuName: '500页面',
  //     },
  //   ],
  // },
]
export const editorRoutes = [
  // {
  //   menuUrl: '/project',
  //   menuName: '项目信息',
  //   iconPrefix: 'xicon',
  //   icon: 'ColorPaletteOutline',
  //   isSingle: true,
  //   children: [
  //     {
  //       parentPath: '/project',
  //       menuUrl: '/project/infomation',
  //       iconPrefix: 'xicon',
  //       icon: 'LogoCodepen',
  //       menuName: '项目依赖',
  //     },
  //   ],
  // },
]

Mock.mock(RegExp(getMenuList), 'post', function () {
  return Mock.mock({ code: 200, data: adminRoutes, msg: '获取菜单列表成功' })
})
