<template>
  <div>
    <el-dialog
      :visible.sync="viewDialogVisible"
      v-if="viewDialogVisible"
      :close-on-click-modal="false" :modal = 'false' fullscreen
      class="dialog-fullscreen"
      :class=" collapse?'dialog-fullscreen-width-collapse':'dialog-fullscreen-width'"
    >
      <div class="pathBox">
      	<el-breadcrumb separator-class="el-icon-arrow-right">
      		<el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
      				<span v-if="index != pagePath.length - 1">{{item}}</span>
      				<span @click="viewDialogVisible = false" class="last-page-tag" v-else>{{item}}</span>
      		 </el-breadcrumb-item>
           <el-breadcrumb-item>执行日志</el-breadcrumb-item>
      	</el-breadcrumb>
      </div>
      <!--工具栏-->
      <header :style="{width: operationWidth + 'px'}" id="operationFormInside">
        <el-form :inline="true" :size="size"  id="operationForm" :class="{operationExpand: openOperation}">
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
          <el-form-item label="执行状态">
            <el-select
              v-model="pageRequest.param.status"
              placeholder="请选择"
              filterable
              class="selectTool"
              clearable
            >
              <el-option label="全部" :value="null"></el-option>
              <el-option label="正常" value="0"></el-option>
              <el-option label="失败" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="耗时">
            <div class="division-box">
              <el-input
                maxlength="20"
                v-model="pageRequest.param.executeTimeMin"
                placeholder="最小"
                class="innerTool"
              ></el-input>
              <span class="division">至</span>
              <el-input
                maxlength="20"
                v-model="pageRequest.param.executeTimeMax"
                placeholder="最大"
                class="innerTool"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="执行时间">
            <el-date-picker
              v-model="pageRequest.param.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="dateRange"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <i class="el-icon-close close-second-form" @click="viewDialogVisible = false"></i>        </el-form>
        <div class="btnSearch">
        	<kt-button :label="$t('action.search')" perms="sys:sysJobLog:findPage" type="primary"
        		@click="refreshPageRequest(1)" />
        	<kt-button label="导出" perms="sys:sysJobLog:export" type="primary"
        		@click="exportFile()" />
          <kt-button label="清空" perms="sys:sysJobLog:clean" type="primary"
          	@click="cleanAll()" />
        	<div class="expandButton" v-if="showOpen">
        		<span @click="openOperation=!openOperation">
        			{{openOperation?'收起': '展开'}}
        			<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        		</span>
        	</div>
        </div>
      </header>

      <!-- 表格 -->
      <el-table stripe :highlight-current-row="true" :element-loading-text="$t('action.loading')" v-loading="loading"
        :data="pageResult.content" size="mini" rowKey="id" :height="getTableHeight()" ref="tableData" class="page-table">
        <el-table-column prop="" header-align="center" width="60" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{
                (pageResult.pageNum - 1) * pageResult.pageSize +
                scope.$index +
                1
              }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in filterColumns" :key="index" :prop="item.prop" :formatter="item.formatter"
          header-align="center" align="center" :label="item.label" :show-overflow-tooltip="item.showTooltip"
          :min-width="item.minWidth">
          <template slot-scope="scope">
            <el-tooltip
              v-if="item.prop == 'jobMessage'"
              popper-class="workorder-reason-popper"
              effect="dark"
              placement="top">
              <div slot="content">
                <span v-if="scope.row.status == 1">{{scope.row.jobMessage}}<br/>{{scope.row.exceptionInfo}}</span>
                <span v-else>{{scope.row.jobMessage}}</span>
              </div>
              <div
                style="overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;">
                <span :ref="scope.row.id">{{ item.formatter(scope.row) }}</span>
              </div>
            </el-tooltip>
            <div v-else v-html="item.formatter?item.formatter(scope.row): scope.row[item.prop]"></div>
          </template>

        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          min-width="150"
          :label="$t('action.operation')"
        >
          <template slot-scope="scope">
            <kt-button
              label="详情"
              perms="sys:sysJobLog:findById"
              :size="size"
              type="warning"
              @click="detailClick(scope.row)"
            />
            <kt-button
              label="删除"
              perms="sys:sysJobLog:delete"
              :size="size"
              type="warning"
              @click="deleteClick(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页符 -->
      <div class="bottom-bar page-bottom-bar">
        <el-pagination @size-change="sizeChange" background layout="total, prev,sizes, pager, next , jumper"
          @current-change="refreshPageRequest" :current-page="pageResult.pageNum" :page-sizes="[100,500,1000]"
          :page-size="100" :total="pageResult.totalSize" style="float: right">
        </el-pagination>
      </div>


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
            <el-col :span="12" class="itemDetail">
              <div class="leftDiv">执行时间:</div>
              <div class="rightDiv">
                {{ detailData.startTime }}
              </div>
            </el-col>
            <el-col :span="24" class="itemDetail">
              <div class="leftDiv">调用目标字符串:</div>
              <div class="rightDiv rightDivRow">
                {{ detailData.invokeTarget }}
              </div>
            </el-col>
            <el-col :span="24" class="itemDetail">
              <div class="leftDiv">日志信息:</div>
              <div class="rightDiv rightDivRow">
                {{ detailData.jobMessage }}
              </div>
            </el-col>
            <el-col :span="12" class="itemDetail">
              <div class="leftDiv">执行状态:</div>
              <div class="rightDiv">
                {{ detailData.status=="0"?'正常': '失败' }}
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="footButtonItem">
          <el-button :size="size" @click.native="detailShow = false" type="primary">我知道了</el-button>
        </div>
      </el-dialog>






    </el-dialog>
  </div>
