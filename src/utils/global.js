/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址

// export const baseUrl = 'http://192.168.1.160:9999/code' //内网测试地址
export const baseUrl = 'http://192.168.1.43:9999/code' //内网测试地址



export const mainNavMain = [
    {
      name: "业务管理",
      id: 0
    },
    {
      name: "系统管理",
      id: 1
    },
    {
      name: "性能管理",
      id: 10130
    },
  ]


// 配置路径
let protocol = window.location.protocol

let hostName = window.location.hostname

let port = window.location.port

let baseRoot = 'centerAdminApi'

// export const baseUrl = `${protocol}//${hostName}:${port}/${baseRoot}`




// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://localhost:8002'

export default {
    baseUrl,
    backupBaseUrl,
    mainNavMain
}
