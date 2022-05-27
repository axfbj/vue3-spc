import Mock, { Random } from 'mockjs'
import { baseData } from '../base.ts'
import { getDepartmentList, addDepartment, getRoleList, getUserList } from '@/api/url'

const totalSize = 30

function computePageSize(totalSize, page, pageSize) {
  return Math.abs(totalSize - pageSize * page >= 0 ? pageSize : totalSize - pageSize * page)
}

Mock.mock(RegExp(getDepartmentList), 'post', function () {
  return Mock.mock({
    ...baseData,
    totalSize,
    data: [
      {
        id: 1,
        name: '总裁办',
        depCode: 'dp_code_manager', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 0, // 0 禁用 1正常
      },
      {
        id: 2,
        name: '市场部',
        depCode: 'dp_code_marketing', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常,
        children: [
          {
            id: 3,
            parentId: 2,
            name: '市场一部',
            depCode: 'dp_code_marketing_1', // 0男 1女
            'order|+1': 1, // 0不是 1是
            createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
            status: 1, // 0 禁用 1正常
          },
          {
            id: 4,
            parentId: 2,
            name: '市场二部',
            depCode: 'dp_code_marketing_2', // 0男 1女
            'order|+1': 1, // 0不是 1是
            createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
            status: 1, // 0 禁用 1正常
          },
        ],
      },
      {
        id: 5,
        name: '技术部',
        depCode: 'dp_code_technology', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常
      },
      {
        id: 6,
        name: '销售部',
        depCode: 'dp_code_sale', // 0男 1女
        'order|+1': 1, // 0不是 1是
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        status: 1, // 0 禁用 1正常
      },
    ],
  })
})

Mock.mock(RegExp(getRoleList), 'post', function () {
  return Mock.mock({
    ...baseData,
    data: [
      {
        id: 1,
        name: '超级管理员',
        roleCode: 'ROLE_admin',
        description: '超级管理员',
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 2,
        name: '编辑员',
        roleCode: 'ROLE_editor',
        description: '编辑员',
        createTime: Random.now('yyyy-MM-dd HH:mm:ss'),
      },
    ],
  })
})

Mock.mock(RegExp(addDepartment), 'post', function () {
  return Mock.mock({ ...baseData, data: '' })
})

Mock.mock(RegExp(getUserList), 'post', function ({ body }) {
  const { page, pageSize = 10 } = JSON.parse(body)
  const size = computePageSize(totalSize, page, pageSize)
  return Mock.mock({
    ...baseData,
    totalSize,
    [`data|${size}`]: [
      {
        'id|+1': 1,
        nickName: function () {
          return Random.name()
        },
        'gender|0-1': 0, // 0男 1女
        'departmentId|1-6': 1,
        'roleId|1-2': 1,
        mobile: '18800000000',
        email: '123456789@123.com',
        lastLoginTime: Random.now('yyyy-MM-dd HH:mm:ss'),
        lastLoginIp: function () {
          return Random.ip()
        },
        'status|0-1': 1, // 0 禁用 1正常
      },
    ],
  })
})
