/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
// export const baseUrl = 'http://171.34.197.72:18785/apiadmin' //外网测试地址
//  export const baseUrl = 'http://192.168.1.200:7077' //张嘉贵



// 配置路径
let protocol = window.location.protocol

let hostName = window.location.hostname

let port = window.location.port
// 测试环境打包，只不过隐私系统正式、测试的baseRoot是一样的
let baseRoot = 'centerAdminApi'

export const baseUrl = `${protocol}//${hostName}:${port}/${baseRoot}`

export const baseTaskUrl = `${protocol}//${hostName}:${port}/centerScheduleApi`

export const switchUrl = `${protocol}//${hostName}:${port}/death/color/switch.txt`

export const voiceUrl = `${protocol}//${hostName}:${port}/voiceApi`


export const mainNavMain = [
    {
      name: '业务管理',
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
    // "移客通",
    // "微小号",
    // "沃号通",
    // "联通挪车",
    // "系统管理",
    // "性能管理",
  ]




// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://localhost:8002'

export default {
    baseUrl,
    backupBaseUrl,
    mainNavMain
}
