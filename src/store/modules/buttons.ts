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
      const result = resultButtonList.reduce((pre, cur) => {
        if (!(pre as any)[cur.placement]) {
          ;(pre as any)[cur.placement] = []
        }
        ;(pre as any)[cur.placement].push(cur)
        return pre
      }, {} as ButtonPlacement)
      const defaultPlacement = result.default
      if (defaultPlacement) {
        Object.keys(result)
          .filter((it) => it !== 'default')
          .forEach((it) => {
            ;(result as any)[it] = [...(result as any)[it], ...defaultPlacement]
          })
      }
      return result
    },
  },
})

export default useButtonStore
