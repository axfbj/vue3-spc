export interface Role {
  roleCode: string
  roleId: number
}
export interface UserState {
  userId: number
  token: string
  roleId: number
  roles: Role[]
  userName: string
  nickName: string
  avatar: string
}

export interface RoleButton {
  name: string
  code: string
  roleCode: string
  placement: string
  type: 'primary' | 'success' | 'error' | 'warning' | 'default' | 'info'
}

export interface ButtonPlacement {
  default?: RoleButton[]
  top?: RoleButton[]
  tableLine?: RoleButton[]
}
