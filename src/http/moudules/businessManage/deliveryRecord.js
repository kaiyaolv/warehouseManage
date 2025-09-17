import axios from '../../axios'

  /**
   * 溯源码管理
   */

  // 分页查询
  export const findPage = (data) => {
    return axios({
      url: '/deliveryRecord/findPage',
      method: 'post',
      data
    })
  }
  // 删除 /deliveryRecord/delete
  export const deleteItem = (data) => {
    return axios({
      url: '/deliveryRecord/delete',
      method: 'post',
      data
    })
  }
  