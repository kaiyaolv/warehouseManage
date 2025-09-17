import axios from '../../axios'

  /**
   * 客户管理
   */

  // 分页查询
  export const findPage = (data) => {
    return axios({
      url: '/customer/findPage',
      method: 'post',
      data
    })
  }
  // 新增
  export const save = (data) => {
    return axios({
      url: '/customer/save',
      method: 'post',
      data
    })
  }
  // 删除
  export const deleteItem = (data) => {
    return axios({
      url: '/customer/delete',
      method: 'post',
      data
    })
  }
  // 查询所有客户接口/customer/findAll
  export const customerAll = (params) => {
    return axios({
      url: '/customer/findAll',
      method: 'get',
      params
    })
  }
  
