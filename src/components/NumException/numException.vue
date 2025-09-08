<template>
  <el-dialog
    :visible.sync="detailShow"
    :close-on-click-modal="false"
    :modal = 'false'
    fullscreen
    class="dialog-fullscreen dialog-fullscreen-width"
    append-to-body
  >
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          号码异常告警
          <el-tooltip placement="right-start" effect="light" popper-class="num-exception-tip" style="padding: 0 10px;">
            <i class="el-icon-warning"></i>
            <div slot="content">
              <p> 停机号码（参与绑定）：给我们发了停机通知，但是没发复机通知的号码会记录在此（四个节点都有异步复机通知的接口）</p>
              <p> 回抢失败号码（不参与绑定）：给我们发送被抢状态通知之后，我们执行位置回抢操作，如果执行失败后间隔5分钟再次执行，最多共执行6轮，最后仍还失败的会在此记录；如果人工干预之后，给我们发送了上线成功的回调（吉林/广西）或者上线同步成功（浙江/广东）会从此列表中删除</p>
            </div>
          </el-tooltip>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!--工具栏-->
    <header :style="{width: operationWidth + 'px'}" id="operationFormInside">
      <el-form :inline="true" :size="size"  id="operationForm" :class="{operationExpand: openOperation}">
        <el-form-item label="客户简称">
          <el-select
            v-model="pageRequest.param.customerId"
            filterable
            placeholder="客户简称"
            class="selectTool"
            clearable @clear="selectClear(pageRequest.param, 'direction')"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in shortName"
              :label="item.customerShortName"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="号码">
          <el-input v-model="pageRequest.param.telX" placeholder="号码" maxlength="50" clearable class="inputTool"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select class="selectTool" v-model="pageRequest.param.type" placeholder="请选择" >
            <el-option  label="全部" :value="null"></el-option>
            <el-option  label="回抢失败" :value="1"></el-option>
            <el-option  label="停机" :value="2"></el-option>
            <el-option  label="非隐私号平台抢注" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="gt">
          <el-input v-model="pageRequest.param.gtAddr" placeholder="gt" maxlength="50" clearable class="inputTool"></el-input>
        </el-form-item>
        <el-form-item label="gt归属平台">
          <el-select class="selectTool" v-model="pageRequest.param.gtPlatform" placeholder="请选择" clearable
            @clear="selectClear(pageRequest.param, 'gtPlatform')">
            <el-option  label="全部" :value="null"></el-option>
            <el-option v-for="item in gtPlatformList" :label="item.label" :value="item.label" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="gt类型">
          <el-select class="selectTool" v-model="pageRequest.param.gtType" placeholder="请选择" >
            <el-option  label="全部" :value="null"></el-option>
            <el-option  label="一体化平台" :value="0"></el-option>
            <el-option  label="非一体化平台" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支撑节点">
          <el-select filterable v-model="pageRequest.param.supportNodeId" placeholder="支撑节点" size="mini">
              <el-option v-for="(item, index) in supportNodeList" :key="item.id" :label="item.nodeName" :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="异常时间">
          <el-date-picker v-model="pageRequest.param.abnormalTime" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss" class="dateRange" :clearable="false">
        </el-date-picker>
        </el-form-item>
        <i class="el-icon-close close-second-form" @click="detailShow = false"></i>
      </el-form>
      <div class="btnSearch">
        <kt-button :label="$t('action.search')" perms="base:numberAbnormal:findPage" type="primary"
          @click="refreshPageRequest(1)" />
        <kt-button label="导出" perms="base:numberAbnormal:export" type="primary"
          @click="exportFile()" />
        <div class="expandButton" v-if="showOpen">
          <span @click="openOperation=!openOperation">
            {{openOperation?'收起': '展开'}}
            <i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
          </span>
        </div>
      </div>
    </header>

    <!-- 表格 -->
    <el-table stripe :highlight-current-row="true" :element-loading-text="$t('action.loading')" v-loading="loading" :row-class-name="rowClassName"
      :data="pageResult.content" size="mini" rowKey="id" :height="getTableHeight()" ref="tableData" class="page-table">
      <el-table-column prop="" header-align="center" width="100" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{
              (pageResult.pageNum - 1) * pageResult.pageSize +
              scope.$index +
              1
            }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, index) in filterColumns" :key="index" :prop="item.prop" :formatter="item.formatter"
        header-align="center" align="center" :label="item.label" :show-overflow-tooltip="true"
        :min-width="item.minWidth">

      </el-table-column>
    </el-table>

    <!-- 分页符 -->
    <div class="bottom-bar page-bottom-bar">
      <el-pagination @size-change="sizeChange" background layout="total, prev,sizes, pager, next , jumper"
        @current-change="refreshPageRequest" :current-page="pageResult.pageNum" :page-sizes="[100, 500, 1000]"
        :page-size="pageResult.pageSize" :total="pageResult.totalSize" style="float: right">
      </el-pagination>
    </div>


  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { format } from '@/utils/datetime'
import KtButton from "@/views/Core/KtButton";
import  { hasPermission } from '@/permission'

