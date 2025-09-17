import axios from '../../axios'

  /**
   * 产品管理
   */

  // 分页查询
  export const findPage = (data) => {
    return axios({
      url: '/product/findPage',
      method: 'post',
      data
    })
  }
  // 新增
  export const save = (data) => {
    return axios({
      url: '/product/save',
      method: 'post',
      data
    })
  }
  // 删除
  export const deleteItem = (data) => {
    return axios({
      url: '/product/delete',
      method: 'post',
      data
    })
  }
  // 查询所有产品接口/product/findAll
  export const productAll = (params) => {
    return axios({
      url: '/product/findAll',
      method: 'get',
      params
    })
  }