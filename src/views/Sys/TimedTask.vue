<template>
  <div>
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
          {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <header :style="{width: operationWidth + 'px'}">
      <el-form :inline="true" :model="pageRequest.param" :size="size"
        id="operationForm"
        :class="{operationExpand: openOperation}">
        <el-form-item label="任务名称">
          <el-input
            maxlength="50"
            v-model="pageRequest.param.jobName"
            placeholder="任务名称"
            class="inputTool"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务组名">
          <el-select
            v-model="pageRequest.param.jobGroup"
            placeholder="请选择"
            filterable
            class="selectTool"
            clearable
          >
          <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in jobGroupList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select
            v-model="pageRequest.param.status"
            placeholder="请选择"
            filterable
            class="selectTool"
            clearable
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="暂停" value="1"></el-option>
            <el-option label="正常" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调用目标字符串">
          <el-input
            maxlength="50"
            v-model="pageRequest.param.invokeTarget"
            placeholder="调用目标字符串"
            class="inputTool"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            maxlength="50"
            v-model="pageRequest.param.remark"
            placeholder="备注"
            class="inputTool"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          type="primary"
          perms="sys:sysJob:findPage"
          @click="refreshPageRequest(1)"
        />
        <kt-button
          :label="$t('action.add')"
          type="primary"
          perms="sys:sysJob:save"
          @click="addClick()"
        />
        <kt-button
          label="导出"
          type="primary"
          perms="sys:sysJob:export"
          @click="exportFile()"
        />
        <kt-button
          label="执行日志"
          type="primary"
          perms="sys:sysJobLog:findPage"
          @click="taskLog({jobName:null})"
        />
        <div class="expandButton"  v-if="showOpen" >
        	<span @click="openOperation=!openOperation">
        		{{openOperation?'收起': '展开'}}
        		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        	</span>
        </div>
      </div>
    </header>

    <!--表格内容栏-->
    <el-table
      :data="pageResult.content"
      stripe
      :size="size"
      :height="getTableHeight()"
      :highlight-current-row="true"
       v-loading="loading"
      :element-loading-text="$t('action.loading')"
      class="page-table"
    >
      <el-table-column
        prop=""
        header-align="center"
        width="60"
        align="center"
        label="序号"
      >
        <template slot-scope="scope">
          <span>{{
            (pageResult.pageNum - 1) * pageResult.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="item.formatter"
        v-for="(item, index) in tableList"
        :key="index"
        :prop="item.prop"
        header-align="center"
        align="center"
        :label="item.label"
        :min-width="item.minWidth"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        min-width="260"
        :label="$t('action.operation')"
      >
        <template slot-scope="scope">
          <kt-button
            label="修改"
            perms="sys:sysJob:save"
            :size="size"
            type="warning"
            @click="editClick(scope.row)"
          />
          <kt-button
            label="删除"
            perms="sys:sysJob:delete"
            :size="size"
            type="warning"
            @click="deleteClick(scope.row)"
          />
          <kt-button
            :label="scope.row.status == 0?'暂停':'启用'"
            perms="sys:sysJob:delete"
            :size="size"
            type="warning"
            @click="statusClick(scope.row)"
          />
          <el-dropdown @command="handleCommand($event,scope.row)" :size="size" style="margin-left: 10px;">
            <el-button :size="size" type="primary">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-show="hasPermission('sys:sysJob:run')"
                command = 'taskRun'
              >
                执行一次
              </el-dropdown-item>
              <el-dropdown-item
                v-show="hasPermission('sys:sysJob:findById')"
                command = 'taskDetail'
              >
                任务详细
              </el-dropdown-item>
              <el-dropdown-item
                v-show="hasPermission('sys:sysJobLog:findPage')"
                command = 'taskLog'
              >
                执行日志
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!--分页栏-->
    <div class="bottom-bar page-bottom-bar">
      <el-pagination
        background
        @size-change="size_change"
        layout="total, prev,sizes, pager, next , jumper"
        @current-change="refreshPageRequest"
        :current-page="pageResult.pageNum"
        :page-size="pageResult.pageSize"
        :total="pageResult.totalSize"
        style="float: right"
        :page-sizes="[100, 500, 1000]"
      >
      </el-pagination>
    </div>

    <!-- 新增 -->
    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false"
      v-if="editDialogVisible"
      fullscreen
      :modal="false"
      class="dialog-fullscreen"
      :class=" collapse?'dialog-fullscreen-width-collapse':'dialog-fullscreen-width'"
    >
      <div class="pathBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
          		<span v-if="index != pagePath.length - 1">{{item}}</span>
          		<span @click="editDialogVisible = false" class="last-page-tag" v-else>{{item}}</span>
           </el-breadcrumb-item>
          <el-breadcrumb-item>{{opa ? '新增' : '编辑'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main-box">
      	<i class="el-icon-close second-page-close" @click="editDialogVisible = false"></i>
        <el-form :model="formData" label-width="170px" :rules="dataFormRules" ref="dataForm" :size="size">
          <div class="second-title-box">
            <div class="second-title">{{opa ? '新增' : '编辑'}}</div>
          </div>
          <el-row class="rowItem">
            <el-col :span="12">
              <el-form-item label="任务名称" prop="jobName">
                <el-input maxlength="50" placeholder="任务名称"
                  v-model="formData.jobName" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item label="任务组名" prop="jobGroup">
                <el-select
                  v-model="formData.jobGroup"
                  placeholder="任务组名"
                  filterable
                  class="selectItem"
                  clearable
                >
                  <el-option
                    v-for="item in jobGroupList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-col :span="22">
                <el-form-item label="调用目标字符串" prop="invokeTarget">
                  <el-input maxlength="1000" placeholder="调用目标字符串" v-model="formData.invokeTarget" class="formItem">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center;">
                  <el-tooltip placement="top" effect="light" style="padding: 7px 10px 13px 10px;">
                    <div slot="content">
                      <p>Bean调用示例：taskTest.testParams('ceshi')</p>
                      <p>Class类调用示例：com.unicom.quartz.task.TaskTest.testParams('ceshi')</p>
                      <p>参数说明：支持字符串，布尔类型，长整型，浮点型，整型 </p>
                    </div>
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
              </el-col>
            </el-col>
            <el-col :span="24">
              <el-form-item label="cron表达式" prop="cronExpression" ref="cronExpression">
                <el-input placeholder="cron表达式" v-model="formData.cronExpression" class="formItem">
                  <el-button slot="append" @click="handleShowCron">生成表达式</el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-col :span="22">
                <el-form-item label="执行策略" prop="misfirePolicy">
                  <el-select v-model="formData.misfirePolicy" filterable placeholder="执行策略" class="formItem" clearable>
                    <el-option label="立即执行" value="1"></el-option>
                    <el-option label="执行一次" value="2"></el-option>
                    <el-option label="放弃执行" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2" style="text-align: center;">
                <el-tooltip placement="top" effect="light" style="padding: 7px 10px 13px 10px;">
                  <div slot="content">
                    <p style="font-weight: bold;">立即执行:</p>
                    <ul style="padding-inline-start: 20px;">
                      <li>以错过的第一个频率时间立刻开始执行</li>
                      <li>重做错过的所有频率周期后</li>
                      <li>当下一次触发频率发生时间大于当前时间后，再按照正常的Cron频率依次执行</li>
                    </ul>
                    <p style="font-weight: bold;">执行一次:</p>
                    <ul style="padding-inline-start: 20px;">
                      <li>以当前时间为触发频率立刻触发一次执行</li>
                      <li>然后按照Cron频率依次执行</li>
                    </ul>
                    <p style="font-weight: bold;">放弃执行:</p>
                    <ul style="padding-inline-start: 20px;">
                      <li>不触发立即执行</li>
                      <li>等待下次Cron触发频率到达时刻开始按照Cron频率依次执行</li>
                    </ul>
                  </div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </el-col>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否并发" prop="concurrent">
                <el-select v-model="formData.concurrent" filterable placeholder="是否并发" class="selectItem" clearable>
                  <el-option label="允许" value="0"></el-option>
                  <el-option label="禁止" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态" prop="status">
                <el-select
                  v-model="formData.status"
                  placeholder="任务状态"
                  filterable
                  class="selectItem"
                  clearable
                  :disabled="opa"
                >
                  <el-option label="暂停" value="1"></el-option>
                  <el-option label="正常" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remark" >
                <el-input
                  maxlength="2000"
                  type="textarea"
                  v-model="formData.remark"
                  placeholder="备注"
                  class="inputItem textarea"
                  :autosize="{ minRows: 1}"
                  show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="footButtonItem">
        <el-button :size="size" @click.native="editDialogVisible = false" type="primary">{{
          $t("action.cancel")
        }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm">{{
          $t("action.submit")
        }}</el-button>
      </div>

      <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
        <crontab @hide="openCron=false" @fill="crontabFill" :expression="formData.cronExpression"></crontab>
      </el-dialog>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog
      :visible.sync="detailShow"
      :close-on-click-modal="false"
      v-if="detailShow"
      :modal = 'false'
      fullscreen
      class="dialog-fullscreen"
      :class=" collapse?'dialog-fullscreen-width-collapse':'dialog-fullscreen-width'"
    >
      <div class="pathBox">
       <el-breadcrumb separator-class="el-icon-arrow-right">
      	 <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
      	 		<span v-if="index != pagePath.length - 1">{{item}}</span>
      	 		<span @click="detailShow = false" class="last-page-tag" v-else>{{item}}</span>
      	  </el-breadcrumb-item>
      	 <el-breadcrumb-item>查看</el-breadcrumb-item>
       </el-breadcrumb>
      </div>
      <div class="main-box">
      	<i class="el-icon-close second-page-close" @click="detailShow = false"></i>
      	<div class="second-title-box">
      		<div class="second-title">查看</div>
      	</div>
        <el-row class="rowItem">
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">任务名称:</div>
            <div class="rightDiv">
              {{ detailData.jobName }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">任务组名:</div>
            <div class="rightDiv">
              {{ formatJobGroup(detailData) }}
            </div>
          </el-col>
          <el-col :span="24" class="itemDetail">
            <div class="leftDiv">调用目标字符串:</div>
            <div class="rightDiv rightDivRow">
              {{ detailData.invokeTarget }}
            </div>
          </el-col>
          <el-col :span="24" class="itemDetail">
            <div class="leftDiv">cron表达式:</div>
            <div class="rightDiv rightDivRow">
              {{ detailData.cronExpression }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">执行策略:</div>
            <div class="rightDiv">
              {{ detailData.misfirePolicy==1?"立即执行": detailData.misfirePolicy==2?"执行一次": "放弃执行" }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">是否并发:</div>
            <div class="rightDiv">
              {{ detailData.concurrent=="0"?'允许': '禁止' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">任务状态:</div>
            <div class="rightDiv">
              {{ detailData.status=="0"?'正常': '暂停' }}
            </div>
          </el-col>
          <el-col :span="12" class="itemDetail">
            <div class="leftDiv">备注:</div>
            <div class="rightDiv">
              {{ detailData.remark }}
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="footButtonItem">
        <el-button :size="size" @click.native="detailShow = false" type="primary">我知道了</el-button>
      </div>
    </el-dialog>

    <!--拨测详情 -->
    <taskLog ref="taskLog" :jobGroupList = 'jobGroupList'
      :collapse='collapse' :operationWidth='operationWidth' :pagePath="pagePath"></taskLog>

  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  import { mapState } from 'vuex';
  import Crontab from '@/components/Crontab';
  import { hasPermission } from '@/permission/index.js'
  // 调度日志
  import taskLog from "@/components/TimedTask/taskLog"
  export  default {
    name: "path-sys-timedTask",
    components: { KtButton, Crontab, taskLog },
    data() {
      return {
        openCron: false, // 生成表达式
        pagePath: [], //页面路径
        jobGroupList: [], // 任务组列表
        openOperation: false, // 是否展开搜索栏
        showOpen: false, // 是否显示展开按钮
        loading: false,
        size: "mini",
        pageRequest: {
          pageNum: 1,
          pageSize: 100,
          param: {
            jobName: null,
            jobGroup: null,
            status: null,
            invokeTarget: null,
            remark: null
          },
        },
        pageResult: {},
        tableList: [
          {
            prop: "jobName",
            label: "任务名称",
            minWidth: 150
          },
          {
            prop: "jobGroup",
            label: "任务组名",
            minWidth: 75,
            formatter: this.formatJobGroup
          },
          {
            prop: "invokeTarget",
            label: "调用目标字符串",
            minWidth: 200
          },
          {
            prop: "cronExpression",
            label: "cron执行表达式",
            minWidth: 150
          },
          {
            prop: "status",
            label: "任务状态",
            minWidth: 75,
            formatter: this.formatStatus
          },
          {
            prop: "remark",
            label: "备注",
            minWidth: 200
          },
          {
            prop: "createBy",
            label: "创建人",
            minWidth: 75
          },
          {
            prop: "createTime",
            label: "创建时间",
            minWidth: 150
          },
          {
            prop: "lastUpdateBy",
            label: "修改人",
            minWidth: 75
          },
          {
            prop: "lastUpdateTime",
            label: "修改时间",
            minWidth: 150
          },
        ],
        editDialogVisible: false, // 新增编辑
        opa: false,
        formData: {
          jobName: null, //任务名称
          jobGroup: 'default', //任务组名
          invokeTarget: null, //调用目标字符串
          cronExpression: null, //cron执行表达式
          misfirePolicy: '3', // 执行策略
          concurrent: '1', //是否并发
          status: null,
          remark: null,
        },
        dataFormRules: {
          jobName: [
            {
              required: true,
              message: '请输入任务名称',
              trigger: 'blur'
            },
          ],
          invokeTarget: [
            {
              required: true,
              message: '请输入调用目标字符串',
              trigger: 'blur'
            }
          ],
          cronExpression: [
            {
              required: true,
              message: '请输入或生成cron表达式',
              trigger: 'blur'
            }
          ],
          status: [
            {
              required: true,
              message: '请选择任务状态',
              trigger: 'change'
            }
          ],
          misfirePolicy: [
            {
              required: true,
              message: '请选择执行策略',
              trigger: 'change'
            }
          ],
          concurrent: [
            {
              required: true,
              message: '请选择是否并发',
              trigger: 'change'
            }
          ],
          jobGroup: [
            {
              required: true,
              message: '请输入任务组名',
              trigger: 'blur'
            }
          ]
        },
        detailShow: false,
        detailData: null
      }
    },
    // 监听属性 类似于data概念
    computed:{
    	...mapState({
    	  collapse: state => state.app.collapse,
    	  operationWidth: state=> state.app.operationWidth
    	})
    },
    // 监控data中的数据变化
    watch: {
    	operationWidth() {
    	  this.$nextTick(()=>{
    		this.showOpen = this.lengthOverFlow('operationForm')
    	  })
    	}
    },
    activated() {
    	this.$nextTick(()=>{
    	  this.showOpen = this.lengthOverFlow('operationForm');
        this.pagePath = this.getCurrentPageLevel();
    	})
    },
    methods: {
      formatJobGroup(row) {
        let data;
        this.jobGroupList.forEach(res=>{
          if (res.value == row.jobGroup) {
            data = res.label
          }
        })
        return data
      },
      // 下拉菜单选择
      handleCommand(event, row) {
        let data = {
          'taskRun': ()=>{
            return this.taskRun(row);
          },
          'taskDetail': ()=>{
            return this.taskDetail(row);
          },
          'taskLog': ()=>{
            return this.taskLog(row);
          },
        };
        data[event]();
      },
      // 立即执行一次
      taskRun(row) {
        this.$confirm("确定执行一次吗？", "提示", {
          type: "warning",
        }).then(() => {
          let idobj = {
            id: row.id,
          };
          this.$api.timedTask.runTask(idobj).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.findPage();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }).catch((e) => {
          console.log(e)
        });
      },
      // 任务详情
      taskDetail(row) {
        this.detailShow = true;
        this.detailData = JSON.parse(JSON.stringify(row))
      },
      // 任务日志
      taskLog(row) {
        this.$refs.taskLog.parentHandle(row.jobName)
      },
      // 判断权限
      hasPermission(perms) {
        return hasPermission(perms)
      },
      /** cron表达式按钮操作 */
      handleShowCron() {
        this.openCron = true;
      },
      /** 确定后回传值 */
      crontabFill(value) {
        this.$set(this.formData, 'cronExpression', value);
        this.$refs.cronExpression.clearValidate();
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.pageRequest.pageNum = pageNum;
        this.findPage();
      },
      size_change(e) {
        this.pageRequest.pageSize = e;
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
      // 获取分页数据
      findPage: function () {
        this.loading = true;
        this.openOperation = false;
        this.$api.timedTask.findPage(this.pageRequest).then((res) => {
          if (res.code == 200) {
            this.pageResult = res.data;
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
          this.loading = false;
        });
      },
      // 新增
      addClick() {
        this.formData = {
          jobName: null, //任务名称
          jobGroup: 'default', //任务组名
          invokeTarget: null, //调用目标字符串
          cronExpression: null, //cron执行表达式
          misfirePolicy: '3', // 执行策略
          concurrent: '1', //是否并发
          status: "1",
          remark: null
        };
        this.editDialogVisible = true;
        this.opa = true;
      },
      // 编辑
      editClick(row) {
        this.opa = false;
        this.formData = JSON.parse(JSON.stringify(row));
        this.editDialogVisible = true;
      },
      // 导出
      exportFile() {
        if (this.pageResult.totalSize > 500000) {
          return this.$message({
            message: "提示：每次最多只能导出五十万条数据！",
            type: "error",
          });
        }


        this.loading = true;

        let fileName = "定时任务.xlsx";

        this.$api.timedTask.exportTask(this.pageRequest).then(res=> {
          let data = res;
          this.loading = false;
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
        })
      },
      // 提交
      submitForm() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.formData));
            this.$api.timedTask.save(data).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "操作成功",
                  type: 'success'
                });
                this.findPage();
                this.editDialogVisible = false;
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            })
          }
        })
      },
      // 删除行
      deleteClick(row) {
        this.$confirm("确定删除吗？", "提示", {
          type: "warning",
        }).then(() => {
          let idobj = {
            id: row.id,
          };
          this.$api.timedTask.deleteTask([idobj]).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.findPage();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }).catch(() => {});
      },
      // 启用暂停
      statusClick(row) {
        this.$confirm(`确定${row.status == 0? '暂停': '启用'}吗？`, "提示", {}).then(() => {
          let idobj = {
            id: row.id,
            status: row.status == 0?1:0,
          };
          this.$api.timedTask.changeStatus(idobj).then((res) => {
            if (res.code == 200) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.findPage();
            } else {
              this.$message({
                message: res.msg,
                type: "error",
              });
            }
          });
        }).catch(()=>{});
      },
      // 格式化状态
      formatStatus(row) {
        return row.status == 0? '正常': row.status == 1? '暂停': null
      },
      getDict() {
        let data = {
          type: 'jobGroup'
        };
        this.$api.dict.findByType(data).then(res=>{
          if (res.code == 200) {
            this.jobGroupList = res.data
          }
        })
      }
    },
    created() {
      this.findPage();
      this.getDict();
    },
  }



</script>

<style lang="scss" scoped>
  .formItem {
    margin-left: 6px;
    width: 100%
  }
  /deep/ .el-input-group__append button.el-button {
    border-color: transparent !important;
    background-color: transparent !important;
    color: inherit !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
  }

  .itemDetail {
    display: flex;
    /* align-items: center; */
    margin-bottom: 15px;
    align-items: baseline;
  }

  .leftDiv {
    width: 190px;
    text-align: right;
    /* margin-left:36px; */
    font-size: 14px;
  }

  .rightDiv {
    width: 180px;
    padding-left: 18px;
    font-size: 14px;
    /* margin-left:18px; */
    display: flex;
    align-items: flex-end;
    text-align: left;
  }
  .rightDivRow {
    flex: 1;
  }

  /deep/ .el-textarea textarea{
    padding-bottom: 13px;
  }
  /deep/ .el-textarea .el-input__count{
    height: 12px;
    line-height: 12px;
  }

</style>
