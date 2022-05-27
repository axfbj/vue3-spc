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
