import axios from '../axios'

/*
 * 菜单管理模块
 */

 // 保存
export const save = (data) => {
    return axios({
        url: '/menu/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/menu/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = () => {
    return axios({
        url: '/menu/findNavTree',
        method: 'get'
    })
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/menu/findMenuTree',
        method: 'get'
    })
}


// 获取菜单树
export const findRoleMenuTree = () => {
    return axios({
        url: '/menu/findRoleMenuTree',
        method: 'get'
    })
}   
