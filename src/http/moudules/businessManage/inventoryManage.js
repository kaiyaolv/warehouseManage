import axios from '../../axios'

  /**
   * 溯源码管理
   */

  // 分页查询
  export const findPage = (data) => {
    return axios({
      url: '/warehouse/findPage',
      method: 'post',
      data
    })
  }
  // 删除 /deliveryRecord/delete
  export const deleteItem = (data) => {
    return axios({
      url: '/warehouse/delete',
      method: 'post',
      data
    })
  }
  // 入库 /warehouse/putInWarehouse
  export const putInWarehouse = (data) => {
    return axios({
      url: '/warehouse/putInWarehouse',
      method: 'post',
      data
    })
  }
  // 出库 /warehouse/batchDelivery
  export const outWarehouse = (data) => {
    return axios({
      url: '/warehouse/batchDelivery',
      method: 'post',
      data
    })
  }
  // 根据唯一码查询库存信息 /warehouse/findByUniqueCodes
  export const findByUniqueCodes = (params) => {
    return axios({
      url: '/warehouse/findByUniqueCodes',
      method: 'get',
      params
    })
  }