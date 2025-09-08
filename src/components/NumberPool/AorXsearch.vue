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
           <el-breadcrumb-item>{{`${numberType == 'telA'?'A号码':'X号码'}`}}查询</el-breadcrumb-item>
      	</el-breadcrumb>
      </div>
      <!--工具栏-->
      <header :style="{width: operationWidth + 'px'}" id="operationFormInside">
        <el-form :inline="true" :size="size"  id="operationForm"
          :class="{operationExpand: openOperation}">
          <el-form-item label="客户简称">
            <el-select v-model="pageRequest.param.customerId" filterable clearable
              @clear="selectClear(pageRequest.param, 'customerId')"
              placeholder="客户简称" class="selectTool">
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in customerSimpleName" :label="item.customerShortName"
                :value="item.id" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="号码池编码">
            <el-input
              maxlength="50"
              v-model="pageRequest.param.poolCode"
              placeholder="号码池编码"
              class="inputTool"
            ></el-input>
          </el-form-item>
          <el-form-item label="小号模式">
            <el-select v-model="pageRequest.param.abilityMode" placeholder="小号模式" class="selectTool" filterable
              @clear="selectClear(pageRequest.param, 'abilityMode')" clearable>
              <el-option label="全部" :value="null"></el-option>
              <el-option v-for="item in abilityModeList" :label="item.label" :value="item.value" :key="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="小号" v-if="numberType == 'telX'">
            <el-input
              maxlength="50"
              v-model="pageRequest.param.telX"
              placeholder="小号"
              class="inputTool"
            ></el-input>
          </el-form-item>
          <el-form-item label="小号" v-if="numberType == 'telA'">
            <el-input
              maxlength="50"
              v-model="pageRequest.param.telA"
              placeholder="小号"
              class="inputTool"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
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
          <i class="el-icon-close close-second-form" @click="viewDialogVisible = false"></i>
        </el-form>
        <div class="btnSearch">
        	<kt-button :label="$t('action.search')" perms="sys:sysJobLog:findPage" type="primary"
        		@click="refreshPageRequest(1)" />
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
       customerSimpleName: {
         type: Array,
         default: []
       },
       abilityModeList: {
         type: Array,
         default: []
       }
     },
    data() {
      return {
        isShowTooltip: false,
        openOperation: false, // 控制是否展开操作栏
        showOpen: false, // 控制是否查询项超出页面宽度
        viewDialogVisible: false,
        filterColumnsA: [
          {
            prop: "telA",
            label: "A号码",
            minWidth: 150,
          },
          {
            prop: "customerShortName",
            label: "客户简称",
            minWidth: 150,
          },
          {
            prop: "poolCode",
            label: "号码池编码",
            minWidth: 150,
          },
          {
            prop: "poolType",
            label: "号码池类型",
            minWidth: 100,
            formatter: this.formatPoolType
          },
          {
            prop: "createBy",
            label: "创建人",
            minWidth: 200,
          },
          {
            prop: 'createTime',
            label: '创建时间',
            minWidth: 150,
          },
        ],
        filterColumnsX: [
          {
            prop: "telX",
            label: "小号",
            minWidth: 150,
          },
          {
            prop: "customerShortName",
            label: "客户简称",
            minWidth: 150,
          },
          {
            prop: "poolCode",
            label: "号码池编码",
            minWidth: 150,
          },
          {
            prop: "poolType",
            label: "号码池类型",
            minWidth: 100,
            formatter: this.formatPoolType
          },
          {
            prop: "provinceName",
            label: "省分",
            minWidth: 150,
          },
          {
            prop: "cityName",
            label: "城市",
            minWidth: 150,
          },
          {
            prop: "createBy",
            label: "创建人",
            minWidth: 200,
          },
          {
            prop: 'createTime',
            label: '创建时间',
            minWidth: 150,
          },
        ],
        filterColumns: {},
        pageResult: {},
        loading: false,
        size: 'mini',
        numberType: 'telA',
        pageRequest: {
          pageNum: 1,
          pageSize: 100,
          param: {
            numberPoolId: null,
            customerId: null,
            poolCode: null,
            abilityMode: null,
            createTime: [],
            // createTime: [
            //   format(new Date(new Date(new Date().toLocaleDateString()).getTime())),
            //   format(
            //     new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
            //   ),
            // ],
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
      formatPoolType(row) {
        return row.poolType == 1? '普通号码池': row.poolType == 2? '兜底号码池': null
      },
      parentHandle(type, numberPoolId) {
        this.pageRequest = {
          pageNum: 1,
          pageSize: 100,
          param: {
            numberPoolId: numberPoolId||null,
            customerId: null,
            poolCode: null,
            abilityMode: null,
            createTime: []
            // createTime: [
            //   format(new Date(new Date(new Date().toLocaleDateString()).getTime())),
            //   format(
            //     new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1)
            //   ),
            // ],
          }
        };
        this.numberType = type
        this.filterColumns = type == 'telA'? this.filterColumnsA: this.filterColumnsX
        this.$set(this.pageRequest.param, type, null)
        this.viewDialogVisible = true;
        this.findPage();
        this.$nextTick(()=>{
          this.showOpen = this.lengthOverFlow('operationFormInside')
        })
      },
      findPage() {
        this.loading = true;
        let data = JSON.parse(JSON.stringify(this.pageRequest));

        this.$api.NumberPool[`${this.numberType == 'telA'?'AfindPage':'XfindPage'}`](data).then((res) => {
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
    }
  }
</script>
