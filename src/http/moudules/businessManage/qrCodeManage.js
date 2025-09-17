import axios from '../../axios'

  /**
   * 溯源码管理
   */

  // 分页查询
  export const findPage = (data) => {
    return axios({
      url: '/qrCode/findPage',
      method: 'post',
      data
    })
  }
  // 新增
  export const save = (data) => {
    return axios({
      url: '/qrCode/save',
      method: 'post',
      data
    })
  }
  // 删除
  export const deleteItem = (data) => {
    return axios({
      url: '/qrCode/delete',
      method: 'post',
      data
    })
  }
  // 导出
  export const exportQrCode = (data) => {
    return axios({
      url: '/qrCode/export',
      responseType: 'blob',
      method: 'post',
      data
    })
  }
  // 根据溯源码标识查询溯源码 /qrCode/findByUniqueCode
  export const findByUniqueCode = (params) => {
    return axios({
      url: '/qrCode/findByUniqueCode',
      method: 'get',
      params
    })
  }