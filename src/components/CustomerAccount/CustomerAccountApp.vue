<template>
  <div>
    <el-dialog title="应用" width="1100px" :visible.sync="viewDialogVisible" v-if="viewDialogVisible"
      :close-on-click-modal="false">

      <!--工具栏-->
      <div class="toolbar">
        <el-form :inline="true" :size="size" label-width="90px">
          <el-form-item label="集团业务号码">
            <el-input v-model="pageRequest.param.businessNumber" placeholder="集团业务号码" maxlength="50" clearable
              class="inputTool"></el-input>
          </el-form-item>
          <el-form-item label="业务场景">
            <el-select class="selectTool" v-model="pageRequest.param.abilityMode" placeholder="请选择">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="(item,index) in abilityModeList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支撑节点">
            <el-select class="selectTool" v-model="pageRequest.param.supportNodeId" placeholder="请选择">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="(item,index) in supportNodeList" :key="index" :label="item.nodeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <kt-button label="查询" type="primary" size="mini" @click='refreshPageRequest(1)'
              perms='base:workOrderCustomerApp:findPage'>
            </kt-button>
          </el-form-item>
        </el-form>
      </div>


      <!-- 表格 -->
      <el-table stripe :highlight-current-row="true" :element-loading-text="$t('action.loading')" v-loading="loading"
        :data="pageResult.content" size="mini" rowKey="id" height="400" ref="tableData">
        <el-table-column prop="" header-align="center" width="60" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{
                (pageResult.pageNum - 1) * pageResult.pageSize +
                scope.$index +
                1
              }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in filterColumns" :key="index" :prop="item.prop"
          :formatter="item.formatter" header-align="center" align="center" :label="item.label"
          :show-overflow-tooltip="true" :min-width="item.minWidth">
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column width="220" header-align="center" align="center" label="操作" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <!-- <kt-button label="信息修改" perms="base:customerApp:saveCustomerAppInfo" type="primary" :disable="!scope.row.supportNodeId"
              @click="changeInfo(scope.row)" />
            <kt-button label="节点变更" perms="base:customerApp:selectSupportNode" type="primary" :disable="!scope.row.supportNodeId"
              @click="selectNode(scope.row)" />
            <kt-button label="应用功能查看" perms="base:appFunction:findByCustomerAppId" type="primary"
              @click="functionView(scope.row)" />
            <kt-button label="应用功能保存" perms="base:appFunction:saveAppFunction" type="primary" :disable="!scope.row.supportNodeId"
              @click="functionSave(scope.row)" /> -->
            <!-- <kt-button :label="'号码明细'" perms="base:number:findCustomerNumberPage" type="primary"
               @click="numList(scope.row)" /> -->
            <kt-button :label="'应用产品信息'" perms="base:appProductAttr:findPage" type="primary"
               @click="appProductInfo(scope.row)" />
            <kt-button :label="'自动化配置'" perms="base:workOrderCustomerApp:autoConfig" type="primary"
               @click="autoConfig(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页符 -->
      <div class="pagination-row">
        <el-pagination @size-change="sizeChange" background layout="total, prev,sizes, pager, next , jumper"
          @current-change="refreshPageRequest" :current-page="pageResult.pageNum"
          :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="20" :total="pageResult.totalSize" style="float: right">
        </el-pagination>
      </div>

      <!-- 节点变更 -->
      <el-dialog title="节点变更" width="466px" :visible.sync="showSelectNode" v-if='showSelectNode' append-to-body
        :close-on-click-modal="false">
        <el-form :model="dataFormNode" label-width="95px" ref="dataFormNode" size="mini" label-position="right"
          style="position: relative; left: 16px">
          <el-form-item label="支撑节点" prop="supportNodeId"
            :rules="{required: true, message: '请选择支撑节点', trigger: 'change'}">
            <el-select v-model="dataFormNode.supportNodeId" class="selectItem" placeholder="支撑节点">
              <el-option v-for="(item, index) in supportNodeList" :key="index" :label="item.nodeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="footItem">
          <el-button :size="size" type="info" @click.native="showSelectNode = false">{{ $t("action.cancel") }}
          </el-button>
          <el-button :size="size" type="primary" @click.native="submitNode">
            {{ $t("action.submit") }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 信息修改-->
      <el-dialog :close-on-click-modal="false" :visible.sync="visiableEdit" title="信息修改" v-if="visiableEdit"
        width="950px" append-to-body>
        <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size">
          <div class="rowItem">
            <el-form-item label="对端IP" >
              <el-input maxlength="200" type="textarea" v-model="dataForm.ips" placeholder="对端IP"
                class="inputItem textarea" :autosize="{ minRows: 1}" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="渠道类型" >
              <el-select v-model="dataForm.channelType" placeholder="渠道类型" class="selectItem" clearable>
                <el-option label="美团" :value="1" ></el-option>
                <el-option label="阿里" :value="2" ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="rowItem">
            <el-form-item label="appId" prop="appId">
              <el-input class="inputItem" v-model="dataForm.appId" placeholder="appId" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="appKey" prop="appKey">
              <el-input class="inputItem" v-model="dataForm.appKey" placeholder="appKey" maxlength="50"></el-input>
            </el-form-item>
          </div>
          <div class="rowItem">
            <el-form-item label="推送业务" >
              <el-select v-model="dataForm.sendPushType" placeholder="推送业务" class="selectItem" multiple>
                <el-option :label="item.label" :value="item.value" v-for="(item, index) in sendPushTypeArr"
                  :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="推送地址" prop="sendPushUrl"
            :rules="[{ trigger: 'blur', validator: validatePushUrl }]">
              <el-input maxlength="" placeholder="推送地址" v-model="dataForm.sendPushUrl" class="inputItem">
              </el-input>
            </el-form-item>
          </div>
          <div class="rowItem">
            <el-form-item label="交互地址" prop="interactUrl"
            :rules="[{ trigger: 'blur', validator: validateInteractUrl }]">
              <el-input maxlength="" placeholder="交互地址" v-model="dataForm.interactUrl" class="inputItem">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="footItem">
          <el-button :size="size" @click.native="visiableEdit = false" type="primary">取消</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm">{{ $t("action.submit") }}</el-button>
        </div>
      </el-dialog>

      <el-dialog title="查看" width="680px" :visible.sync="showFunctionInfo" :close-on-click-modal="false" append-to-body
        v-if="showFunctionInfo">
        <el-row style="padding: 0 16px;box-sizing: border-box;">
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">客户名称:</div>
            <div class="rightDiv">
              {{ formateCustomer(detailData)}}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">集团业务号码:</div>
            <div class="rightDiv">
              {{ detailData.businessNumber }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">业务场景:</div>
            <div class="rightDiv">
              {{ detailData.abilityMode }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">流控策略:</div>
            <div class="rightDiv">
              {{ detailData.strategyFlowId }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">质检策略:</div>
            <div class="rightDiv">
              {{ formateStrategyQuality(detailData) }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">免打扰策略:</div>
            <div class="rightDiv">
              {{ detailData.strategyNotDisturb == 1? '生效':'不生效' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.interactionsType">
            <div class="leftDiv">交互类别:</div>
            <div class="rightDiv">
              {{ detailData.interactionsType == 1? '一次交互':'二次交互' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.receivingLength">
            <div class="leftDiv">收号长度:</div>
            <div class="rightDiv">
              {{ detailData.receivingLength }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsFunc">
            <div class="leftDiv">短信功能:</div>
            <div class="rightDiv">
              {{ detailData.smsFunc == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.recordFunc">
            <div class="leftDiv">录音功能:</div>
            <div class="rightDiv">
              {{ detailData.recordFunc == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callPassthrough">
            <div class="leftDiv">主叫透传:</div>
            <div class="rightDiv">
              {{ detailData.callPassthrough == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callMode">
            <div class="leftDiv">呼叫权限控制:</div>
            <div class="rightDiv">
              {{ formateCallMode(detailData) }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.anumberManager">
            <div class="leftDiv">A号码管理方式:</div>
            <div class="rightDiv">
              {{ detailData.anumberManager }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.xnumberManager">
            <div class="leftDiv">x号码管理方式:</div>
            <div class="rightDiv">
              {{ detailData.xnumberManager }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.shutdownTransferFunc">
            <div class="leftDiv">关机呼转功能:</div>
            <div class="rightDiv">
              {{ detailData.shutdownTransferFunc == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.shutdownNumber">
            <div class="leftDiv">关机呼转号码:</div>
            <div class="rightDiv">
              {{ detailData.shutdownNumber }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsCollection">
            <div class="leftDiv">短信托收功能:</div>
            <div class="rightDiv">
              {{ detailData.smsCollection == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callLimitDuration">
            <div class="leftDiv">通话时长限制:</div>
            <div class="rightDiv">
              {{ detailData.callLimitDuration }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callOutRestriction">
            <div class="leftDiv">主叫限制:</div>
            <div class="rightDiv">
              {{ detailData.callOutRestriction == 1? '开放': '不开放' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.groupEmptyInCall">
            <div class="leftDiv">号码组为空状态:</div>
            <div class="rightDiv">
              {{ detailData.groupEmptyInCall == 1? '允许任意号码来电': '禁止所有号码来电' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callingCard">
            <div class="leftDiv">主叫来电名片:</div>
            <div class="rightDiv">
              {{ detailData.callingCard == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.calledCard">
            <div class="leftDiv">被叫来电名片:</div>
            <div class="rightDiv">
              {{ detailData.calledCard == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callingHangupSms">
            <div class="leftDiv">主叫挂机短信:</div>
            <div class="rightDiv">
              {{ detailData.callingHangupSms == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.calledHangupSms">
            <div class="leftDiv">被叫挂机短信:</div>
            <div class="rightDiv">
              {{ detailData.calledHangupSms == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.cfBusy">
            <div class="leftDiv">遇忙前转:</div>
            <div class="rightDiv">
              {{ detailData.cfBusy == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.cfNotReach">
            <div class="leftDiv">无应答前转:</div>
            <div class="rightDiv">
              {{ detailData.cfNotReach == 1? '开启': '关闭' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-for="(item,index) in detailData.aNumberRange" :key="index">
            <div class="leftDiv">A号码范围:</div>
            <div class="rightDiv">
              {{ item.startPhone - item.endPhone }}
            </div>
          </el-col>
        </el-row>
        <div class="viewTitle">号码鉴权</div>
        <el-row style="padding: 0px 16px; box-sizing: border-box;">
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callinAuth">
          	<div class="leftDiv">{{detailData.abilityMode == 'AXB' ? '号码鉴权':'语音呼入鉴权'}}:</div>
          	<div class="rightDiv">
          		{{ detailData.callinAuth==0?'不生效':detailData.callinAuth==1?'黑名单策略':'白名单策略'}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.callinAuthStrategyId">
          	<div class="leftDiv">{{detailData.abilityMode == 'AXB' ? '鉴权策略':'语音呼入鉴权策略'}}:</div>
          	<div class="rightDiv">
          		{{resultAuth.callin}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.calloutAuth">
          	<div class="leftDiv">语音呼出鉴权:</div>
          	<div class="rightDiv">
          		{{ detailData.calloutAuth==0?'不生效':detailData.calloutAuth==1?'黑名单策略':'白名单策略'}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.calloutAuthStrategyId">
          	<div class="leftDiv">语音呼出鉴权策略 :</div>
          	<div class="rightDiv">
          		{{resultAuth.callout}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsinAuth">
          	<div class="leftDiv">短信呼入鉴权:</div>
          	<div class="rightDiv">
          		{{ detailData.smsinAuth==0?'不生效':detailData.smsinAuth==1?'黑名单策略':'白名单策略'}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsinAuthStrategyId">
          	<div class="leftDiv">短信呼入鉴权策略 :</div>
          	<div class="rightDiv">
          		{{resultAuth.smsin}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsoutAuth">
          	<div class="leftDiv">短信呼出鉴权:</div>
          	<div class="rightDiv">
          		{{ detailData.smsoutAuth==0?'不生效':detailData.smsoutAuth==1?'黑名单策略':'白名单策略'}}
          	</div>
          </el-col>
          <el-col :span="12" class="itemDetail" v-if="controlVisiable.smsoutAuthStrategyId">
          	<div class="leftDiv">短信呼出鉴权策略 :</div>
          	<div class="rightDiv">
          		{{resultAuth.smsout}}
          	</div>
          </el-col>
        </el-row>
        <div class="footItem">
          <el-button :size="size" @click.native="showFunctionInfo = false" type="primary">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="编辑" width="950px" :visible.sync="showFunctionInfoEdit" :close-on-click-modal="false"
        append-to-body v-if="showFunctionInfoEdit">

        <el-form :model="functionForm" label-width="160px" :rules="functionFormRules"
          style="position: relative; left: -12px;box-sizing: border-box;" ref="functionForm" :size="size">
          <el-row >
            <el-col :span="12">
              <el-form-item label="客户名称">
                <el-select class="selectItem" v-model="functionForm.customerId" placeholder="请选择" filterable disabled>
                  <el-option v-for="(item,index) in customerList" :key="index" :label="item.customerName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="集团业务号码">
                <el-input v-model="functionForm.businessNumber" placeholder="集团业务号码" maxlength="50" clearable
                  class="inputItem" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务场景">
                <el-select class="selectItem" v-model="functionForm.abilityMode" placeholder="请选择" disabled>
                  <el-option v-for="(item,index) in abilityModeList" :key="index" :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流控策略" :rules="[{ trigger: 'change', message: '请选择流控策略'}]">
                <el-select v-model="functionForm.strategyFlowId" placeholder="流控策略" class="selectItem" clearable>
                  <el-option :label="item.strategyName" :value="item.id" v-for="(item, index) in flowList" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="质检策略" :rules="[{ trigger: 'change', message: '请选择质检策略'}]">
                <el-select v-model="functionForm.strategyQualityId" placeholder="质检策略" class="selectItem" clearable>
                  <el-option :label="item.strategyName" :value="item.id" v-for="(item, index) in queList" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="免打扰策略" prop="strategyNotDisturb"
                :rules="[{ trigger: 'change', required: true, message: '请选择免打扰策略'}]">
                <el-select v-model="functionForm.strategyNotDisturb" placeholder="免打扰策略" class="selectItem">
                  <el-option label="生效" :value="1"></el-option>
                  <el-option label="不生效" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>


            <el-col :span="12" v-if="controlVisiable.interactionsType">
              <el-form-item label="交互类别" prop="interactionsType"
                :rules="[{ trigger: 'change', required: true, message: '请选择交互类别'}]">
                <el-select v-model="functionForm.interactionsType" placeholder="交互类别" class="selectItem" clearable>
                  <el-option label="一次交互" :value="1"></el-option>
                  <el-option label="二次交互" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.receivingLength">
              <el-form-item label="收号长度" prop="receivingLength"
                :rules="[{ required: true, message: '请输入收号长度', trigger: 'blur'},{ trigger: 'blur', validator: validateReceivingLength}]">
                <el-input maxlength="2" placeholder="收号长度" v-model="functionForm.receivingLength"
                  oninput="value=value.replace(/[^\d]/g,'')" class="inputItem">
                </el-input>
              </el-form-item>
            </el-col>



            <el-col :span="12" v-if="controlVisiable.smsFunc">
              <el-form-item label="短信功能" prop="smsFunc"
                :rules="[{ trigger: 'change', required: true, message: '请选择短信功能'}]">
                <el-select v-model="functionForm.smsFunc" placeholder="短信功能" class="selectItem">
                  <el-option label="开放" :value="1"></el-option>
                  <el-option label="不开放" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.recordFunc">
              <el-form-item label="录音功能" prop="recordFunc"
                :rules="[{ trigger: 'change', required: true, message: '请选择录音功能'}]">
                <el-select v-model="functionForm.recordFunc" placeholder="录音功能" class="selectItem">
                  <el-option label="推送" :value="1"></el-option>
                  <el-option label="不推送" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callPassthrough">
              <el-form-item label="主叫透传" prop="callPassthrough"
                :rules="[{ trigger: 'change', required: true, message: '请选择主叫透传'}]">
                <el-select v-model="functionForm.callPassthrough" placeholder="主叫透传" class="selectItem">
                  <el-option label="开放" :value="1"></el-option>
                  <el-option label="不开放" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="controlVisiable.callMode">
              <el-form-item label="呼叫权限控制" prop="callMode"
                :rules="[{ trigger: 'change', required: true, message: '请选择呼叫权限控制'}]">
                <el-select v-model="functionForm.callMode" placeholder="呼叫权限控制" class="selectItem">
                  <el-option :label="item.label" :value="item.value" v-for="(item, index) in callModeList" :key="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.anumberManager">
              <el-form-item label="A号码管理方式" prop="anumberManager"
                :rules="[{ trigger: 'change', required: true, message: '请选择A号码管理方式'}]">
                <el-select v-model="functionForm.anumberManager" placeholder="A号码管理方式" class="selectItem">
                  <el-option label="group" value="group"></el-option>
                  <el-option label="unlimited" value="unlimited"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.xnumberManager">
              <el-form-item label="x号码管理方式" prop="xnumberManager"
                :rules="[{ trigger: 'change', required: true, message: '请选择x号码管理方式'}]">
                <el-select v-model="functionForm.xnumberManager" placeholder="x号码管理方式" class="selectItem">
                  <el-option label="random" value="random"></el-option>
                  <el-option label="assign" value="assign"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.shutdownTransferFunc">
              <el-form-item label="关机呼转功能" prop="shutdownTransferFunc"
                :rules="[{ trigger: 'change', required: true, message: '请选择关机呼转功能'}]">
                <el-select v-model="functionForm.shutdownTransferFunc" placeholder="x关机呼转功能" class="selectItem">
                  <el-option label="不开放" :value="0"></el-option>
                  <el-option label="开放" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.shutdownNumber">
              <el-form-item :rules="[
                  {
                    pattern:  /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/,
                    message: '请输入正确的号码',
                    trigger: 'blur',
                  },
                ]" label="关机呼转号码" prop="shutdownNumber">
                <el-input maxlength="11" placeholder="关机呼转号码" v-model="functionForm.shutdownNumber" class="inputItem">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.smsCollection">
              <el-form-item label="短信托收功能" prop="smsCollection"
                :rules="[{ trigger: 'change', required: true, message: '请选择短信托收功能'}]">
                <el-select v-model="functionForm.smsCollection" placeholder="短信托收功能" class="selectItem">
                  <el-option label="不开放" :value="0"></el-option>
                  <el-option label="开放" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callLimitDuration">
              <el-form-item label="通话时长限制" prop="callLimitDuration"
                :rules="[{ trigger: 'change', validator: validatePass }]">
                <el-input maxlength="10" placeholder="通话时长限制" v-model="functionForm.callLimitDuration"
                  class="inputItem">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callOutRestriction">
              <el-form-item label="主叫限制" prop="callOutRestriction"
                :rules="[{ trigger: 'change', required: true, message: '请选择主叫限制'}]">
                <el-select v-model="functionForm.callOutRestriction" placeholder="主叫限制" class="selectItem">
                  <el-option label="不开放" :value="0"></el-option>
                  <el-option label="开放" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.groupEmptyInCall">
              <el-form-item label="号码组为空状态" prop="groupEmptyInCall"
                :rules="[{ trigger: 'change', required: true, message: '请选择号码组为空状态'}]">
                <el-select v-model="functionForm.groupEmptyInCall" placeholder="号码组为空状态" class="selectItem">
                  <el-option label="禁止所有号码来电" :value="0"></el-option>
                  <el-option label="允许任意号码来电" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callingCard">
              <el-form-item label="主叫来电名片" prop="callingCard"
                :rules="[{ trigger: 'change', required: true, message: '请选择主叫来电名片'}]">
                <el-select v-model="functionForm.callingCard" placeholder="主叫来电名片" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.calledCard">
              <el-form-item label="被叫来电名片" prop="calledCard"
                :rules="[{ trigger: 'change', required: true, message: '请选择被叫来电名片'}]">
                <el-select v-model="functionForm.calledCard" placeholder="被叫来电名片" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callingHangupSms">
              <el-form-item label="主叫挂机短信" prop="callingHangupSms"
                :rules="[{ trigger: 'change', required: true, message: '请选择主叫挂机短信'}]">
                <el-select v-model="functionForm.callingHangupSms" placeholder="主叫挂短" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.calledHangupSms">
              <el-form-item label="被叫挂机短信" prop="calledHangupSms"
                :rules="[{ trigger: 'change', required: true, message: '请选择被叫挂机短信'}]">
                <el-select v-model="functionForm.calledHangupSms" placeholder="被叫挂机短信" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.cfBusy">
              <el-form-item label="遇忙前转" prop="cfBusy"
                :rules="[{ trigger: 'change', required: true, message: '请选择遇忙前转'}]">
                <el-select v-model="functionForm.cfBusy" placeholder="遇忙前转" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.cfNotReach">
              <el-form-item label="无应答前转" prop="cfNotReach"
                :rules="[{ trigger: 'change', required: true, message: '请选择无应答前转'}]">
                <el-select v-model="functionForm.cfNotReach" placeholder="无应答前转" class="selectItem">
                  <el-option label="关闭" :value="0"></el-option>
                  <el-option label="开启" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="controlVisiable.aNumberRange">
              <el-col :span="12" v-for="(item,index) in functionForm.aNumberRange" :key="index">
                <el-form-item label="A号码范围(11645)" :prop=" 'aNumberRange.'+ index +'.startPhone' "
                  :rules="manyDataRules">
                  <div class="APhoneItem">
                    <div class="AStartPhone">
                      <div class="APhone">
                        <el-input maxlength="8" placeholder="开始号码" oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="functionForm.aNumberRange[index].startPhone">
                        </el-input>
                        <span class="centerText">至</span>
                        <el-input maxlength="8" placeholder="结束号码" oninput="value=value.replace(/[^\d.]/g,'')"
                          v-model="functionForm.aNumberRange[index].endPhone">
                        </el-input>
                      </div>
                    </div>
                    <template>
                      <div>
                        <el-button :size="size" type="info" @click.native="addCall" v-if="index == 0">新增</el-button>
                        <el-button :size="size" type="info" @click.native="deleteCall(index)" v-else>删除</el-button>
                      </div>
                    </template>
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <div class="editTitle">号码鉴权</div>
          <el-row>
            <el-col :span="12" v-if="controlVisiable.callinAuth">
              <el-form-item :label="functionForm.abilityMode == 'AXB' ? '号码鉴权':'语音呼入鉴权'" prop="callinAuth"
                :rules="[{ trigger: 'change', required: true, message: `请选择${functionForm.abilityMode == 'AXB' ? '号码鉴权':'语音呼入鉴权'}`}]">
                <el-select v-model="functionForm.callinAuth" :placeholder="functionForm.abilityMode == 'AXB' ? '号码鉴权':'语音呼入鉴权'" class="selectItem"
                  @change="getCallinAuthStrategyId(...arguments)">
                  <el-option label="不生效" :value="0"></el-option>
                  <el-option label="黑名单策略" :value="1"></el-option>
                  <el-option label="白名单策略" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="controlVisiable.callinAuthStrategyId">
              <el-form-item :label="functionForm.abilityMode == 'AXB' ?'鉴权策略':'语音呼入鉴权策略'" prop="callinAuthStrategyId"
                :rules="[{ trigger: 'change', required: isShowCallinAuthStrategyId, message: `请选择${functionForm.abilityMode == 'AXB' ?'鉴权策略':'语音呼入鉴权策略'}`}]">
                <el-select v-model="functionForm.callinAuthStrategyId" :placeholder="functionForm.abilityMode == 'AXB' ?'鉴权策略':'语音呼入鉴权策略'" class="selectItem">
                  <el-option :label="item.strategyShortName" :value="item.id"
                    v-for="(item,index) in CallinAuthStrategyList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="controlVisiable.calloutAuth">
              <el-form-item label="语音呼出鉴权" prop="calloutAuth"
                :rules="[{ trigger: 'change', required: true, message: '请选择语音呼出鉴权'}]">
                <el-select v-model="functionForm.calloutAuth" placeholder="语音呼出鉴权" class="selectItem"
                  @change="getCalloutAuthStrategyId(...arguments)">
                  <el-option label="不生效" :value="0"></el-option>
                  <el-option label="黑名单策略" :value="1"></el-option>
                  <el-option label="白名单策略" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 鉴权策略简称 -->


            <el-col :span="12" v-if="controlVisiable.calloutAuthStrategyId">
              <el-form-item label="语音呼出鉴权策略"  prop="calloutAuthStrategyId"
                :rules="[{ trigger: 'change', required: isShowCalloutAuthStrategyId, message: '请选择语音呼出鉴权策略'}]">
                <el-select v-model="functionForm.calloutAuthStrategyId" placeholder="语音呼出鉴权策略" class="selectItem">
                  <el-option :label="item.strategyShortName" :value="item.id"
                    v-for="(item,index) in CalloutAuthStrategyList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 短信鉴权 -->
          <el-row>
            <el-col :span="12" v-if="controlVisiable.smsinAuth">
              <el-form-item label="短信呼入鉴权" prop="smsinAuth"
                :rules="[{ trigger: 'change', required: true, message: '请选择短信呼入鉴权'}]">
                <el-select v-model="functionForm.smsinAuth" placeholder="短信呼入鉴权" class="selectItem"
                  @change="getSmsinAuthStrategyId(...arguments)">
                  <el-option label="不生效" :value="0"></el-option>
                  <el-option label="黑名单策略" :value="1"></el-option>
                  <el-option label="白名单策略" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 鉴权策略简称 -->
            <el-col :span="12" v-if="controlVisiable.smsinAuthStrategyId">
              <el-form-item label="短信呼入鉴权策略" prop="smsinAuthStrategyId"
                :rules="[{ trigger: 'change', required: isShowSmsinAuthStrategyId, message: '请选择短信呼入鉴权策略'}]">
                <el-select v-model="functionForm.smsinAuthStrategyId" placeholder="短信呼入鉴权策略" class="selectItem">
                  <el-option :label="item.strategyShortName" :value="item.id"
                    v-for="(item,index) in smsinAuthStrategyList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>

            <el-col :span="12" v-if="controlVisiable.smsoutAuth">
              <el-form-item label="短信呼出鉴权" prop="smsoutAuth"
                :rules="[{ trigger: 'change', required: true, message: '请选择短信呼出鉴权'}]">
                <el-select v-model="functionForm.smsoutAuth" placeholder="短信呼出鉴权" class="selectItem"
                  @change="getSmsoutAuthStrategyId(...arguments)">
                  <el-option label="不生效" :value="0"></el-option>
                  <el-option label="黑名单策略" :value="1"></el-option>
                  <el-option label="白名单策略" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 鉴权策略简称 -->


            <el-col :span="12" v-if="controlVisiable.smsoutAuthStrategyId">
              <el-form-item label="短信呼出鉴权策略" prop="smsoutAuthStrategyId"
                :rules="[{ trigger: 'change', required: isShowSmsoutAuthStrategyId, message: '请选择短信呼出鉴权策略'}]">
                <el-select v-model="functionForm.smsoutAuthStrategyId" placeholder="短信呼出鉴权策略" class="selectItem">
                  <el-option :label="item.strategyShortName" :value="item.id"
                    v-for="(item,index) in smsoutAuthStrategyList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="footItem">
          <el-button :size="size" @click.native="showFunctionInfoEdit = false" type="info">{{
            $t("action.cancel")
          }}</el-button>
          <el-button :size="size" type="primary" @click.native="submitInfoForm">{{
            $t("action.submit")
          }}</el-button>
        </div>
      </el-dialog>

      <!-- 号码明细-->
      <el-dialog title="号码明细" width="1100px" :visible.sync="editDialogVisiblenum" append-to-body
        v-if="editDialogVisiblenum" :close-on-click-modal="false">
        <div class="toolbar">
          <el-form :inline="true" :size="size" >
            <el-form-item label="号码">
              <el-input style="width: 170px" maxlength="20" v-model="paramsnum.telX" placeholder="号码"></el-input>
            </el-form-item>
            <el-form-item label="节点名称">
              <el-select class="selectTool" v-model="paramsnum.nodeName" placeholder="请选择" >
                <el-option  label="全部" :value="null"></el-option>
                <el-option v-for="(item,index) in supportNodeList" :key="index" :label="item.nodeName" :value="item.nodeName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="集团业务号码">
              <el-input style="width: 170px" v-model="paramsnum.businessNumber" placeholder="集团业务号码" maxlength="50">
              </el-input>
            </el-form-item>
            <el-form-item>
              <kt-button icon="fa fa-search" :label="$t('action.search')" type="primary"
                perms="base:number:findCustomerNumberPage" @click="findpageNum1(null)" />
              <kt-button icon="el-icon-upload" :label="'导出'" type="primary" perms="base:number:exportCustomerNumbers"
                @click="exportDatanum(null)" />
            </el-form-item>
          </el-form>
        </div>
        <div class="tableItem" style="padding: 0 18px 18px 18px">
          <kt-table :height="450" :data="pageResultnum"  :columns="columnsnum"
            :showOperation="false" @findPage="findpageNum">
          </kt-table>
        </div>
      </el-dialog>

      <!-- 应用产品信息-->
      <el-dialog title="应用产品信息" width="1100px" :visible.sync="appProductDialogVisible" append-to-body
        v-if="appProductDialogVisible" :close-on-click-modal="false">
        <div class="toolbar">
          <el-form :inline="true" :size="size" >
            <el-form-item label="产品属性编码">
              <el-input style="width: 170px" maxlength="20" v-model="paramsAppProduct.productAttrCode" placeholder="产品属性编码"></el-input>
            </el-form-item>
            <el-form-item label="属性名称">
              <el-input style="width: 170px" maxlength="20" v-model="paramsAppProduct.productAttrName" placeholder="属性名称"></el-input>
            </el-form-item>
            <el-form-item>
              <kt-button icon="fa fa-search" :label="$t('action.search')" type="primary"
                perms="base:appProductAttr:findPage" @click="findpageAppProductSearch(null)" />
            </el-form-item>
          </el-form>
        </div>
        <div class="tableItem" style="padding: 0 18px 18px 18px">
          <kt-table :height="450" :data="pageResultAppProduct"  :columns="columnsAppProduct"
            :showOperation="false" @findPage="findpageAppProduct" ref="tableItem">
          </kt-table>
        </div>
      </el-dialog>


      <!-- 自动化配置 -->
      <autoConfig ref="autoConfig" @findPage="findPage"></autoConfig>




    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  import KtTable from "@/views/Core/KtTable";
  // 自动化配置
  import autoConfig from "@/components/CustomerAccount/autoConfig"
  import {
    format
  } from "@/utils/datetime";

  export default {
    components: {
      KtButton,
      KtTable,
      autoConfig
    },
    data() {
      var validatePushUrl = (rule, value, callback) => {
        var regCN = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;
        let regBACK = /\s/g;
        if (regCN.test(value) || regBACK.test(value)) {
          callback(new Error("不允许输入中文和空格"));
        } else {
          callback();
        }
      };
      var validateInteractUrl = (rule, value, callback) => {
        var regCN = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;
        let regBACK = /\s/g;
        if (regCN.test(value) || regBACK.test(value)) {
          callback(new Error("不允许输入中文和空格"));
        } else {
          callback();
        }
      };
      var validateReceivingLength = (rule, value, callback) => {
        let numLength = [...value]
        if (value > 0 && value <= 30) {
          if (numLength.length == 2 && numLength[0] == 0) {
            callback(new Error("收号长度1至30"));
          }
          callback();
        } else {
          callback(new Error("收号长度1至30"));
        }
      };
      var validateIPAddress = (rule, value, callback) => {
        let regexp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
        let valdata = value.split(',');
        let isCorrect = true;
        if (valdata.length) {
          for (let i = 0; i < valdata.length; i++) {
            if (regexp.test(valdata[i]) == false) {
              isCorrect = false;
            }
          }
        }
        // 因为不是必填项所以为空是直接返回
        if (value == '') {
          return callback();
        } else if (!isCorrect) {
          callback(new Error('请输入正确对端IP'));
        } else {
          callback()
        }
      };
      var validatePass = (rule, value, callback) => {
        if (
          !(
            (value > 60 && value < 68400) ||
            value == 0 ||
            value == 60 ||
            value == 68400
          )
        ) {
          callback(new Error("通话时长有效值为0或60至86400"));
        } else {
          callback();
        }
      };
      var AnumberRules = (rule, value, callback) => {
        let index = rule.field.split('.')[1] - 0;
        let tempNumberRangeVos = this.functionForm.aNumberRange
        let tempStartPhone = this.functionForm.aNumberRange[index].startPhone
        let tempEndPhone = this.functionForm.aNumberRange[index].endPhone

        if (!this.functionForm.aNumberRange[index].startPhone && !this.functionForm.aNumberRange[index].endPhone) {
          callback(new Error('请输入A号码范围'))
        } else if (this.functionForm.aNumberRange[index].startPhone && !this.functionForm.aNumberRange[index]
          .endPhone) {
          callback(new Error('请输入正确的A号码结束范围'))
        } else if (this.functionForm.aNumberRange[index].endPhone && !this.functionForm.aNumberRange[index]
          .startPhone) {
          callback(new Error('请输入正确的A号码开始范围'))
        } else if ((this.functionForm.aNumberRange[index].startPhone + '').length < 8 || (this.functionForm
            .aNumberRange[index].endPhone + '').length < 8) {
          callback(new Error('请输入正确的A号码范围'))
        } else if (this.functionForm.aNumberRange[index].startPhone * 1 > this.functionForm.aNumberRange[index]
          .endPhone * 1) {
          callback(new Error('请输入正确的A号码范围'))
        } else {
          for (let i = 0; i < tempNumberRangeVos.length; i++) {
            if (index == i) {
              continue
            }
            if ((tempStartPhone >= tempNumberRangeVos[i].startPhone && tempStartPhone <= tempNumberRangeVos[i]
                .endPhone) || (tempEndPhone >= tempNumberRangeVos[i].startPhone && tempEndPhone <= tempNumberRangeVos[
                i].endPhone)) {
              callback(new Error('请输入正确的A号码范围'))
              return
            }
          }
          callback();
        }
      };
      return {
        validatePushUrl: validatePushUrl,
        validateInteractUrl: validateInteractUrl,
        detailData: {},
        validateReceivingLength: validateReceivingLength,
        validatePass: validatePass,
        modalType: {
          AX: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'shutdownTransferFunc', // 关机呼转功能
            'shutdownNumber', // 关机呼转号码
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'cfBusy', // 遇忙前转
            'cfNotReach', // 无应答前传
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          axExtensionV1: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'shutdownTransferFunc', // 关机呼转功能
            'shutdownNumber', // 关机呼转号码
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'cfBusy', // 遇忙前转
            'cfNotReach', // 无应答前传
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          AXG: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'shutdownTransferFunc', // 关机呼转功能
            'shutdownNumber', // 关机呼转号码
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callOutRestriction', // 主叫限制
            'groupEmptyInCall', // 号码组为空状态
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'cfBusy', // 遇忙前转
            'cfNotReach', // 无应答前传
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          AXB: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'callMode', //呼叫权限控制
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
          ],
          AXYB: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callMode', //呼叫权限控制
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'shutdownTransferFunc', // 关机呼转功能
            'shutdownNumber', // 关机呼转号码
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          AXYBN: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callMode', //呼叫权限控制
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'shutdownTransferFunc', // 关机呼转功能
            'shutdownNumber', // 关机呼转号码
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callOutRestriction', // 主叫限制
            'groupEmptyInCall', // 号码组为空状态
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          // 交互模式
          interactive: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          // 双呼模式
          doubleCall: [
            'recordFunc', // 录音功能
            'callMode', //呼叫权限控制
            'callLimitDuration', //通话时长限制
            'aNumberRange', // A号码段
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          AYB: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'callMode', //呼叫权限控制
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          // AX直呼
          axDirectCall: [
            'smsFunc', //短信功能
            'recordFunc', // 录音功能
            'callPassthrough', //主叫透传
            'anumberManager', //A号码管理方式
            'xnumberManager', //X号码管理方式
            'smsCollection', //短信托收功能
            'callLimitDuration', //通话时长限制
            'callingCard', // 主叫来电名片
            'calledCard', // 被叫来电名片
            'callingHangupSms', // 主叫挂机短信
            'calledHangupSms', // 被叫挂机短信
            'cfBusy', // 遇忙前转
            'cfNotReach', // 无应答前传
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ],
          // AX分机
          axExtension: [
            'recordFunc', // 录音功能
            'interactionsType', //交互类别
            'receivingLength', //收号长度
            'callinAuth', //语音呼入鉴权
            'callinAuthStrategyId', //语音呼入鉴权策略
            'calloutAuth', //语音呼出鉴权
            'calloutAuthStrategyId', //语音呼出鉴权策略
            'smsinAuth', //短信呼入鉴权
            'smsinAuthStrategyId', //短信呼入鉴权策略
            'smsoutAuth', //短信呼出鉴权
            'smsoutAuthStrategyId', //短信呼出鉴权策略
          ]
        },
        controlVisiable: {
          'smsFunc': false, //短信功能
          'recordFunc': false, // 录音功能
          'callMode': false, //呼叫权限控制
          'callPassthrough': false, //主叫透传
          'anumberManager': false, //A号码管理方式
          'xnumberManager': false, //X号码管理方式
          'shutdownTransferFunc': false, // 关机呼转功能
          'shutdownNumber': false, // 关机呼转号码
          'smsCollection': false, //短信托收功能
          'callLimitDuration': false, //通话时长限制
          'callOutRestriction': false, //主叫限制
          'groupEmptyInCall': false, //号码组为空状态
          'callingCard': false, // 主叫来电名片
          'calledCard': false, // 被叫来电名片
          'callingHangupSms': false, // 主叫挂机短信
          'calledHangupSms': false, // 被叫挂机短信
          'cfBusy': false, // 遇忙前转
          'cfNotReach': false, // 无应答前传
          'aNumberRange': false, //A号码范围
          'interactionsType': false, //交互类别
          'receivingLength': false, //收号长度
          'callinAuth': false, //语音呼入鉴权
          'callinAuthStrategyId': false, //语音呼入鉴权策略
          'calloutAuth': false, //语音呼出鉴权
          'calloutAuthStrategyId': false, //语音呼出鉴权策略
          'smsinAuth': false, //短信呼入鉴权
          'smsinAuthStrategyId': false, //短信呼入鉴权策略
          'smsoutAuth': false, //短信呼出鉴权
          'smsoutAuthStrategyId': false, //短信呼出鉴权策略
        },
        functionForm: {
          'customerId': null, //客户名称
          'businessNumber': null, // 集团业务号码
          'abilityMode': null, //业务场景
          'supportNodeId': null, //支撑节点
          'sendPushType': null, //推送业务
          'sendPushUrl': null, //推送地址
          'strategyFlowId': null, //流控策略
          'strategyQualityId': null, //质检策略
          //峰值并发策略
          'strategyNotDisturb': null, //免打扰策略
          //轻骚扰策略
          'smsFunc': null, //短信功能
          'recordFunc': null, // 录音功能
          'callMode': null, //呼叫权限控制
          'callPassthrough': null, //主叫透传
          'anumberManager': null, //A号码管理方式
          'xnumberManager': null, //X号码管理方式
          'shutdownTransferFunc': null, // 关机呼转功能
          'shutdownNumber': null, // 关机呼转号码
          'smsCollection': null, //短信托收功能
          'callLimitDuration': null, //通话时长限制
          'callOutRestriction': null, //主叫限制
          'groupEmptyInCall': null, //号码组为空状态
          'callingCard': null, // 主叫来电名片
          'calledCard': null, // 被叫来电名片
          'callingHangupSms': null, // 主叫挂机短信
          'calledHangupSms': null, // 被叫挂机短信
          'cfBusy': null, // 遇忙前转
          'cfNotReach': null, // 无应答前传
          'aNumberRange': null, //A号码范围
          'interactionsType': null, //交互类别
          'receivingLength': null, //收号长度
          'callinAuth': false, //语音呼入鉴权
          'callinAuthStrategyId': false, //语音呼入鉴权策略
          'calloutAuth': false, //语音呼出鉴权
          'calloutAuthStrategyId': false, //语音呼出鉴权策略
          'smsinAuth': false, //短信呼入鉴权
          'smsinAuthStrategyId': false, //短信呼入鉴权策略
          'smsoutAuth': false, //短信呼出鉴权
          'smsoutAuthStrategyId': false, //短信呼出鉴权策略
        },
        functionFormRules: {

        },
        manyDataRules: [{
          required: true,
          validator: AnumberRules,
          trigger: 'blur'
        }, ],
        showFunctionInfoEdit: false, // 是否显示编辑功能信息
        showFunctionInfo: false, // 是否显示功能信息
        visiableEdit: false, // 是否显示修改信息
        showSelectNode: false, // 是否显示节点变更
        dataForm: {
          ips: null,
          appId: null,
          appKey: null,
          sendPushType: null,
          sendPushUrl: null,
          channelType: null,
          interactUrl: null
        },
        dataFormRules: {
          ips: [{
            required: true,
            validator: validateIPAddress,
            trigger: 'blur',
          }],
          appId: [{
            required: true,
            message: "请输入appId",
            trigger: "blur"
          }],
          appKey: [{
            required: true,
            message: "请输入appKey",
            trigger: "blur"
          }],
          sendPushType: [{
            required: true,
            message: "请选择推送业务",
            trigger: "change"
          }, ],
          sendPushUrl: [{
            required: true,
            message: "请输入推送地址",
            trigger: "blur"
          }]
        },
        dataFormNode: {
          supportNodeId: null
        },
        viewDialogVisible: false,
        filterColumns: [{
            prop: "customerName",
            label: "签约客户名称",
            minWidth: 120,
          },
          {
            prop: "customerCode",
            label: "集团客户编码",
            minWidth: 120,
          },
          {
            prop: "businessNumber",
            label: "集团业务号码",
            minWidth: 120,
          },
          {
            prop: "abilityMode",
            label: "业务场景",
            minWidth: 80,
          },
          {
            prop: "supportNodeId",
            label: "支撑节点",
            minWidth: 80,
            formatter: this.formateSupportNode
          },
          {
            prop: "platformCustomerShortName",
            label: "平台客户简称",
            minWidth: 120,
          },
          {
            prop: "platformAbilityMode",
            label: "平台小号模式",
            minWidth: 120,
          },
          {
            prop: "commodityShortName",
            label: "平台商品简称",
            minWidth: 120,
          },
        ],
        pageResult: [],
        loading: false,
        size: 'mini',
        pageRequest: {
          pageNum: 1,
          pageSize: 20,
          param: {
            customerId: null,
            businessNumber: null,
            abilityMode: null,
            supportNodeId: null
          }
        },
        supportNodeList: [], //支撑节点列表
        sendPushTypeArr: [], //推送业务列表
        abilityModeList: [], // 业务场景列表
        flowList: [], // 流控策略列表
        queList: [], //质检策略
        customerList: [], //客户列表
        callModeList: [], //呼叫权限控制
        isShowCallinAuthStrategyId: false, // 语音呼入鉴权策略动态显示必填费必填
        isShowCalloutAuthStrategyId: false, // 语音呼出鉴权策略动态显示必填费必填
        isShowSmsinAuthStrategyId: false, // 短信呼入鉴权策略动态显示必填费必填
        isShowSmsoutAuthStrategyId: false, // 短信呼出鉴权策略动态显示必填费必填
        // 鉴权列表
        CallinAuthStrategyList: [],
        CalloutAuthStrategyList: [],
        smsinAuthStrategyList: [],
        smsoutAuthStrategyList: [],
        // 号码明细
        editDialogVisiblenum: false,
        paramsnum: {
          customerId: null, //客户id  必须要传
          telX: null, //号码
          nodeName: null,
          businessNumber: null,
        },
        pageRequestnum: {
          pageNum: 1,
          pageSize: 10,
          param: {},
        },
        pageResultnum: {},
        columnsnum: [{
            prop: "telX",
            label: "号码",
            minWidth: 120,
          },
          {
            prop: "nodeName",
            label: "节点名称",
            minWidth: 100,
          },
          {
            prop: "abilityMode",
            label: "开通场景",
            minWidth: 100,
          },
          {
            prop: "businessNumber",
            label: "集团业务号码",
            minWidth: 100,
          },
          {
            prop: "provinceName",
            label: "号码归属省",
            minWidth: 180,
          },
          {
            prop: "cityName",
            label: "号码归属市",
            minWidth: 180,
          },
        ],
        // 应用产品明细
        appProductDialogVisible: false,
        paramsAppProduct: {
          customerAppId: null, // 客户应用ID，必填
          productAttrCode: null, //产品属性编码
          productAttrName: null, //属性名称
        },
        pageRequestAppProduct: {
          pageNum: 1,
          pageSize: 10,
          param: {},
        },
        pageResultAppProduct: {},
        columnsAppProduct: [{
            prop: "businessNumber",
            label: "集团业务号码",
            minWidth: 120,
          },
          {
            prop: "productAttrCode",
            label: "产品属性编码",
            minWidth: 100,
          },
          {
            prop: "productAttrName",
            label: "属性名称",
            minWidth: 100,
          },
          {
            prop: "attributeValue",
            label: "属性值",
            minWidth: 100,
          },
          {
            prop: "attributeValueUnit",
            label: "属性值单位",
            minWidth: 100,
            formatter: this.formateAttributeValueUnit
          },
          {
            prop: "explain",
            label: "说明",
            minWidth: 100,
          },
        ],
        attributeValueUnitList: [],
        resultAuth: {
          callin: null,
          callout: null,
          smsin: null,
          smsout: null
        },
      }
    },
    methods: {
      // 自动化配置
      autoConfig(row) {
        this.$refs.autoConfig.parentHandle(row);
      },
      init() {
        this.controlVisiable = {
          'smsFunc': false, //短信功能
          'recordFunc': false, // 录音功能
          'callMode': false, //呼叫权限控制
          'callPassthrough': false, //主叫透传
          'anumberManager': false, //A号码管理方式
          'xnumberManager': false, //X号码管理方式
          'shutdownTransferFunc': false, // 关机呼转功能
          'shutdownNumber': false, // 关机呼转号码
          'smsCollection': false, //短信托收功能
          'callLimitDuration': false, //通话时长限制
          'callOutRestriction': false, //主叫限制
          'groupEmptyInCall': false, //号码组为空状态
          'callingCard': false, // 主叫来电名片
          'calledCard': false, // 被叫来电名片
          'callingHangupSms': false, // 主叫挂机短信
          'calledHangupSms': false, // 被叫挂机短信
          'cfBusy': false, // 遇忙前转
          'cfNotReach': false, // 无应答前传
          'aNumberRange': false, //A号码范围
          'interactionsType': false, //交互类别
          'receivingLength': false, //收号长度
        };
        this.isShowCallinAuthStrategyId = false; // 语音呼入鉴权策略动态显示必填费必填
        this.isShowCalloutAuthStrategyId = false; // 语音呼出鉴权策略动态显示必填费必填
        this.isShowSmsinAuthStrategyId = false; // 短信呼入鉴权策略动态显示必填费必填
        this.isShowSmsoutAuthStrategyId = false; // 短信呼出鉴权策略动态显示必填费必填
        this.resultAuth = {
          callin: null,
          callout: null,
          smsin: null,
          smsout: null
        };
      },
      parentHandle(id) {
        this.pageRequest = {
            pageNum: 1,
            pageSize: 20,
            param: {
              customerId: id,
              businessNumber: null,
              abilityMode: null,
              supportNodeId: null
            }
          },
          this.viewDialogVisible = true;
        this.findPage();
        this.getDict();
      },
      // 获取字典
      getDict() {
        // 支撑节点
        this.$api.CustomerAppManage.findAllSupportNode().then((res) => {
          if (res.code == 200) {
            this.supportNodeList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });

        this.$api.dict.findByType({
          type: "send_push_type"
        }).then((res) => {
          this.sendPushTypeArr = res.data;
        });

        this.$api.dict.findByType({
          type: "abilityMode"
        }).then((res) => {
          this.abilityModeList = res.data
        });
        // 呼出权限控制
        this.$api.dict.findByType({
          type: "callMode"
        }).then((res) => {
          this.callModeList = res.data
        });

        // 流控策略
        this.$api.CustomerAccount.flowFindAll().then(res => {
          if (res.code == 200) {
            this.flowList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })

        this.$api.CustomerAccount.queFindAll().then(res => {
          if (res.code == 200) {
            this.queList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })

        // 获取所有客户
        this.$api.CustomerAppManage.findAllCustomer().then((res) => {
          if (res.code == 200) {
            this.customerList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });

        // 属性值单位
        this.$api.dict.findByType({type: 'attributeValueUnit'}).then((res) => {
          if (res.code == 200) {
            this.attributeValueUnitList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      },
      formateAttributeValueUnit(row) {
        let data;
        this.attributeValueUnitList.forEach(res=>{
          if (row.attributeValueUnit == res.value) {
            data = res.label
          }
        })
        return data
      },
      formateStrategyQuality(row) {
        let data;
        this.queList.forEach(res=>{
          if (row.strategyQualityId == res.id) {
            data = res.strategyName
          }
        })
        return data
      },
      // 回写获取推送业务列表
      getArr(value) {
        let newArr = [];
        if ((1 & value) == 1) {
          newArr.push("1");
        }
        if ((2 & value) == 2) {
          newArr.push("2");
        }
        if ((4 & value) == 4) {
          newArr.push("4");
        }
        if ((8 & value) == 8) {
          newArr.push("8");
        }
        return newArr;
      },
      formateSupportNode(row) {
        let data;
        this.supportNodeList.forEach(res => {
          if (row.supportNodeId == res.id) {
            data = res.nodeName
          }
        })
        return data
      },
      formateCustomer(row) {
        let data;
        this.customerList.forEach(res => {
          if (row.customerId == res.id) {
            data = res.customerName
          }
        })
        return data
      },
      formateCallMode(row) {
        let data;
        this.callModeList.forEach(res => {
          if (row.callMode == res.value) {
            data = res.label
          }
        })
        return data
      },
      findPage() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.pageRequest));

        this.$api.CustomerAppManage.findPageApp(data).then((res) => {
          if (res.code == 200) {
            this.pageResult = res.data
            this.loading = false
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
      },
      refreshPageRequest(pageNum) {
        this.pageRequest.pageNum = pageNum;
        this.findPage();
      },
      sizeChange(e) {
        this.pageRequest.pageSize = e;
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      // 修改信息
      changeInfo(row) {
        let data = JSON.parse(JSON.stringify(row));
        data.sendPushType = this.getArr(data.sendPushType);
        this.dataForm = {
          id: data.id,
          businessNumber: data.businessNumber,
          ips: data.ips,
          appId: data.appId,
          appKey: data.appKey,
          sendPushType: data.sendPushType,
          sendPushUrl: data.sendPushUrl,
          channelType: data.channelType,
          interactUrl: data.interactUrl
        };
        this.visiableEdit = true
      },
      // 节点变更
      selectNode(row) {
        this.showSelectNode = true;
        this.dataFormNode = {
          id: row.id,
          businessNumber: row.businessNumber,
          supportNodeId: row.supportNodeId
        }
      },
      // 提交节点
      submitNode() {
        this.$refs.dataFormNode.validate((valid) => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.$api.CustomerAppManage.selectSupportNode(this.dataFormNode).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                  });
                  this.showSelectNode = false;
                  this.findPage();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                }
              });
            }).catch(() => {});
          }
        });
      },
      submitForm() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              let data = JSON.parse(JSON.stringify(this.dataForm));
              data.sendPushType = data.sendPushType.length > 0 ?
                data.sendPushType.reduce((a, b) => {
                  return parseInt(a) + parseInt(b);
                }) : null;
              data.channelType = data.channelType || null;
              this.$api.CustomerAppManage.saveCustomerAppInfo(data).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                  });
                  this.visiableEdit = false;
                  this.findPage();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                }
              });
            }).catch(() => {});
          }
        });
      },
      submitInfoForm() {
        this.$refs.functionForm.validate((valid) => {
          if (valid) {
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              let data = JSON.parse(JSON.stringify(this.functionForm));
              if (data.aNumberRange != undefined) {
                data.aNumberRange.map(item => {
                  item.startPhone = '11645' + item.startPhone
                  item.endPhone = '11645' + item.endPhone
                })
                data.aNumberRange = JSON.stringify(data.aNumberRange)
              }
              data.callLimitDuration = data.callLimitDuration || 0;
              this.$api.CustomerAppManage.saveAppFunction(data).then((res) => {
                if (res.code == 200) {
                  this.$message({
                    message: "操作成功",
                    type: "success",
                  });
                  this.showFunctionInfoEdit = false;
                  this.findPage();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                }
              });
            }).catch(() => {});
          }
        });
      },
      // 显示功能信息弹框
      functionView(row) {
        this.init();
        this.$api.CustomerAppManage.findByCustomerAppId({
          customerAppId: row.id
        }).then((res) => {
          if (res.code == 200) {
            this.detailData = res.data;
            let data = this.controlVisiable
            this.modalType[this.detailData.abilityMode].forEach(item => {
              data[item] = true
            })
            this.controlVisiable = data;
            if (this.detailData.aNumberRange != undefined) {
              this.detailData.aNumberRange = this.detailData.aNumberRange ? JSON.parse(this.detailData
                  .aNumberRange) : [{
                  "endPhone": "",
                  "startPhone": ""
                }],
                this.detailData.aNumberRange.map(item => {
                  item.startPhone = item.startPhone.slice(5)
                  item.endPhone = item.endPhone.slice(5)
                })
            }
            this.formateAuth(this.detailData, 1, 'callin');
            this.formateAuth(this.detailData, 1, 'callout');
            this.formateAuth(this.detailData, 2, 'smsin');
            this.formateAuth(this.detailData, 2, 'smsout');
            this.showFunctionInfo = true;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
      },
      // 显示功能修改弹框
      functionSave(row) {
        this.init();
        this.$api.CustomerAppManage.findByCustomerAppId({
          customerAppId: row.id
        }).then((res) => {
          if (res.code == 200) {
            this.functionForm = res.data;
            this.functionForm.sendPushType = this.getArr(this.functionForm.sendPushType);
            let data = this.controlVisiable
            this.modalType[this.functionForm.abilityMode].forEach(item => {
              data[item] = true
            })
            this.controlVisiable = data;
            if (this.functionForm.aNumberRange != undefined) {
              this.functionForm.aNumberRange = this.functionForm.aNumberRange ? JSON.parse(this.functionForm
                  .aNumberRange) : [{
                  "endPhone": "",
                  "startPhone": ""
                }],
                this.functionForm.aNumberRange.map(item => {
                  item.startPhone = item.startPhone.slice(5)
                  item.endPhone = item.endPhone.slice(5)
                })
            }
            this.showFunctionInfoEdit = true;
            this.getCallinAuthStrategyId(this.functionForm.callinAuth,true)
            this.getCalloutAuthStrategyId(this.functionForm.calloutAuth,true)
            this.getSmsinAuthStrategyId(this.functionForm.smsinAuth,true)
            this.getSmsoutAuthStrategyId(this.functionForm.smsoutAuth,true)
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
      },
      addCall() {
        this.functionForm.aNumberRange.push({
          startPhone: null,
          endPhone: null
        });
      },
      deleteCall(index) {
        this.functionForm.aNumberRange.splice(index, 1);
      },
      getAuth(type, id) {
      	let arr = ''
      	let getNameById = {
      		'callin': () => {
      			arr = this.CallinAuthStrategyList.filter(item => {
      				return item.id == id
      			})

      		},
      		'callout': () => {
      			arr = this.CalloutAuthStrategyList.filter(item => {
      				return item.id == id
      			})

      		},
      		'smsin': () => {
      			arr = this.smsinAuthStrategyList.filter(item => {
      				return item.id == id
      			})

      		},
      		'smsout': () => {
      			arr = this.smsoutAuthStrategyList.filter(item => {
      				return item.id == id
      			})

      		}
      	}
      	getNameById[type]()
      	return arr[0]?arr[0].strategyShortName:null

      },
      // 获取语音呼入鉴权策略
      getCallinAuthStrategyId(e,type) {
        if (!type) {
          this.$set(this.functionForm, 'callinAuthStrategyId', null)
        }
        let paramsObj = {
          "strategyShortName": null, // 策略简称
          "strategyPurpose": 1, // 策略用途（  1语音     2短信）
          "strategyType": e //  策略类型 （1 黑名单     2白名单  ）
        }
        this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
          if (res.code == 200) {
            this.CallinAuthStrategyList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'erroe'
            })
          }
        })
        this.isShowCallinAuthStrategyId = false
        this.$nextTick(() => {
          if (e != 0) {
            this.isShowCallinAuthStrategyId = true
          } else {
            this.$refs['functionForm'].clearValidate('callinAuthStrategyId');
          }
        })
      },
      // 获取语音呼出鉴权策略
      getCalloutAuthStrategyId(e,type) {
        if (!type) {
          this.$set(this.functionForm, 'calloutAuthStrategyId', null)
        }
        let paramsObj = {
          "strategyShortName": null, // 策略简称
          "strategyPurpose": 1, // 策略用途（  1语音     2短信）
          "strategyType": e //  策略类型 （1 黑名单     2白名单  ）
        }
        this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
          if (res.code == 200) {
            this.CalloutAuthStrategyList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'erroe'
            })
          }
        })
        this.isShowCalloutAuthStrategyId = false
        this.$nextTick(() => {
          if (e != 0) {
            this.isShowCalloutAuthStrategyId = true
          } else {
            this.$refs['functionForm'].clearValidate('calloutAuthStrategyId');
          }
        })
      },
      // 获取短信呼入鉴权策略
      getSmsinAuthStrategyId(e, type) {
        if (!type) {
          this.$set(this.functionForm, 'smsinAuthStrategyId', null)
        }
        let paramsObj = {
          "strategyShortName": null, // 策略简称
          "strategyPurpose": 2, // 策略用途（  1语音     2短信）
          "strategyType": e //  策略类型 （1 黑名单     2白名单  ）
        }
        this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
          if (res.code == 200) {
            this.smsinAuthStrategyList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'erroe'
            })
          }
        })
        this.isShowSmsinAuthStrategyId = false
        this.$nextTick(() => {
          if (e != 0) {
            this.isShowSmsinAuthStrategyId = true
          } else {
            this.$refs['functionForm'].clearValidate('smsinAuthStrategyId');
          }
        })
      },
      //  获取短信呼出鉴权策略
      getSmsoutAuthStrategyId(e, type) {
        if (!type) {
          this.$set(this.functionForm, 'smsoutAuthStrategyId', null)
        }
        let paramsObj = {
          "strategyShortName": null, // 策略简称
          "strategyPurpose": 2, // 策略用途（  1语音     2短信）
          "strategyType": e //  策略类型 （1 黑名单     2白名单  ）
        }
        this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
          if (res.code == 200) {
            this.smsoutAuthStrategyList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'erroe'
            })
          }
        })
        this.isShowSmsoutAuthStrategyId = false
        this.$nextTick(() => {
          if (e != 0) {
            this.isShowSmsoutAuthStrategyId = true
          } else {
            this.$refs['functionForm'].clearValidate('smsoutAuthStrategyId');
          }
        })
      },
      // 格式化策略
      formateAuth(row,strategyPurpose,type) {
        let result = '';
        if(row.strategyType == 0) {
          return null
        } else {
          let paramsObj = {
            "strategyShortName": null, // 策略简称
            "strategyPurpose": strategyPurpose, // 策略用途（  1语音     2短信）
            "strategyType": row.strategyType //  策略类型 （1 黑名单     2白名单  ）
          }
          this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
            if (res.code == 200) {
              if (type == 'callin') {
                this.CallinAuthStrategyList = res.data
                this.resultAuth.callin = this.getAuth('callin', row.callinAuthStrategyId)
              } else if (type == 'callout') {
                this.CalloutAuthStrategyList = res.data
                this.resultAuth.callout = this.getAuth('callout', row.calloutAuthStrategyId)
              } else if (type == 'smsin') {
                this.smsinAuthStrategyList = res.data
                this.resultAuth.smsin = this.getAuth('smsin', row.smsinAuthStrategyId)
              } else if (type == 'smsout') {
                this.smsoutAuthStrategyList = res.data
                this.resultAuth.smsout = this.getAuth('smsout', row.smsoutAuthStrategyId)
              }
            } else {
              return null
            }
          })
        }
      },
      // 号码明细
      numList(row) {
        this.paramsnum = {
          customerId: row.id, //客户id  必须要传
          telX: null, //号码
          nodeName: null, //节点名字
          businessNumber: null//集团业务号码
        };
        this.pageRequestnum.param = this.paramsnum;
        this.pageRequestnum = {
          pageNum: 1,
          pageSize: 10,
          param: this.paramsnum,
        };
        this.editDialogVisiblenum = true;

      },
      findpageNum1() {
        this.pageRequestnum.pageNum = 1;
        let objbyn = {
          pageRequest: this.pageRequestnum,
        };
        this.findpageNum(objbyn);
      },
      // 点击号码明细
      findpageNum(data) {
        if (data !== null) {
          this.pageRequestnum = data.pageRequest;
        }
        this.pageRequestnum.param = this.paramsnum;
        this.$api.CustomerFiles.findNumberDetailPage(this.pageRequestnum)
          .then((res) => {
            this.pageResultnum = res.data;
          })
          .then(data != null ? data.callback : "");
      },
      // 号码导出
      exportDatanum() {
        let fileName = `号码明细列表.xlsx`;
        this.pageRequestnum.param = this.paramsnum;
        this.$api.CustomerFiles.exportNumberDetail(this.pageRequestnum).then(
          (res) => {
            let data = res;
            if (!data) {
              return;
            }
            let url = window.URL.createObjectURL(new Blob([data]));
            let a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.setAttribute("download", fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }
        );
      },
      // 应用产品信息
      appProductInfo(row) {
        this.paramsAppProduct = {
          customerAppId: row.id, //客户id  必须要传
          productAttrCode: null,
          productAttrName: null,
        };
        this.pageRequestAppProduct.param = this.paramsAppProduct;
        this.pageRequestAppProduct = {
          pageNum: 1,
          pageSize: 10,
          param: this.paramsAppProduct,
        };
        this.appProductDialogVisible = true;
      },
      findpageAppProductSearch() {
        this.$refs.tableItem.refreshPageRequest(1);
      },
      // 点击号码明细
      findpageAppProduct(data) {
        if (data !== null) {
          this.pageRequestAppProduct = data.pageRequest;
        }
        this.paramsAppProduct.productAttrCode = this.paramsAppProduct.productAttrCode || null;
        this.paramsAppProduct.productAttrName = this.paramsAppProduct.productAttrName || null;
        this.pageRequestAppProduct.param = this.paramsAppProduct;
        this.$api.CustomerAppManage.appProductAttrFindPage(this.pageRequestAppProduct)
          .then((res) => {
            this.pageResultAppProduct = res.data;
          })
          .then(data != null ? data.callback : "");
      },
    }
  }
</script>

<style lang="scss" scoped>
  .toolbar {
    float: left;
    padding-top: 10px;
    margin-left: 15px;
    padding-bottom: 20px;
    text-align: left;
  }

  /deep/ .el-textarea textarea {
    padding-bottom: 13px;
  }

  /deep/ .el-textarea .el-input__count {
    height: 12px;
    line-height: 12px;
  }

  .APhoneItem {
    display: flex;
    justify-content: space-between;
    width: 308px;
  }

  .AStartPhone {
    display: flex;
    border: 1px solid #DCDFE6;
    width: 250px;
    border-radius: 4px;
    margin-left: 5px;
    height: 29px;
  }

  .centerText {
    font-size: 12px;
    color: #C0C4CC;
  }

  .APhone {
    display: flex;
    height: 27px;
  }

  .APhone /deep/ .el-input--mini .el-input__inner {
    border: none;
    height: 26px;
    line-height: 26px;
  }


  .leftDiv {
    width: 120px;
    text-align: right;
    /* margin-left:36px; */
    font-size: 14px;
  }

  .itemDetail {
    display: flex;
    /* align-items: center; */
    margin-bottom: 15px;
  }

  .rightDiv {
    flex: 1;
    padding-left: 18px;
    font-size: 14px;
    /* margin-left:18px; */
    display: flex;
    align-items: flex-end;
    text-align: left;
  }

  .editTitle {
    text-align: left;
    padding: 10px 0px 10px 18px;
    font-weight: bold;
    font-size: 16px;
    background-color: #F0F2F5;
    position: relative;
    left: 12px;
    margin-bottom: 20px;
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }
  .viewTitle {
    text-align: left;
    padding: 10px 0px 10px 18px;
    font-weight: bold;
    font-size: 16px;
    background-color: #F0F2F5;
    margin-bottom: 20px;
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;

  }
  .tableItem {
    height: 540px;
  }
</style>
