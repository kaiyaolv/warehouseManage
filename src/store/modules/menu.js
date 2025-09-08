import { mainNavMain } from 'global'

export default {
    state: {
        navTree: [],  // 导航菜单树
        realNavTree: [],
        rowNav: [],
        sysSetting: false,
        numException: false
    },
    getters: {

    },
    mutations: {
        setNavTree(state, navTree){  // 设置导航菜单树
            state.navTree = navTree;
        },
        setrealNavTree(state, realNavTree){  // 设置导航菜单树
            state.realNavTree = realNavTree;
        },
        setrowNav(state, rowNav) {
            state.rowNav = rowNav;
        },
        setSysSetting(state, sysSetting) {
          state.sysSetting = sysSetting;
        },
        setNumException(state, numException) {
            state.numException = numException;
        }
    },
    actions: {

    }
}