</template>

<script>
   import KtButton from "@/views/Core/KtButton";
   import { format } from "@/utils/datetime";


   export default {
     components: {
       KtButton,
     },
     props: {
       collapse: {
         type: Boolean,
         default: false
       },
       operationWidth: {
         type: Number,
         default: 0
       },
       pagePath: {
         type: Array,
         default: []
       },
       jobGroupList: {
         type: Array,
         default: []
       }
     },
    data() {
      return {
        isShowTooltip: false,
        detailShow: false,
        detailData: {},
        openOperation: false, // 控制是否展开操作栏
        showOpen: false, // 控制是否查询项超出页面宽度
        viewDialogVisible: false,
        filterColumns: [
          {
            prop: "jobName",
            label: "任务名称",
            minWidth: 150,
            showTooltip: true
          },
          {
            prop: "jobGroup",
            label: "任务组名",
            minWidth: 75,
            formatter: this.formatJobGroup,
            showTooltip: true
          },
          {
            prop: "invokeTarget",
            label: "调用目标字符串",
            minWidth: 200,
            showTooltip: true
          },
          {
            prop: "jobMessage",
            label: "日志信息",
            minWidth: 200,
            formatter: this.formatJobMessage,
            showTooltip: false
          },
          {
            prop: 'executeTime',
            label: '耗时（ms）',
            minWidth: 100,
            showTooltip: true
          },
          {
            prop: "status",
            label: "执行状态",
            minWidth: 75,
            formatter: this.formatStatus,
            showTooltip: true
          },
          {
            prop: "startTime",
            label: "执行时间",
            minWidth: 150,
            showTooltip: true
          }
        ],
        pageResult: {},
        loading: false,
        size: 'mini',
        pageRequest: {
          pageNum: 1,
          pageSize: 100,
          param: {
            jobName: null,
            jobGroup: null,
            status: null,
            invokeTarget: null,
            executeTimeMax: null,
            executeTimeMin: null,
            createTime: [
              format(new Date(new Date(new Date().toLocaleDateString()).getTime())),
              format(
                new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
              ),
            ],
          }
        },
      }
    },
    // 监控data中的数据变化
    watch: {
      operationWidth() {
        this.$nextTick(()=>{
          this.showOpen = this.lengthOverFlow('operationFormInside')
        })
      }
    },
    methods: {
      onMouseOver(str) {
        this.$nextTick(()=>{
          // 内容超出，显示文字提示内容
          let tag = this.$refs[str];
          let parentWidth = tag[0].parentNode.offsetWidth; // 获取元素父级可视宽度
          let contentWidth = tag[0].offsetWidth; // 获取元素可视宽度
          return contentWidth <= parentWidth;
        })
      },
      formatJobGroup(row) {
        let data;
        this.jobGroupList.forEach(res=>{
          if (res.value == row.jobGroup) {
            data = res.label
          }
        })
        return data
      },
      formatJobMessage(row) {
        if (row.status == 0) {
          return row.jobMessage
        } else {
          return `${row.jobMessage}\n\t${row.exceptionInfo}`
        }
      },
      // 格式化状态
      formatStatus(row) {
        return row.status == 0? '正常': row.status == 1? '失败': null
      },
      parentHandle(jobName) {
        this.pageRequest = {
          pageNum: 1,
          pageSize: 100,
          param: {
            jobName: jobName,
            jobGroup: null,
            status: null,
            invokeTarget: null,
            createTime: [
              format(new Date(new Date(new Date().toLocaleDateString()).getTime())),
              format(
                new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
              ),
            ],
          }
        },
        this.viewDialogVisible = true;
        this.findPage();
        this.$nextTick(()=>{
          this.showOpen = this.lengthOverFlow('operationFormInside')
        })
      },
      findPage() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.pageRequest));
        data.param.executeTimeMax = data.param.executeTimeMax*1 || null;
        data.param.executeTimeMin = data.param.executeTimeMin*1 || null;
        this.openOperation = false;
        this.$api.timedTask.logFindPage(data).then((res) => {
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
      exportFile() {
        this.$api.timedTask.exportLog(this.pageRequest).then(res=> {
          let data = res;
          this.loading = false;
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.setAttribute("download", '执行日志.xlsx');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
      },
      cleanAll() {
        this.$confirm("该操作会清空所有定时任务的执行日志，确定清空吗？", "提示", {
          type: "warning",
        }).then(() => {
          this.$api.timedTask.cleanLog().then((res) => {
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
      detailClick(row) {
        this.detailShow = true;
        this.detailData = JSON.parse(JSON.stringify(row))
      },
      deleteClick(row) {
        this.$confirm("确定删除吗？", "提示", {
          type: "warning",
        }).then(() => {
          let idobj = {
            id: row.id,
          };
          this.$api.timedTask.deleteLog([idobj]).then((res) => {
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
    }
  }
</script>

<style lang="scss" scoped>

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
    flex: 1
  }
  .division-box {
    display: flex;
  }
  .division {
    width: 30px;
    text-align: center;
    font-size: 12px;
  }
  /* 含有分隔符的插叙项 */
  .innerTool {
    width: 70px;
  }

</style>

<style>
.workorder-reason-popper {
  max-height: 300px;
  overflow: auto;
}
.workorder-reason-popper .popper__arrow {
  display: none;
}
</style>
