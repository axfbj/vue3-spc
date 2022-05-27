import { defineStore } from 'pinia'
import { UserState } from '../types'
import layoutStore from '../index'
import { USER_INFO_KEY, TOKEN_KEY } from '../keys'

import Avatar from '@/assets/img_avatar.gif'
import Cookies from 'js-cookie'

const defaultAvatar = Avatar

const userInfo: UserState = JSON.parse(localStorage.getItem(USER_INFO_KEY) || '{}')

const useUserStore = defineStore('user', {
  state: () => {
    return {
      userId: userInfo.userId || 0,
      roleId: userInfo.roleId || 0,
      roles: userInfo.roles || [],
      token: userInfo.token || '',
      userName: userInfo.userName || '',
      nickName: userInfo.nickName || '',
      avatar: userInfo.avatar || defaultAvatar,
    }
  },
  getters: {
    userRoleCode: (state) => {
      return state.roles.map((it) => it.roleCode)
    },
  },
  actions: {
    saveUser(userInfo: UserState) {
      return new Promise<void>((res) => {
        this.userId = userInfo.userId
        this.userId = userInfo.userId
        this.token = userInfo.token
        this.roleId = userInfo.roleId
        this.roles = userInfo.roles
        this.userName = userInfo.userName
        this.nickName = userInfo.nickName
        this.avatar = userInfo.avatar || defaultAvatar
        Cookies.set(TOKEN_KEY, userInfo.token)
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
        res()
      })
    },
    changeNickName(newNickName: string) {
      this.nickName = newNickName
    },
    logout() {
      return new Promise<void>((resolve) => {
        this.userId = 0
        this.avatar = ''
        this.roleId = 0
        this.roles = []
        this.userName = ''
        this.nickName = ''
        this.token = ''
        Cookies.remove(TOKEN_KEY)
        localStorage.clear()
        layoutStore.reset()
        resolve()
      })
    },
  },
})

export default useUserStore
