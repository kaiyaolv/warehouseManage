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
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          type="primary"
          perms="qrCode:findPage"
          @click="refreshPageRequest(1)"
        />
        <kt-button
          :label="$t('action.add')"
          type="primary"
          perms="qrCode:save"
          @click="handleAdd"
        />
        <kt-button
          :label="$t('action.import')"
          type="primary"
          perms="qrCode:import"
          @click="importHandle"
        />
        <kt-button
          label="导出"
          type="primary"
          perms="qrCode:export"
          @click="exportHandle"
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
          <kt-button perms="qrCode:edit" type="primary" :size="size" @click="handleEdit(scope.row)" :label="$t('action.edit')"></kt-button>
          <kt-button perms="qrCode:delete" type="danger" :size="size" @click="handleDelete(scope.row)" :label="$t('action.delete')"></kt-button>
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
    
    <!-- 新增/编辑 -->
    <el-dialog :title="handleType" width="466px" :visible.sync="handleVisible" v-if="handleVisible" :close-on-click-modal="false">
      <el-form :model="handleForm" label-width="115px" :rules="handleFormRules" 
        ref="handleForm" size="mini"
        label-position="right" style="position: relative; left: 4px">
        <el-form-item label="编码前缀" prop="prefixTag">
          <el-input maxlength="50" v-model="handleForm.prefixTag" placeholder="编码前缀"
            class="inputItem" clearable></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input maxlength="50" v-model="handleForm.num" placeholder="数量" type="textarea"
            class="inputItem" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="footItem">
        <el-button :size="size" type="info" @click.native="handleVisible = false">{{ $t("action.cancel") }}</el-button>
        <el-button :size="size" type="primary" @click.native="handleSubmit" class="edit-button" :loading="handleLoading">
          {{ $t("action.submit") }}
        </el-button>
      </div>   
    </el-dialog>
    
    <!-- 新增 -->
    <el-dialog title="导入" width="526px" :visible.sync="editDialogVisible" :modal="true" v-if="editDialogVisible"
      :close-on-click-modal="false">

      <el-form :model="dataForm" label-width="110px" :rules="dataFormRules" ref="dataForm" :size="size"
        style="position:relative;left:10px" class="importForm">
        <el-col :span='24'>
          <el-col :span="12">
            <el-form-item label="文件导入" prop="filePaths" ref="uplaod">
              <el-upload :headers="headers" :action="baseUrl + '/qrCode/import'" :limit="1"
                :on-change="handleChange" :on-remove="handleRemove" accept=".xlsx" style="text-align:left" :auto-upload="false"
                :size="size" :on-success="handleSuccess" ref="uploadItem">
                <img src="../../assets/img/upload.png" style="width:50px;height:50px">
              </el-upload>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span='24' style="height:25px;margin-bottom: 10px">
          <el-form-item label="数据模板" prop="phoneImport">
            <div id="" style="text-align:left">
              <span id="" class="modelDown" @click="modelDown()">
                模板下载
              </span>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- </div> -->
      <div class="	footItem">
        <el-button type="info" :size="size" @click.native="editDialogVisible=false">{{
          $t("action.cancel")
        }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading='importLoading' class="test-style">
          {{ $t("action.submit") }}
        </el-button>
      </div>

    </el-dialog>

    
    
    
    
  </div>
</template>

<script >
import KtButton from "@/views/Core/KtButton";
import { format, timestampToTime } from "@/utils/datetime";
import { mapState } from 'vuex';
import { baseUrl } from 'global';
import Cookies from 'js-cookie';
export default {
  name: "path-businessManage-qrCodeManage",
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
        },
      },
      pageResult: {},
      size: "mini",
      tableList: [
        {
          prop: "uniqueCode",
          label: "溯源码",
          minWidth: 300,
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
        },
      ],
      pagePath: [], //页面路径
      handleType: '', // 新增/编辑
      handleVisible: false, // 新增/编辑弹窗
      handleForm: {
        prefixTag: null,
        num: null,
      }, // 新增/编辑表单
      handleFormRules: {
        prefixTag: [
          { required: true, message: '请输入编码前缀', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
      },
      handleLoading: false, // 新增/编辑按钮loading
      baseUrl: baseUrl,
      headers: {
        token: Cookies.get("centerAdminToken"),
      },
      dataForm: {
        filePaths: null,
      },
      dataFormRules: {
        filePaths: [
          { required: true, message: '请选择文件', trigger: 'blur' }
        ],
      },
      importLoading: false,
      editDialogVisible: false,
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
    exportHandle() {
      if (!this.pageRequest.param.uniqueCode) {
        this.$message.error('请输入编码前缀');
        return;
      }
      this.$api.qrCodeManage.exportQrCode({param: this.pageRequest.param}).then((res) => {
        let data = res;
        this.loading = false;
        if (!data) {
          return;
        }
        let url = window.URL.createObjectURL(new Blob([data]));
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.setAttribute("download", '溯源码.xlsx');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    },
    importHandle() {
      this.editDialogVisible = true;
      this.dataForm = {
        filePaths: null,
      };
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.dataForm.filePaths = null;
    },
    handleChange(file, fileList) {
      console.log(file, fileList);
      this.dataForm.filePaths = file.name;
    },
    handleSuccess(res, file) {
      this.importLoading = false;
      if (res.code == 200) {
        this.$message.success('导入成功');
        this.editDialogVisible = false;
        this.findPage();
      } else {
        this.$message.error(res.msg);
      }
    },
    submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.importLoading = true;
          this.$refs.uploadItem.submit();
        }
      });
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
    findPage() {
      this.openOperation = false;
      this.loading = true;
      this.$api.qrCodeManage.findPage(this.pageRequest).then((res) => {
        if (res.code == 200) {
          this.pageResult = res.data;
        } else {
          this.$message.error(res.msg);
        }
        this.loading = false;
      });
    },
    handleAdd() {
      this.handleType = '新增';
      this.handleVisible = true;
      this.handleForm = {
        prefixTag: null,
        num: null,
      };
    },
    handleEdit(row) {
      this.handleType = '编辑';
      this.handleVisible = true;
      this.handleForm = row;
    },
    handleDelete(row) {
      this.$api.qrCodeManage.deleteItem([{id: row.id}]).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.findPage();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSubmit() {
      this.$refs.handleForm.validate((valid) => {
        if (valid) {
          this.handleLoading = true;
          this.$api.qrCodeManage.save(this.handleForm).then((res) => {
            this.handleLoading = false;
            if (res.code == 200) {
              this.$message.success('操作成功');
              this.handleVisible = false;
              this.findPage();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    // 模板下载
    modelDown() {
      let fileName = `溯源码文件模板${format(new Date())}.xlsx`;
      this.$api.qrCodeManage.getQrTemplate().then((res) => {
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
      });
    },
  },

  created() {
    this.findPage();
  },
};

</script>

<style lang="scss" scoped>
.modelDown {
  color: rgb(101, 48, 150);
  border-bottom: 1px solid rgb(101, 48, 150);
  cursor: pointer;
}
</style>
