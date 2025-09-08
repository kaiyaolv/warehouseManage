const functionNameList = [
  {
    value: 'com.unicom.admin.base.controller.AxbController.binding',
    label: 'axb绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.findPage()',
    label: '号码管理-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.SupportNodeController.findAll()',
    label: '查询所有支撑节点信息'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.findAll()',
    label: '查询所有客户信息'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.findPage()',
    label: '客户开户-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductController.findProductByAbilityMode()',
    label: '根据小号模式查询产品'
  },
  {
    value: 'com.unicom.system.controller.SysDictController.findByType()',
    label: '根据类型查询字典'
  },
  {
    value: 'com.unicom.admin.base.controller.CommodityController.findAll()',
    label: '查询所有商品'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerNumberAuthController.save()',
    label: '客户号码鉴权-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneFinishController.findVoiceRecordPage()',
    label: '语音记录-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CommodityController.save()',
    label: '商品管理-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.StrategyAuthController.getStrategyAuth()',
    label: '获取鉴权策略'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.kpiIndex()',
    label: '首页-今日统计'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.smsStatisticsMap()',
    label: '首页-短信话务量'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.callStatisticsMap()',
    label: '首页-语音话务量'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.businessScale()',
    label: '首页-业务规模'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.getVisitNum()',
    label: '首页-录音接口访问数'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.voiceProportion()',
    label: '首页-语音呼叫占比分布'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.save()',
    label: '客户开户-编辑'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberBindRelationController.findPage()',
    label: '号码绑定关系-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxController.save()',
    label: 'AX产品-新增'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.findNumberDetailPage()',
    label: '客户档案-号码明细'
  },
  {
    value: 'com.unicom.admin.base.controller.FileUploadController.save()',
    label: '文件上传'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberOccupyController.findPage()',
    label: '号码预占开户-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductInteractiveController.save()',
    label: '交互产品-新增'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.findUseNumberPage()',
    label: '客服查询-用户查询'
  },
  {
    value: 'com.unicom.admin.base.controller.RealtimeMediaController.findRealtimeMediaList()',
    label: '实时监听-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProxyController.findAll()',
    label: '渠道管理-查询全部'
  },
  {
    value: 'com.unicom.admin.base.controller.SyncLogController.findPage()',
    label: '数据同步接口日志-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.getServerConcurrent()',
    label: '首页-并发查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.numberImport()',
    label: '号码管理-导入'
  },
  {
    value: 'com.unicom.admin.base.controller.SmsRecordController.findPage()',
    label: '短信记录-查询'
  },
  {
    value: 'com.unicom.quartz.controller.SysJobController.findPage()',
    label: '定时任务-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxbController.save()',
    label: 'AXB产品-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberOccupyController.saveNumberOccupy()',
    label: '受理单-保存'
  },
  {
    value: 'com.unicom.system.controller.SysMenuController.findNavTree()',
    label: '加载用户菜单'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.findPermissions()',
    label: '加载用户权限'
  },
  {
    value: 'com.unicom.admin.base.controller.SyncLogController.againSync()',
    label: '数据同步接口日志-重试'
  },
  {
    value: 'com.unicom.admin.base.controller.StrategyFlowController.findAll()',
    label: '流控策略-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.StrategyQualityController.findAll()',
    label: '质检策略-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.findAllRemoveTrust()',
    label: '查询所有用户除托管'
  },
  {
    value: 'com.unicom.admin.base.controller.MobileLocaleController.findAllOldProvinceCityCode()',
    label: '查询所有省份编码'
  },
  {
    value: 'com.unicom.admin.base.controller.ProxyController.getAllProxyByProxyType()',
    label: '根据渠道类型获取所有渠道'
  },
  {
    value: 'com.unicom.system.controller.SysRoleController.getUserRolesByUserId()',
    label: '根据当前用户id查询用户角色'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.findCurrentUser()',
    label: '查询当前用户'
  },
  {
    value: 'com.unicom.admin.base.controller.RingtoneController.findPage()',
    label: '彩铃-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberSourceController.findAllNumberSource()',
    label: '查询所有号源信息'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxController.findPage()',
    label: 'AX产品-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CommodityController.findPage()',
    label: '商品管理-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxgController.save()',
    label: '产品管理-axg模式-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.FlashMsgCompanyInfoController.findAll()',
    label: '查询所有闪信企业信息'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneFinishController.findPhoneFinishDetail()',
    label: '语音记录-详情'
  },
  {
    value: 'com.unicom.admin.system.controller.LoginController.doubleLogin()',
    label: '登录'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.save()',
    label: '用户管理-新增'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.edit()',
    label: '用户管理-编辑'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.delete()',
    label: '用户管理-删除'
  },
  {
    value: 'com.unicom.admin.base.controller.AxExtensionController.setup',
    label: 'AX分机-设置彩铃'
  },
  {
    value: 'com.unicom.admin.base.controller.AxDirectCallController.query',
    label: 'AX直呼-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxDirectCallController.binding',
    label: 'AX直呼-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.binding',
    label: 'AXG-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.unbind',
    label: 'AXG-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.axSwitch',
    label: 'AXG-开关机'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.gMember',
    label: 'AXG-G成员设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.binding',
    label: 'AX-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.unbind',
    label: 'AX-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.axSwitch',
    label: 'AX-开关机'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.updateExpiration',
    label: 'AXB-更新时间'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.deleteBinding',
    label: 'AXB-删除关联'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.binding',
    label: 'AXYB-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.update',
    label: 'AXYB-更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.axybDelete',
    label: 'AXYB-删除'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.unbind',
    label: 'AXYB-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.axSwitch',
    label: 'AXYB-开关机'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.binding',
    label: 'AXYBN-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.update',
    label: 'AXYBN-更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.axybnDelete',
    label: 'AXYBN-删除'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.unbind',
    label: 'AXYBN-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.switch',
    label: 'AXYBN-开关机'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.A_range',
    label: 'AXYB-A范围设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.g_member',
    label: 'AXYBN-G成员设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.query',
    label: 'AX-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.update',
    label: 'AX-绑定更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.callset',
    label: 'AX-语音主叫'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.query',
    label: 'AXG-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.update',
    label: 'AXG-绑定更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.callset',
    label: 'AXG-语音主叫'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.Arange',
    label: 'AXG-A范围设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.Arange',
    label: 'AXYB-A范围设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.Arange',
    label: 'AXYBN-A范围设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.query',
    label: 'AXYBN-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybnController.callset',
    label: 'AXYBN-语音主叫'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.callset',
    label: 'AXYB-语音主叫'
  },
  {
    value: 'com.unicom.admin.base.controller.AxybController.query',
    label: 'AXYB-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxDirectCallController.unbind',
    label: 'AX直呼-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxDirectCallController.update',
    label: 'AX直呼-绑定更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxDirectCallController.axSwitch',
    label: 'AX直呼-开关机'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.queryBinding',
    label: 'AXB-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.DoubleCallController.dialup',
    label: 'AI-外呼'
  },
  {
    value: 'com.unicom.admin.base.controller.AybController.updateExpiration',
    label: 'AYB-更新时间'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.numberPool',
    label: '号码池设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AybController.deleteBinding',
    label: 'AYB-删除关联'
  },
  {
    value: 'com.unicom.admin.base.controller.AybController.binding',
    label: 'AYB-创建关联'
  },
  {
    value: 'com.unicom.admin.base.controller.AybController.queryBinding',
    label: 'AYB-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.numberPoolTelX',
    label: '号码池X号码设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxbController.numberPoolTelA',
    label: '号码池A号码设置'
  },
  {
    value: 'com.unicom.admin.base.controller.AxController.aRange',
    label: 'AX-A范围设置'
  },
  {
    value: 'com.unicom.admin.base.controller.DidiAxbController.statisticCityNumberCount',
    label: '滴滴-城市号码统计'
  },
  {
    value: 'com.unicom.admin.base.controller.DidiAxbController.deleteBinding',
    label: '滴滴-AXB解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.DidiAxbController.binding',
    label: '滴滴-AXB绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.gMember',
    label: 'AXG-PLUS-G成员范围设置接口'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.callset',
    label: 'AXG-PLUS-语音主叫'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.update',
    label: 'AXG-PLUS-绑定更新'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.query',
    label: 'AXG-PLUS-绑定查询'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.unbind',
    label: 'AXG-PLUS-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgPlusController.binding',
    label: 'AXG-PLUS-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.TwoCallController.doubleCalling',
    label: '双呼'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.updateLimitCount',
    label: '更改客户并发'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.numberQuery',
    label: '所属号码查询'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneNumberBlackController.operation',
    label: '黑名单号码'
  },
  {
    value: 'com.unicom.admin.base.controller.TwoCallController.singleCalling',
    label: '单呼'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.voiceHangup',
    label: '实时挂断呼叫'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.numberInfo',
    label: '客户号码查询'
  },
  {
    value: 'com.unicom.admin.base.controller.RingController.uploadRing',
    label: '彩铃上传'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.numberChange',
    label: '号码升级/降级'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.telWhiteList',
    label: '固话白名单'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.customerTelA',
    label: 'A号码报备'
  },
  {
    value: 'com.unicom.admin.base.controller.GeneralController.numberDetailInfo',
    label: '号码信息查询'
  },
  {
    value: 'com.unicom.admin.base.controller.log.PgSlowLogController.findPage()',
    label: 'redis慢日志-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerOperController.findPageByParam()',
    label: 'API接口-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.order.WorkOrderCustomerAppController.findAll()',
    label: '客户应用管理-应用'
  },
  {
    value: 'com.unicom.admin.base.controller.RingtoneController.findRingtoneByCusId()',
    label: '彩铃-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.log.CustomerExceptionLogController.findPage()',
    label: 'API异常-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.log.SlowLogController.findPage()',
    label: 'redis慢日志-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneFinishController.getRecordByCallInId()',
    label: '语音记录-录音'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.apiStatisticsMap()',
    label: '首页- API调用'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.apiRequestStatisticsMap()',
    label: '首页- API请求数统计'
  },
  {
    value: 'com.unicom.admin.base.controller.statistics.SystemStatController.getServerConcurrent()',
    label: '首页-语音并发数'
  },
  {
    value: 'com.unicom.admin.base.controller.statistics.ApiStatisticsController.getStatisticsInfoNew()',
    label: '首页- API调用次数'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.customerAxbLimitStatistics()',
    label: '首页-AXB未超过限制调用统计'
  },
  {
    value: 'com.unicom.admin.base.controller.monitor.ServiceMonitorController.serviceStatus()',
    label: '首页-服务监控接口'
  },
  {
    value: 'com.unicom.admin.base.controller.statistics.ApiStatisticsController.listApiNames()',
    label: '首页- API接口名称'
  },
  {
    value: 'com.unicom.admin.system.controller.LoginController.tydkLogin()',
    label: '登陆-天源迪科登陆接口'
  },
  {
    value: 'com.unicom.admin.base.controller.SmsContentStrategyAuthController.getSmsContentStrategyAuth()',
    label: '鉴权策略-短信鉴权'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberAbnormalController.findPage()',
    label: '异常号码-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProxyController.findPage()',
    label: '渠道档案-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProxyController.getFirstLevelAllProxy()',
    label: '获取除当前代理商id外的其他一级代理商'
  },
  {
    value: 'com.unicom.admin.base.controller.ProxyController.save()',
    label: '渠道档案-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.numberRetry()',
    label: '号码管理-上下线失败重试'
  },
  {
    value: 'com.unicom.admin.base.controller.statistics.SystemStatController.customerCallStatistics()',
    label: '客户呼叫统计'
  },
  {
    value: 'com.unicom.admin.base.controller.ExecuteController.execute()',
    label: '首页统计'
  },
  {
    value: 'com.unicom.admin.base.controller.statistics.SystemStatController.exportCustomerCallStatistics()',
    label: '客户呼叫统计-导出'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneFinishController.findPage()',
    label: '语音记录-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.SmsRecordController.findPageByNumberId()',
    label: '用户查询-短信查询'
  },
  {
    value: 'com.unicom.admin.base.controller.FileUploadController.downFilePath()',
    label: '文件下载'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.findNumberCitiesByProvinceCode()',
    label: '根据省份编码查找有号码的城市'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.findUserBatchQueryImportResult()',
    label: '用户查询-批量查询结果查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberOccupyRecordDetailController.findCancellationPage()',
    label: '号码注销-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberSourceController.findPage()',
    label: '号源管理-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberStatusNotificationController.findPage()',
    label: '号码状态通知-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneTrafficVolumeMonitorController.findPage()',
    label: '话务量监控-查询'
  },
  {
    value: 'com.unicom.admin.system.controller.LoginController.getMobileVerifyCode()',
    label: '登录-获取手机验证码'
  },
  {
    value: 'com.unicom.quartz.controller.SysJobLogController.findPage()',
    label: '定时任务-查询'
  },
  {
    value: 'com.unicom.system.controller.SysLoginController.captcha()',
    label: '登录-获取图片验证码'
  },
  {
    value: 'com.unicom.admin.base.controller.ApiController.bind()',
    label: '用户查询-绑定关系-绑定'
  },
  {
    value: 'com.unicom.admin.base.controller.ApiController.unbind()',
    label: '用户查询-绑定关系-解绑'
  },
  {
    value: 'com.unicom.admin.base.controller.AxgController.aQuery',
    label: 'AXG-A号码绑定查询X号码'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerOperController.findPage()',
    label: '客户操作日志-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.FileUploadController.downModel()',
    label: '下载指定名称的模板文件'
  },
  {
    value: 'com.unicom.admin.base.controller.HomePageController.kpiIndexDetails()',
    label: '首页-今日统计-详情'
  },
  {
    value: 'com.unicom.admin.base.controller.log.ExceptionLogController.findPage()',
    label: '异常日志-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.userBatchQueryImport()',
    label: '用户查询-批量查询导入'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberOccupyRecordDetailController.findCancelNumberImportResult()',
    label: '号码注销-导入结果'
  },
  {
    value: 'com.unicom.admin.base.controller.PhoneTrafficVolumeMonitorController.exportPhoneTrafficVolumeMonitor()',
    label: '话务量监控-导出'
  },
  {
    value: 'com.unicom.admin.base.controller.RingtoneController.save()',
    label: '彩铃-新增'
  },
  {
    value: 'com.unicom.admin.base.controller.StrategyAuthController.findPage()',
    label: '鉴权策略-查询'
  },
  {
    value: 'com.unicom.system.controller.SysDictController.findPage()',
    label: '字典管理-查询'
  },
  {
    value: 'com.unicom.system.controller.SysDictController.save()',
    label: '字典管理-新增'
  },
  {
    value: 'com.unicom.system.controller.SysLogController.findPage()',
    label: '系统日志-查询'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.updatePassword()',
    label: '用户管理-修改密码'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.findTransferNumber()',
    label: '业务变更-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.failNumberRetry()',
    label: '号码管理-上下线失败重试'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerAbilityController.findByCustomerId()',
    label: '根据客户id查询客户应用'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.supportNodeChange()',
    label: '业务变更-节点变更'
  },
  {
    value: 'com.unicom.system.controller.SysRoleController.findAll()',
    label: '查询全部角色'
  },
  {
    value: 'com.unicom.system.controller.SysUserController.findPage()',
    label: '用户管理-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerAbilityController.checkURL()',
    label: '客户应用-校验URL'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.saveTransferNumber()',
    label: '业务变更-过户'
  },
  {
    value: 'com.unicom.admin.base.controller.CommodityController.findByAbilityMode()',
    label: '根据小号模式查找商品'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxbController.findPage()',
    label: '产品管理-AXB模式-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberStatusLogController.findPage()',
    label: '号码周期-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxgPlusController.findPage()',
    label: '产品管理-AXGPlus模式-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberAxgPlusGNumberController.findPage()',
    label: 'AXG-Plus G号码-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.NumberController.supportNodeChangeImport()',
    label: '业务变更-节点变更导入'
  },
  {
    value: 'com.unicom.admin.base.controller.ProductAxgPlusController.save()',
    label: '产品管理-AXGPlus模式-保存'
  },
  {
    value: 'com.unicom.admin.base.controller.RingtoneController.auditionRingtone()',
    label: '彩铃-试听'
  },
  {
    value: 'com.unicom.system.controller.SysMenuController.findMenuTree()',
    label: '菜单管理-查询'
  },
  {
    value: 'com.unicom.system.controller.SysRoleController.findPage()',
    label: '角色管理-查询'
  },
  {
    value: 'com.unicom.system.controller.SysRoleController.findRoleMenus()',
    label: '角色权限-查询'
  },
  {
    value: 'com.unicom.admin.base.controller.CustomerController.customerAWhiteVoList',
    label: 'A&B号码备案'
  }
]

export {
  functionNameList
}
