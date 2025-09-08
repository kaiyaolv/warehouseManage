<template>
  <div class="page-container">
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
          {{item}}
        </el-breadcrumb-item>

      </el-breadcrumb>
    </div>
	<!--工具栏-->
	<header :style="{width: operationWidth + 'px'}">
		<el-form :inline="true" :model="filters" :size="size"
      id="operationForm"
      :class="{operationExpand: openOperation}">
      <el-form-item label="名称">
        <el-input v-model="filters.label" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item label="值">
        <el-input v-model="filters.value" placeholder="值"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="filters.type" filterable placeholder="类型" class="selectTool"
          @clear="selectClear(filters, 'type')" clearable>
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="(item, index) in typeList" :label="item" :value="item" :key="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="filters.description" placeholder="描述" class="inputTool"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="filters.remarks" placeholder="备注" class="inputTool"></el-input>
      </el-form-item>
      <el-form-item label="使用状态">
        <el-select v-model="filters.delFlag" placeholder="使用状态" class="selectTool">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="启用" :value="0"></el-option>
          <el-option label="禁用" :value="1"></el-option>
        </el-select>
      </el-form-item>
		</el-form>
    <div class="btnSearch">
      <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="searchPage()"/>
      <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:dict:add" type="primary" @click="handleAdd" />
      <div class="expandButton"  v-if="showOpen" >
      	<span @click="openOperation=!openOperation">
      		{{openOperation?'收起': '展开'}}
      		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
      	</span>
      </div>
    </div>
	</header>
	<!--表格内容栏-->
	<kt-table :height="getTableHeight()" :isPageTable="true"
		:data="pageResult" :columns="columns" ref="tableItem"
		@findPage="findPage" :size_change="size_change"  :showOperation="false">
    <template slot="btns">
      <el-table-column
        :label="$t('action.operation')"
        width="200"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <kt-button
            icon="fa fa-edit"
            label="编辑"
            perms="sys:dict:edit"
            :size="size"
            type="success"
            @click="handleEdit(scope)"
          />
          <kt-button
            icon="fa fa-edit"
            :label="scope.row.delFlag == 0? '禁用': '启用'"
            perms="sys:dict:edit"
            :size="size"
            type="success"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </template>
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="466px" :visible.sync="editDialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size" style="position: relative; left:-10px">
			<el-form-item label="ID" prop="id"  v-if="false">
				<el-input v-model="dataForm.id" placeholder="ID" :disabled="true" auto-complete="off" class="inputItem"></el-input>
			</el-form-item>
			<el-form-item label="名称" prop="label">
				<el-input v-model="dataForm.label" placeholder="名称" auto-complete="off" class="inputItem"></el-input>
			</el-form-item>
			<el-form-item label="值" prop="value">
				<el-input class="inputItem" placeholder="值" type="textarea" v-model="dataForm.value" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-input class="inputItem" placeholder="类型" v-model="dataForm.type" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input class="inputItem" placeholder="排序" v-model="dataForm.sort" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="描述 " prop="description">
				<el-input class="inputItem" placeholder="描述" v-model="dataForm.description" auto-complete="off" type="textarea"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remarks" class="inputItem">
				<el-input v-model="dataForm.remarks" placeholder="备注" auto-complete="off" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" type='danger' @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" class="edit-button">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import { mapState } from 'vuex';
export default {
	name: "path-sys-dict",
	components:{
			KtTable,
			KtButton
	},
	data() {
		return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
			size: 'mini',
			filters: {
				label: '',
        type: null,
        value: null,
        description: null,
        remarks: null,
        delFlag: null,
			},
			columns: [
				// {prop:"id", label:"ID", minWidth:50},
				{prop:"label", label:"名称", minWidth:100},
				{prop:"value", label:"值", minWidth:100},
				{prop:"type", label:"类型", minWidth:80},
				{prop:"sort", label:"排序", minWidth:80},
				{prop:"description", label:"描述", minWidth:120},
				{prop:"remarks", label:"备注", minWidth:120},
        {prop:"delFlag", label:"使用状态", minWidth:120,formatter:this.delFormate},
				{prop:"createBy", label:"创建人", minWidth:100},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			editDialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				label: [
					{ required: true, message: '请输入名称', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: null,
				label: '',
				value: '',
				type: '',
				sort: 0,
				description: '',
				remarks: ''
			},
      typeList: [],
      pagePath: [], //页面路径
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
    delFormate(row) {
      return row.delFlag === 0? '启用': row.delFlag === 1?'禁用':null;
    },
    findPage1(){
      this.pageRequest.pageNum=1
      let obj = {
        pageRequest:this.pageRequest
      }
      this.findPage(obj)
    },
    searchPage() {
      this.$refs.tableItem.refreshPageRequest(1);
    },
    size_change(e){
      this.pageRequest.pageSize=e
      this.pageRequest.pageNum=1
      let obj2 = {
        pageRequest:this.pageRequest
      }
      this.findPage(obj2)
    },
    getHeight() {
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      let height;
      if (width < 1280) {
        height =
          (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) -
          328;
      } else {
        height =
          (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) -
          299;
      }
      return height;
    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
      this.openOperation = false;
			this.pageRequest.param =  this.filters;
			this.$api.dict.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (row) {
      this.$confirm(`确认${row.delFlag==0?'禁用':'启用'}选中记录吗？`, '提示', {
      	type: 'warning'
      }).then(() => {
        let data = JSON.parse(JSON.stringify(row));
        data.delFlag = data.delFlag == 0?1: 0;
        this.$api.dict.save(data).then((res) => {
          if (res.code == 200) {
            this.$message({
            	message: '操作成功',
            	type: 'success'
            })
            this.findPage(null)
          } else {
            this.$message({
            	message: res.msg,
            	type: 'success'
            })
          }
        })
      });
		},
		// 显示新增界面
		handleAdd: function () {
			this.editDialogVisible = true
			this.operation = true
			this.dataForm = {
				id: null,
				label: '',
				value: '',
				type: '',
				sort: 0,
				description: 'desc',
				remarks: 'remark'
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.editDialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.dict.save(params).then((res) => {
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.editLoading = false
							this.$refs['dataForm'].resetFields()
							this.editDialogVisible = false
							setTimeout(()=>{
							  this.findPage(null)
							},1000)
						})
					})
				}
			})
		},
     //根据查询所有字典类型
    getDict() {
      this.$api.dict.findAllType().then((res) => {
          this.typeList = res.data;
      });
    },
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){	return format(row[column.property])	}
	},
	mounted() {
    this.getDict();
	}
}
</script>

<style scoped>

</style>
