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
              clearable @clear="customerChange"
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
          <el-form-item label="业务号码">
            <el-input v-model="pageRequest.param.phone" placeholder="业务号码" maxlength="11" clearable class="inputTool"></el-input>
          </el-form-item>
          <el-form-item label="拨测次数">
            <el-select class="selectTool" v-model="pageRequest.param.minRoundCount" placeholder="请选择" >
              <el-option  label="全部" :value="null"></el-option>
              <el-option v-for="(item,index) in minRoundCountList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否收到信号">
            <el-select class="selectTool" v-model="pageRequest.param.phoneStatus" placeholder="请选择" >
              <el-option  label="全部" :value="null"></el-option>
              <el-option v-for="(item,index) in phoneStatusList" :key="index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <i class="el-icon-close close-second-form" @click="viewDialogVisible = false"></i>        </el-form>
        <div class="btnSearch">
        	<kt-button :label="$t('action.search')" perms="dialTask:findDialTaskPhone" type="primary"
        		@click="refreshPageRequest(1)" />
        	<kt-button label="导出" perms="dialTask:exportDialTaskPhone" type="primary"
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
      <el-table stripe :highlight-current-row="true" :element-loading-text="$t('action.loading')" v-loading="loading"
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
          @current-change="refreshPageRequest" :current-page="pageResult.pageNum" :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="100" :total="pageResult.totalSize" style="float: right">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";

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
      }
    },
    data() {
      return {
        openOperation: false, // 控制是否展开操作栏
        showOpen: false, // 控制是否查询项超出页面宽度
        viewDialogVisible: false,
        filterColumns: [
          {
            prop: "phone",
            label: "业务号码",
            minWidth: 100,
          },
          {
            prop: "customerShortName",
            label: "客户简称",
            minWidth: 100
          },
          {
            prop: "roundCount",
            label: "拨测次数",
            minWidth: 100,
          },
          {
            prop: "phoneStatus",
            label: "是否收到信号",
            minWidth: 100,
            formatter: this.formatePhoneStatus
          },
          {
            prop: "arriveTime",
            label: "收到信号时间",
            minWidth: 100,
          }
        ],
        pageResult: [],
        loading: false,
        size: 'mini',
        pageRequest: {
          pageNum: 1,
          pageSize: 100,
          param: {
            customerId: null,
            dialTaskId: null,
            phone: null, //业务号码
            minRoundCount: null, // 拨测次数
            phoneStatus: null, // 是否收到信号
          }
        },
        minRoundCountList: [
          {
            label: '>=1',
            value: 1
          },
          {
            label: '>=2',
            value: 2
          },
          {
            label: '>=3',
            value: 3
          },
          {
            label: '>=4',
            value: 4
          },
          {
            label: '>=5',
            value: 5
          }
        ],
        phoneStatusList: [
          {
            label: '否',
            value: 0
          },
          {
            label: '是',
            value: 1
          }
        ],
        shortName: [], //客户简称,
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
      formatePhoneStatus(row) {
        return row.phoneStatus == 0? '否': row.phoneStatus == 1? '是': null;
      },
      customerChange() {
      	this.$set(this.pageRequest.param, 'customerId', null)
      },
      // 获取客户简称（不包含托管的用户 的接口）
      getCoustMerShortName() {
        this.$api.VoiceRecord.findAllRemoveTrust().then((res) => {
          if (res.code == 200) {
            this.shortName = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      },
      parentHandle(id,supportNodeId) {
        this.pageRequest = {
          pageNum: 1,
          pageSize: 100,
          param: {
            supportNodeId: supportNodeId,
            dialTaskId: id,
            phone: null, //业务号码
            minRoundCount: null, // 拨测次数
            phoneStatus: null, // 是否收到信号
            customerId: null,
          }
        },
        this.viewDialogVisible = true;
        this.findPage();
        this.getCoustMerShortName();
        this.$nextTick(()=>{
          this.showOpen = this.lengthOverFlow('operationFormInside')
        })
      },
      findPage() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.pageRequest));

        data.param.phone = data.param.phone == ''? null: data.param.phone;

        this.$api.DialTaskRecord.findDialTaskPhone(data).then((res) => {
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
        this.$api.DialTaskRecord.dialTaskDetailExport(this.pageRequest.param).then(res=> {
          let data = res;
          this.loading = false;
          if (!data) {
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.setAttribute("download", '拨测详情.xlsx');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
      }
    }
  }


</script>

<style lang="scss" scoped>
  .toolbar {
    float: left;
    padding-top: 10px;
    padding-left: 15px;
    padding-bottom: 20px;
    text-align: left;
  }
</style>
