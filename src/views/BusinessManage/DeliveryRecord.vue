<!-- tsx -->
<template>
  <div class="package">
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
        <el-form-item label="溯源码">
          <el-input
            maxlength="50"
            v-model="pageRequest.param.uniqueCode"
            placeholder="溯源码"
            class="inputtool"
          ></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-select v-model="pageRequest.param.customerId" placeholder="请选择客户名称">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-select v-model="pageRequest.param.productId" placeholder="请选择产品名称">
            <el-option label="全部" :value="null"></el-option>
            <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker v-model="pageRequest.param.birthTime" placeholder="请选择生产日期" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="箱码">
          <el-input v-model="pageRequest.param.boxCode" placeholder="请选择箱码" class="inputtool"></el-input>
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker v-model="pageRequest.param.sellTime" placeholder="请选择出库日期" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          type="primary"
          perms="deliveryRecord:findPage"
          @click="refreshPageRequest(1)"
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
      :height="tableHeight"
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
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <kt-button perms="deliveryRecord:delete" type="danger" :size="size" @click="handleDelete(scope.row)" :label="$t('action.delete')"></kt-button>
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
  </div>
</template>

<script >
import KtButton from "@/views/Core/KtButton";
import { format, timestampToTime } from "@/utils/datetime";
import { mapState } from 'vuex';
import { baseUrl } from 'global';
import Cookies from 'js-cookie';
export default {
  name: "path-businessManage-deliveryRecord",
  components: { KtButton },
  data() {
    // 这里存放数据
    return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
      loading: false,
      pageRequest: {
        pageNum: 1,
        pageSize: 100,
        param: {
          uniqueCode: null,
          customerId: null,
          productId: null,
          birthTime: null,
          boxCode: null,
          sellTime: null,
        },
      },
      pageResult: {},
      size: "mini",
      tableList: [
        {
          prop: "productName",
          label: "产品名称",
          minWidth: 100,
        },
        {
          prop: 'uniqueCode',
          label: '溯源码',
          minWidth: 100,
        },
        {
          prop: 'boxCode',
          label: '箱码',
          minWidth: 100,
        },
        {
          prop: 'birthTime',
          label: '生产日期',
          minWidth: 100,
        },
        {
          prop: 'boxCode',
          label: '箱码',
          minWidth: 100,
        },
        {
          prop: 'sellTime',
          label: '出库日期',
          minWidth: 100,
        },
        {
          prop: 'customerName',
          label: '客户名称',
          minWidth: 100,
        },
        {
          prop: 'address',
          label: '出货地址',
          minWidth: 100,
        },
        {
          prop: 'createBy',
          label: '创建人',
          minWidth: 100,
        },
        {
          prop: 'createTime',
          label: '创建时间',
          minWidth: 150,
        }
      ],
      pagePath: [], //页面路径
      customerList: [],
      productList: [],
    };
  },
  filters: {},
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
  // 方法集合
  methods: {
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
    findPage() {
      this.openOperation = false;
      this.loading = true;
      this.$api.deliveryRecord.findPage(this.pageRequest).then((res) => {
        if (res.code == 200) {
          this.pageResult = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$api.deliveryRecord.deleteItem([{id: row.id}]).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.findPage();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getAllCustomer() {
      this.$api.customerManage.customerAll().then((res) => {
        if (res.code == 200) {
          this.customerList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getAllProduct() {
      this.$api.productManage.productAll().then((res) => {
        if (res.code == 200) {
          this.productList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },

  created() {
    this.findPage();
    this.getAllCustomer();
    this.getAllProduct();
  },
};
</script>
