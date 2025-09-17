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
        <el-form-item label="产品名称">
          <el-input
            maxlength="50"
            v-model="pageRequest.param.productName"
            placeholder="产品名称"
            class="inputtool"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          type="primary"
          perms="product:findPage"
          @click="refreshPageRequest(1)"
        />
        <kt-button
          :label="$t('action.add')"
          type="primary"
          perms="product:save"
          @click="handleAdd"
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
          <kt-button perms="product:edit" type="primary" :size="size" @click="handleEdit(scope.row)" :label="$t('action.edit')"></kt-button>
          <kt-button perms="product:delete" type="danger" :size="size" @click="handleDelete(scope.row)" :label="$t('action.delete')"></kt-button>
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
        <el-form-item label="产品名称" prop="productName">
          <el-input maxlength="50" v-model="handleForm.productName" placeholder="产品名称"
            class="inputItem" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input maxlength="50" v-model="handleForm.remark" placeholder="备注" type="textarea"
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
  </div>
</template>

<script >
import KtButton from "@/views/Core/KtButton";
import { format, timestampToTime } from "@/utils/datetime";
import { mapState } from 'vuex';
export default {
  name: "path-basicData-productManage",
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
          productName: null,
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
          prop: 'remark',
          label: '备注',
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
        },
      ],
      pagePath: [], //页面路径
      handleType: '', // 新增/编辑
      handleVisible: false, // 新增/编辑弹窗
      handleForm: {
        productName: null,
        remark: null,
      }, // 新增/编辑表单
      handleFormRules: {
        productName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
      },
      handleLoading: false, // 新增/编辑按钮loading
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
      this.$api.productManage.findPage(this.pageRequest).then((res) => {
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
        productName: null,
        remark: null,
      };
    },
    handleEdit(row) {
      this.handleType = '编辑';
      this.handleVisible = true;
      this.handleForm = row;
    },
    handleDelete(row) {
      this.$api.productManage.deleteItem([{id: row.id}]).then((res) => {
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
          this.$api.productManage.save(this.handleForm).then((res) => {
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
  },

  created() {
    this.findPage();
  },
};
</script>
