/*
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as dept from './moudules/dept'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as dict from './moudules/dict'
import * as log from './moudules/log'
// 基础数据
import * as customerManage from './moudules/basicData/customerManage'
import * as productManage from './moudules/basicData/productManage'
// 业务管理
import * as qrCodeManage from './moudules/businessManage/qrCodeManage'
import * as deliveryRecord from './moudules/businessManage/deliveryRecord'
import * as inventoryManage from './moudules/businessManage/inventoryManage'

// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    log,
    customerManage,
    productManage,
    qrCodeManage,
    deliveryRecord,
    inventoryManage
}
