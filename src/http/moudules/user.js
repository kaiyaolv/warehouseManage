import axios from '../axios'

/*
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/user/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/user/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/user/findPage',
        method: 'post',
        data
    })
}
// 查找用户的菜单权限标识集合
export const findPermissions = () => {
    return axios({
        url: '/user/findPermissions',
        method: 'get'
    })
}

//重置密码
export const resetPassword = data => {
  return axios({
    url: "/user/resetPassword",
    method: "post",
    data
  });
};

//修改密码
export const updatePassword = (params) => {
  return axios({
    url: '/user/updatePassword',
    method: 'get',
    params
  })
};

//查询当前用户
export const findCurrentUser = () => {
  return axios({
    url: '/user/findCurrentUser',
    method: 'get'
  })
}

//更新用户信息
export const updateUserInfo = (data) => {
  return axios({
    url: '/user/updateUserInfo',
    method: 'post',
    data
  })
}

// 编辑 /user/edit
export const edit = (data) => {
  return axios({
    url: '/user/edit',
    method: 'post',
    data
  })
}
