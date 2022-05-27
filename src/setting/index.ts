export const projectName = 'MES系统'
const settingInfo = JSON.parse(localStorage.getItem('setting-info') || '{}')

interface Setting {
  projectName: string
  theme: 'light' | 'dark'
  sideTheme: 'dark' | 'white' | 'blue' | 'image'
  themeColor: string
  layoutMode: 'ltr' | 'ttb' | 'lcr'
  sideWidth: number
  sideBarCheckedEffect: 'slide' | 'clear'
  accordionMenu: boolean
  pageAnim: 'fade' | 'opacity' | 'down' | 'scale'
  isShowTabbar: boolean
  isFixedNavBar: boolean
  isOpenWaterMark: boolean
  isGray: boolean
  waterMark: string
  actionBar: {
    isShowSearch: boolean
    isShowMessage: boolean
    isShowRefresh: boolean
    isShowFullScreen: boolean
  }
}

const setting = Object.assign(
  {
    theme: 'light',
    sideTheme: 'white',
    themeColor: 'blue@#409eff',
    layoutMode: 'ltr',
    sideBarCheckedEffect: 'clear',
    accordionMenu: false,
    sideWidth: 210,
    pageAnim: 'opacity',
    isShowTabbar: true,
    isFixedNavBar: true,
    isOpenWaterMark: false,
    waterMark: projectName,
    isGray: false,
    actionBar: {
      isShowSearch: true,
      isShowMessage: true,
      isShowRefresh: true,
      isShowFullScreen: true,
    },
  },
  settingInfo
) as Setting

// const date = new Date()
// const currentHours = date.getHours()
// setting.theme = currentHours > 18 || currentHours < 6 ? 'dark' : 'light'
setting.theme = 'light'

export default setting
