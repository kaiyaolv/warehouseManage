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
            clearable
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
          <el-input v-model="pageRequest.param.boxCode" placeholder="请选择箱码" class="inputtool" clearable></el-input>
        </el-form-item>
        <el-form-item label="出库日期">
          <el-date-picker v-model="pageRequest.param.sellTime" placeholder="请选择出库日期" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          type="primary"
          perms="warehouse:findPage"
          @click="refreshPageRequest(1)"
        />
        <kt-button
          label="入库"
          type="primary"
          perms="warehouse:putInWarehouse"
          @click="handlePutIn"
        />
        <kt-button
          label="出库"
          type="primary"
          perms="warehouse:batchDelivery"
          @click="handleOutWarehouse"
        />
        <!-- <div class="expandButton"  v-if="showOpen" >
        	<span @click="openOperation=!openOperation">
        		{{openOperation?'收起': '展开'}}
        		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        	</span>
        </div> -->
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
          <kt-button perms="warehouse:delete" type="danger" :size="size" @click="handleDelete(scope.row)" :label="$t('action.delete')"></kt-button>
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
    
    <!-- 入库 -->
    <el-dialog :visible.sync="putInDialogVisible" :close-on-click-modal="false" v-if="putInDialogVisible" fullscreen
      :modal="false" class="dialog-fullscreen"
      :class="collapse ? 'dialog-fullscreen-width-collapse' : 'dialog-fullscreen-width'">
      <div class="pathBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
            <span v-if="index != pagePath.length - 1">{{ item }}</span>
            <span @click="putInDialogVisible = false" class="last-page-tag" v-else>{{ item }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>入库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-box">
        <i class="el-icon-close second-page-close" @click="putInDialogVisible = false"></i>
        <el-form :model="formData" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size">
          <div class="second-title-box">
            <div class="second-title">入库</div>
          </div>
          <div class="second-content-box">
            <div style="text-align: left;width: 380px;">
              <el-form-item label="产品名称" prop="productId">
                <el-select v-model="formData.productId" placeholder="请选择产品名称" class="form-item">
                  <el-option v-for="item in productList" :key="item.id" :label="item.productName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产日期" prop="birthTime">
                <el-date-picker v-model="formData.birthTime" placeholder="请选择生产日期" type="date" value-format="yyyy-MM-dd" class="form-item"></el-date-picker>
              </el-form-item>
              <el-form-item label="箱码" prop="boxCode">
                <el-input v-model="formData.boxCode" placeholder="请输入箱码" class="form-item"></el-input>
              </el-form-item>
               <el-form-item label="扫码">
                 <el-input 
                   type="text" 
                   v-model="scanInputValue"
                   placeholder="请点击此框开始扫条形码/二维码" 
                   ref="scanInput"
                   @focus="startScan"
                   @blur="stopScan"
                   @keydown.native="handleScanInput"
                   class="form-item"
                   :class="{ 'scanning-input': isScanning }"
                 ></el-input>
               </el-form-item>

            </div>
            <div class="table-container">
              <el-table 
                :data="tableData" 
                stripe 
                :size="size" 
                :highlight-current-row="true" 
                border 
                class="table-item"
                :height="300"
              >
                <el-table-column prop="uniqueCode" label="溯源码" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="handleDelete(scope.row)" :size="size">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
      <div class="footButtonItem">
        <el-button :size="size" @click.native="putInDialogVisible = false" type="primary">{{
          $t("action.cancel")
        }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" class="edit-button">{{
          $t("action.submit")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 出库 -->
    <el-dialog :visible.sync="outWarehouseDialogVisible" :close-on-click-modal="false" v-if="outWarehouseDialogVisible" fullscreen
      :modal="false" class="dialog-fullscreen"
      :class="collapse ? 'dialog-fullscreen-width-collapse' : 'dialog-fullscreen-width'">
      <div class="pathBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
            <span v-if="index != pagePath.length - 1">{{ item }}</span>
            <span @click="outWarehouseDialogVisible = false" class="last-page-tag" v-else>{{ item }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>出库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-box">
        <i class="el-icon-close second-page-close" @click="outWarehouseDialogVisible = false"></i>
        <el-form :model="formData" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size">
          <div class="second-title-box">
            <div class="second-title">出库</div>
          </div>
          <div class="second-content-box">
            <div style="text-align: left;width: 380px;">
              <el-form-item label="客户名称" prop="customerId">
                <el-select v-model="formData.customerId" placeholder="请选择客户名称" class="form-item">
                  <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="出库日期" prop="sellTime">
                <el-date-picker v-model="formData.sellTime" placeholder="请选择出库日期" type="date" value-format="yyyy-MM-dd" class="form-item"></el-date-picker>
              </el-form-item>
              <el-form-item label="出货地址" prop="address">
                <el-input v-model="formData.address" placeholder="请输入出货地址" class="form-item"></el-input>
              </el-form-item>
              <el-form-item label="扫码">
                <el-input 
                  type="text" 
                  v-model="scanInputValue"
                  placeholder="请点击此框开始扫条形码/二维码" 
                  ref="scanInput"
                  @focus="startScan"
                  @blur="stopScan"
                  @keydown.native="handleScanInput"
                  class="form-item"
                  :class="{ 'scanning-input': isScanning }"
                ></el-input>
              </el-form-item>
            </div>
            <div class="table-container">
              <el-table 
                :data="tableData" 
                stripe 
                :size="size" 
                :highlight-current-row="true" 
                border 
                class="table-item"
                :height="300"
              >
                <el-table-column prop="uniqueCode" label="溯源码" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="handleDelete(scope.row)" :size="size">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form>
      </div>
      <div class="footButtonItem">
        <el-button :size="size" @click.native="outWarehouseDialogVisible = false" type="primary">{{
          $t("action.cancel")
        }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitOutWarehouse" :loading="editLoading" class="edit-button">{{
          $t("action.submit")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script >
import KtButton from "@/views/Core/KtButton";
import { format, timestampToTime } from "@/utils/datetime";
import { mapState } from 'vuex';
export default {
  name: "path-businessManage-inventoryManage",
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
          prop: 'customerName',
          label: '客户名称',
          minWidth: 100,
        },
        {
          prop: 'sellTime',
          label: '出库日期',
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
      putInDialogVisible: false,
      formData: {
        productId: null,
        birthTime: null,
        boxCode: null,
      },
      dataFormRules: {
        productId: [
          { required: true, message: '请选择产品名称', trigger: 'change' }
        ],
        birthTime: [
          { required: true, message: '请选择生产日期', trigger: 'change' }
        ],
        sellTime: [
          { required: true, message: '请选择出库日期', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入出货地址', trigger: 'blur' }
        ],
        customerId: [
          { required: true, message: '请选择客户名称', trigger: 'change' }
        ],
      },
      // 扫码相关
      scanInputValue: '',
      isScanning: false,
      tableData: [],
      editLoading: false,
      outWarehouseDialogVisible: false,
      handleType: 'putIn',
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
      this.$api.inventoryManage.findPage(this.pageRequest).then((res) => {
        if (res.code == 200) {
          this.pageResult = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
    handleDelete(row) {
      this.$api.inventoryManage.deleteItem([{id: row.id}]).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.findPage();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handlePutIn() {
      this.handleType = 'putIn';
      this.putInDialogVisible = true;
      this.tableData = [];
      this.scanInputValue = '';
      this.formData = {
        productId: null,
        birthTime: null,
        boxCode: null,
      };
    },
    handleOutWarehouse() {
      this.handleType = 'outWarehouse';
      this.outWarehouseDialogVisible = true;
      this.tableData = [];
      this.scanInputValue = '';
      this.formData = {
        customerId: null,
        sellTime: null,
        address: null,
      };
    },
    submitOutWarehouse() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.editLoading = true;
          if (this.tableData.length == 0) {
            this.$message.error('请先扫码');
            this.editLoading = false;
            return;
          }
          this.formData.uniqueCodeList = this.tableData.map(item => item.uniqueCode);
          this.$api.inventoryManage.outWarehouse(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('出库成功');
              this.findPage();
              this.outWarehouseDialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
            this.editLoading = false;
          });
        }
      });
    },
    submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.editLoading = true;
          if (this.tableData.length == 0) {
            this.$message.error('请先扫码');
            this.editLoading = false;
            return;
          }
          this.formData.uniqueCodeList = this.tableData.map(item => item.uniqueCode);      
          this.$api.inventoryManage.putInWarehouse(this.formData).then((res) => {
            if (res.code == 200) {
              this.$message.success('入库成功');
              this.findPage();
              this.putInDialogVisible = false;
            } else {
              this.$message.error(res.msg);
            }
            this.editLoading = false;
          });
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
    // 扫码相关方法
    startScan() {
      this.isScanning = true;
      console.log('开始扫码模式');
    },
    stopScan() {
      this.isScanning = false;
      console.log('停止扫码模式');
    },
    handleScanInput(event) {
      // 扫码枪通常以很快的速度输入字符，最后以回车结束
      if (event.key === 'Enter') {
        event.preventDefault();
        this.processScanResult();
        return;
      }
    },
    processScanResult() {
      if (this.scanInputValue.trim()) {
        this.handleScanData(this.scanInputValue.trim());
        this.scanInputValue = ''; // 清空输入框
      }
    },
    handleScanData(scanData) {
      // 处理扫码数据的业务逻辑
      // 例如：验证码格式、查询产品信息等
      this.$message.success(`扫码成功: ${scanData}`);
      if (this.handleType == 'putIn') {
        this.$api.qrCodeManage.findByUniqueCode({uniqueCode: scanData}).then((res) => {
          if (res.code == 200) {
            this.tableData.push(res.data);
          } else {
            this.$message.error(res.msg);
          }
        });     
      } else {
        this.$api.inventoryManage.findByUniqueCodes({codeTag: scanData}).then((res) => {
          if (res.code == 200) {
            this.tableData = [...this.tableData, ...res.data];
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    handleDelete(row) {
      this.tableData = this.tableData.filter(item => item.uniqueCode !== row.uniqueCode);
    },
  },

  created() {
    this.findPage();
    this.getAllCustomer();
    this.getAllProduct();
  },
};
</script>

<style scoped lang="scss">
  .second-content-box {
    height: calc(100vh - 50px - 41px - 37px - 42px - 16px - 56px - 5px);
    display: flex;
    gap: 20px;
  }
  .form-item {
    width: 250px;
  }
  
  /* 表格容器样式 */
  .table-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .table-item {
    flex: 1;
  }
  
  /* 扫码输入框样式 */
  /deep/ .scanning-input .el-input__inner {
    border-color: #67c23a !important;
    background-color: #f0f9ff !important;
    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2) !important;
    transition: all 0.3s ease;
  }
  
  /deep/ .scanning-input .el-input__inner::placeholder {
    color: #67c23a !important;
    font-weight: bold !important;
  }
  
  /deep/ .scanning-input .el-input__inner:focus {
    border-color: #67c23a !important;
    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.3) !important;
  }
</style>
