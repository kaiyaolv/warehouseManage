export default {
    state: {
        appName: "溯源码业务系统",  // 应用名称
        themeColor: "#14889A",  // 主题颜色
        oldThemeColor: "#14889A",   // 上一次主题颜色
        collapse:false,  // 导航栏收缩状态
        menuRouteLoaded:false    ,// 菜单和路由是否已经加载
        operationWidth: 0,
        displayControl: localStorage.getItem('displayControlCenter') || 'half'
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        }
    },
    mutations: {
        operationWidth(state, width) {
          state.operationWidth = width;
        },
        onCollapse(state){  // 改变收缩状态
            state.collapse = !state.collapse
        },
        setThemeColor(state, themeColor){  // 改变主题颜色
            state.oldThemeColor = state.themeColor
            state.themeColor = themeColor
        },
        menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
            state.menuRouteLoaded = menuRouteLoaded;
        },
        setDisplayControl(state, displayControl) {
          state.displayControl = displayControl;
          localStorage.setItem('displayControlCenter', displayControl)
        }
    },
    actions: {
    }
}
