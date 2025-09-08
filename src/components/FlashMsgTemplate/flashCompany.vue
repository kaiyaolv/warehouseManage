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
      		<el-breadcrumb-item>闪信企业</el-breadcrumb-item>
      	</el-breadcrumb>
      </div>

      <!--工具栏-->
       <header :style="{width: operationWidth + 'px'}" >
        <el-form :inline="true" :size="size" id="operationForm" :class="{operationExpand: openOperation}">
          <el-form-item label="企业名称">
            <el-input v-model="pageRequest.param.companyName" placeholder="企业名称" maxlength="50" clearable
              class="inputTool"></el-input>
          </el-form-item>
          <el-form-item label="企业编码">
            <el-input v-model="pageRequest.param.companyCode" placeholder="企业编码" maxlength="50" clearable
              class="inputTool"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select class="selectTool" v-model="pageRequest.param.type" placeholder="请选择" >
              <el-option  label="全部" :value="null"></el-option>
              <el-option  label="公共平台" :value="0"></el-option>
              <el-option  label="客户私有" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <i class="el-icon-close close-second-form" @click="viewDialogVisible = false"></i>
        </el-form>
        <div class="btnSearch">
        	<kt-button :label="$t('action.search')" perms="base:flashMsgCompanyInfo:findPage" type="primary"
        		@click="refreshPageRequest(1)" />
          <kt-button :label="$t('action.add')" perms="base:flashMsgCompanyInfo:save" type="primary"
          	@click="addHandle()" />
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
        <el-table-column
          header-align="center"
          align="center"
          min-width="200"
          :label="$t('action.operation')"
        >
          <template slot-scope="scope">
            <kt-button
              label="编辑"
              perms="base:flashMsgCompanyInfo:save"
              :size="size"
              type="warning"
              @click="editHandle(scope.row)"
            />
            <kt-button
              label="删除"
              perms="base:flashMsgTemplate:delete"
              :size="size"
              type="warning"
              @click="deleteHandle(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页符 -->
      <div class="bottom-bar page-bottom-bar">
        <el-pagination @size-change="sizeChange" background layout="total, prev,sizes, pager, next , jumper"
          @current-change="refreshPageRequest" :current-page="pageResult.pageNum" :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="100" :total="pageResult.totalSize" style="float: right">
        </el-pagination>
      </div>

      <!-- 新增 -->
      <el-dialog  :visible.sync="editDialogVisible" :close-on-click-modal="false"
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
          <el-form :model="formData" label-width="120px" :rules="dataFormRules" ref="dataForm" :size="size">
            <div class="second-title-box">
              <div class="second-title">{{opa ? '新增' : '编辑'}}</div>
            </div>
            <el-row class="rowItem">
              <el-col :span="12">
                <el-form-item label="企业名称" prop="companyName">
                  <el-input maxlength="50" placeholder="企业名称" v-model="formData.companyName" class="inputItem">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业编码" prop="companyCode">
                  <el-input maxlength="50" placeholder="企业编码" v-model="formData.companyCode" class="inputItem">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号" prop="account">
                  <el-input maxlength="50" placeholder="账号" v-model="formData.account" class="inputItem">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码" prop="passwd">
                  <el-input maxlength="50" placeholder="密码" v-model="formData.passwd" class="inputItem">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型" prop="type">
                  <el-select v-model="formData.type " placeholder="类型" class="selectItem">
                    <el-option label="平台公共" :value="0"></el-option>
                    <el-option label="客户私有" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="footButtonItem">
          <el-button :size="size" @click.native="editDialogVisible = false" type="primary">{{
            $t("action.cancel")
          }}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" class="edit-button">{{
            $t("action.submit")
          }}</el-button>
        </div>
      </el-dialog>



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
            prop: "companyName",
            label: "企业名称",
            minWidth: 100,
          },
          {
            prop: "companyCode",
            label: "企业编码",
            minWidth: 100
          },
          {
            prop: "account",
            label: "账号",
            minWidth: 100,
          },
          {
            prop: "passwd",
            label: "密码",
            minWidth: 100,
          },
          {
            prop: "type",
            label: "类型",
            minWidth: 100,
            formatter: this.formateType
          },
          {
            prop: "createBy",
            label: "创建人",
            minWidth: 80
          },
          {
            prop: "createTime",
            label: "创建时间",
            minWidth: 120
          },
          {
            prop: "lastUpdateBy",
            label: "修改人",
            minWidth: 80
          },
          {
            prop: "lastUpdateTime",
            label: "修改时间",
            minWidth: 120
          },
        ],
        pageResult:{},
        loading: false,
        size: 'mini',
        pageRequest: {
          pageNum: 1,
          pageSize: 100,
          param: {
            companyName: null,
            companyCode: null,
            type: null,
          }
        },
        editDialogVisible: false, // 新增编辑
        opa: true, // true 新增 false 编辑
        formData: {
          "companyName": null,
          "companyCode": null,
          "account": null,
          "passwd": null,
          "type": null
        },
        dataFormRules: {
          companyName: [{
            required: true,
            message: "请输入企业名称",
            trigger: 'change'
          }],
          companyCode: [{
            required: true,
            message: "请输入企业编码",
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }],
          passwd: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }],
          type: [{
            required: true,
            message: "请选择类型",
            trigger: "change"
          }],
        },
        editLoading: false,
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
      formateType(row) {
        let data = {
          0: '公共平台',
          1: '客户私有'
        }
        return data[row.type];
      },
      parentHandle() {
        this.pageRequest = {
          pageNum: 1,
          pageSize: 100,
          param: {
            companyName: null,
            companyCode: null,
            type: null,
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

        data.param.companyName = data.param.companyName || null;
        data.param.companyCode = data.param.companyCode || null;

        this.$api.FlashMsgTemplate.findPageCompanyInfo(data).then((res) => {
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
      addHandle() {
        this.editDialogVisible = true;
        this.opa = true;
        this.formData = {
          "companyName": null,
          "companyCode": null,
          "account": null,
          "passwd": null,
          "type": null
        }
      },
      // 编辑
      editHandle(row) {
        this.editDialogVisible = true;
        this.opa = false;
        this.formData = JSON.parse(JSON.stringify(row));
      },
      //  提交
      submitForm() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let data = JSON.parse(JSON.stringify(this.formData));
            this.editLoading = true;
            this.$api.FlashMsgTemplate.saveCompanyInfo(data).then((res) => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.findPage();
                this.$emit('getDict');
                this.editDialogVisible = false;
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        })
      },
      // 删除
      deleteHandle(row) {
        this.$confirm("确认删除吗？", "提示", {
          type: "warning",
        }).then(() => {
          this.$api.FlashMsgTemplate.deleteCompanyInfo({id: row.id}).then(res=>{
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.refreshPageRequest(1);
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        });
      },
    }
  }

</script>

<style>
</style>