export default {
  components: {
    KtButton
  },
  props: {
    supportNodeList: {
      type: Array,
      default: () => []
    }
  },  
  data() {
    return {
      pageRequest: {
        pageNum: 1,
        pageSize: 100,
        param: {
          "customerId": null,   // 客户id
          "telX": null,  // 号码
          "type": null, // 类型：1-回抢失败，2-停机
          "abnormalTime": this.getWeekTime(),  // 时间
          "gtAddr": null, // gt
          "gtType": null, // gt类型：0-隐私号平台，1-非隐私号平台
          "gtPlatform": null,  // gt归属平台
          "supportNodeId": 59  // 支撑节点
        }
      },
      pageResult: {},
      filterColumns: [
        {
          prop: 'customerShortName',
          label: '客户简称',
          minWidth: 100
        },
        {
          prop: 'telX',
          label: '号码',
          minWidth: 100
        },
        {
          prop: 'type',
          label: '类型',
          minWidth: 100,
          formatter: (row, column, cellValue, index) => {
            return cellValue == 1 ? '回抢失败' : cellValue == 2 ? '停机' : cellValue == 3 ? '非隐私号平台抢注' : ''
          }
        },
        {
          prop: 'gtAddr',
          label: 'gt',
          minWidth: 100
        },
        {
          prop: 'gtType',
          label: 'gt类型',
          minWidth: 100,
          formatter: (row, column, cellValue, index) => {
            return cellValue == 0 ? '一体化平台' : cellValue == 1?'非一体化平台':''
          }
        },
        {
          prop: 'gtPlatform',
          label: 'gt归属平台',
          minWidth: 100,
          formatter: this.formatGtPlatform
        },
        {
          prop: 'abnormalTime',
          label: '异常时间',
          minWidth: 150
        }
      ],
      openOperation: false, // 控制是否展开操作栏
      showOpen: false, // 控制是否查询项超出页面宽度
      shortName: [], // 客户简称列表
      size: 'mini',
      detailShow: false,
      loading: false,
      gtPlatformList: []
    }
  },
  computed:{
  	...mapState({
  	  operationWidth: state=> state.app.operationWidth
  	})
  },
  watch: {
    operationWidth() {
      this.$nextTick(()=>{
        this.showOpen = this.lengthOverFlow('operationFormInside')
      })
    },
    $route: 'closeNumException'
  },
  methods: {
    rowClassName({row, rowIndex}) {
      if (!row.gtPlatform && row.gtAddr) {
        return 'error-row'
      } else {
        return ''
      }
    },
    formatGtPlatform(row, column, cellValue, index) {
      let data;
      this.gtPlatformList.forEach(item => {
        if (item.label == cellValue) {
          data = item.label
        }
      })
      return data
    },
    exportFile() {
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.pageRequest));
      data.param.telX = data.param.telX != '' ? data.param.telX : null;
      data.param.gtAddr = data.param.gtAddr != '' ? data.param.gtAddr : null;
      this.$api.user.findAbnormalNumberExport(data.param).then(res=>{
        let data = res;
        if (!data) {
          this.$message.error('导出失败');
          this.loading = false;
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.setAttribute("download", '号码异常告警.xls');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.loading = false;
      })
    },
    hasPermission(perm) {
      return hasPermission(perm)
    },
    closeNumException() {
      this.detailShow = false
    },
    getWeekTime() {
      const startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
      const endTime = new Date(new Date().getTime()).setHours(23, 59, 59, 999);
      return [format(startTime), format(endTime)]
    },
    async numExceptionHandle() {
      this.pageRequest= {
        pageNum: 1,
        pageSize: 100,
        param: {
          "customerId": null,   // 客户id
          "telX": null,  // 号码
          "type": null, // 类型：1-回抢失败，2-停机
          "abnormalTime": this.getWeekTime(),  // 时间
          "gtAddr": null, // gt
          "gtType": null, // gt类型：0-隐私号平台，1-非隐私号平台
          "gtPlatform": null,  // gt归属平台
          "supportNodeId": 59  // 支撑节点
        }
      };
      this.detailShow = true;
      this.findPage();
      this.$nextTick(()=>{
        this.showOpen = this.lengthOverFlow('operationFormInside')
      })
      this.gtPlatformList = await this.getDict('gt')
      this.$api.NumberPreempted.findAll().then((res) => {
        if (res.code == 200) {
          this.shortName = res.data
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    findPage() {
      this.openOperation = false;
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.pageRequest));
      data.param.telX = data.param.telX != '' ? data.param.telX : null;
      data.param.gtAddr = data.param.gtAddr != '' ? data.param.gtAddr : null;
      this.$api.user.findAbnormalNumber(data).then(res=>{
        this.loading = false;
        if (res.code == 200) {
          this.pageResult = res.data
        } else {
          this.$message.error(res.msg)
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
    async getDict(type) {
      const res = await this.$api.dict.findByType({type})
      if (res.code == 200) {
        return res.data
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .error-row {
  color: #f00;
  font-weight: bold;
}
</style>
