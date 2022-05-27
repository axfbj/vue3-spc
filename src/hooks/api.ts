import { post } from '@/api/http'
import { getAllMenuByRoleId, getRoleList } from '@/api/url'

export function useRoleList() {
  return post({
    url: getRoleList,
    data: {},
  }).then((res) => {
    return res.data
  })
}

export function useMenuList() {
  return post({
    url: getAllMenuByRoleId,
    data: {},
  }).then((res) => {
    return res.data
  })
}
