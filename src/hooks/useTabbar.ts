import { useLayoutStore } from '@/components'
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router'

/**
 * 获取当前 tabbar-item
 * @returns
 */
export function useCurrentTabbar() {
  const route = useRoute()
  const layoutStore = useLayoutStore()
  const visitedView = layoutStore.state.visitedView.find((it) => it.fullPath === route.fullPath)
  return visitedView
}

/**
 * 关闭当前tabbar-item并跳转到其它页面
 * @param to 跳转的路由信息
 * @returns 返回操作函数
 */
export function useCloseTabbar() {
  const route = useRoute()
  const router = useRouter()
  const layoutStore = useLayoutStore()
  return function (to?: RouteLocationRaw) {
    const visitedView = layoutStore.state.visitedView.find((it) => it.fullPath === route.fullPath)!
    if (to) {
      return layoutStore.removeVisitedView(visitedView).then(() => {
        router.push(to)
      })
    } else {
      return layoutStore.removeVisitedView(visitedView).then(() => {
        const visitedViews = layoutStore.state.visitedView
        const defaultPath = visitedViews[visitedViews.length - 1].fullPath || '/'
        router.push(defaultPath)
      })
    }
  }
}
