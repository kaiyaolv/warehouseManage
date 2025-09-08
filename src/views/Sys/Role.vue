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
      <el-form-item label="角色名">
        <el-input v-model="filters.name" placeholder="角色名"></el-input>
      </el-form-item>
		</el-form>
    <div class="btnSearch">
      <kt-button icon="fa fa-search"  :label="$t('action.search')" perms="sys:role:view" type="primary" @click="searchPage()"/>
      <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:role:add" type="primary" @click="handleAdd" />
      <div class="expandButton"  v-if="showOpen" >
      	<span @click="openOperation=!openOperation">
      		{{openOperation?'收起': '展开'}}
      		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
      	</span>
      </div>
    </div>
	</header>
	<!--表格内容栏-->
	<kt-table :height="220" permsEdit="sys:role:edit" permsDelete="sys:role:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="columns" :showBatchDelete="false" @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" :isPageTable="true" @handleEdit="handleEdit" @handleDelete="handleDelete" ref="tableItem">
	</kt-table>
	<!-- </el-col> -->
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="466px" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
      label-position="right" style="text-align:left;position: relative;left:14px">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off" class="inputItem"></el-input>
			</el-form-item>
			<el-form-item label="角色名" prop="name">
				<el-input v-model="dataForm.name" placeholder="角色名" auto-complete="off" class="inputItem" maxlength='15'></el-input>
			</el-form-item>
			<el-form-item label="备注 " prop="remark">
				<el-input v-model="dataForm.remark" placeholder="备注" auto-complete="off" type="textarea" class="inputItem textarea"></el-input>
			</el-form-item>
		</el-form>
		<div class="footItem">
			<el-button :size="size" type='danger' @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" class="edit-button">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
	<!--角色菜单，表格树内容栏-->
	<div class="menu-container" :v-if="true">
		<div class="menu-header">
			<span><B>角色菜单授权</B></span>
		</div>
		<el-tree :data="menuData" size="mini" show-checkbox node-key="id" :props="defaultProps"
			style="width: 100%;" ref="menuTree" :render-content="renderContent"
			v-loading="menuLoading" element-loading-text="拼命加载中" :check-strictly="true"
			@check="treeChecked" @node-expand="nodeAllExpand">
		</el-tree>
		<div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
			<el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.id == null"><b>全选</b></el-checkbox>
		</div>
		<div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
			<kt-button :label="$t('action.reset')" perms="sys:role:edit" type="primary" @click="resetSelection"
				:disabled="this.selectRole.id == null"/>
			<kt-button :label="$t('action.submit')" perms="sys:role:edit" type="primary" @click="submitAuthForm"
				:disabled="this.selectRole.id == null" :loading="authLoading"/>
		</div>
	</div>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import { format } from "@/utils/datetime"
import { mapState } from 'vuex';
export default {
	name: "path-sys-role",
	components:{
		KtTable,
		KtButton,
		TableTreeColumn
	},
	data() {
		return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
			size: 'mini',
			filters: {
				name: ''
			},
			columns: [
				// {prop:"id", label:"ID", minWidth:50},
				{prop:"name", label:"角色名", minWidth:120},
				{prop:"remark", label:"备注", minWidth:120},
				{prop:"createBy", label:"创建人", minWidth:120},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入角色名', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				name: '',
				remark: ''
			},
			selectRole: {},
			menuData: [],
			menuSelections: [],
			menuLoading: false,
			authLoading: false,
			checkAll: false,
			currentRoleMenus: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			},
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
    //点击父节点展开所有子节点
    nodeAllExpand(object, node, item) {
      for (
        let i = 0;
        i < this.$refs.menuTree.store.nodesMap[object.id].childNodes.length;
        i++
      ) {
        this.$refs.menuTree.store.nodesMap[object.id].childNodes[
          i
        ].expanded = true;
      }
    },
    searchPage() {
      this.$refs.tableItem.refreshPageRequest(1);
    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}};
      this.openOperation = false;
			this.$api.role.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findTreeData()
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.role.batchDelete(data.params).then(data.callback)
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				name: '',
				remark: ''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
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
						this.$api.role.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
		// 获取数据
		findTreeData: function () {
			this.menuLoading = true
			this.$api.menu.findRoleMenuTree().then((res) => {
				this.menuData = res.data
				this.menuLoading = false
			})
		},
		// 角色选择改变监听
		handleRoleSelectChange(val) {
			if(val == null || val.val == null) {
				return
			}
			this.selectRole = val.val
			this.$api.role.findRoleMenus({'roleId':val.val.id}).then((res) => {
				this.currentRoleMenus = res.data
				this.$refs.menuTree.setCheckedNodes(res.data)
			})
		},
		// 树节点选择监听
		handleMenuCheckChange(data, check, subCheck) {
			if(check) {
				// 节点选中时同步选中父节点
				let parentId = data.parentId
				this.$refs.menuTree.setChecked(parentId, true, false)
			} else {
				// 节点取消选中时同步取消选中子节点
				if(data.children != null) {
					data.children.forEach(element => {
						this.$refs.menuTree.setChecked(element.id, false, false)
					});
				}
			}
		},
		// 重置选择
		resetSelection() {
			this.checkAll = false
			this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
		},
		// 全选操作
		handleCheckAll() {
			if(this.checkAll) {
				let allMenus = []
				this.checkAllMenu(this.menuData, allMenus)
				this.$refs.menuTree.setCheckedNodes(allMenus)
			} else {
				this.$refs.menuTree.setCheckedNodes([])
			}
		},
		// 递归全选
		checkAllMenu(menuData, allMenus) {
			menuData.forEach(menu => {
				allMenus.push(menu)
				if(menu.children) {
					this.checkAllMenu(menu.children, allMenus)
				}
			});
		},
		// 角色菜单授权提交
		submitAuthForm() {
			let roleId = this.selectRole.id
			if('admin' == this.selectRole.name) {
				this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
				return
			}
			this.authLoading = true
			let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
			let roleMenus = []
			for(let i=0, len=checkedNodes.length; i<len; i++) {
				let roleMenu = { roleId:roleId, menuId:checkedNodes[i].id }
				roleMenus.push(roleMenu)
			}
			this.$api.role.saveRoleMenus(roleMenus).then((res) => {
				if(res.code == 200) {
					this.$message({ message: '操作成功', type: 'success' })
				} else {
					this.$message({message: '操作失败, ' + res.msg, type: 'error'})
				}
				this.authLoading = false
			})
		},
		renderContent(h, { node, data, store }) {
			return (
			<div class="column-container">
				<span style="text-algin:center;margin-right:80px;">{data.name}</span>
				<span style="text-algin:center;margin-right:80px;">
					<el-tag type={data.type === 0?'':data.type === 1?'success':'info'} size="small">
						{data.type === 0?'目录':data.type === 1?'菜单':'按钮'}
					</el-tag>
				</span>
				<span style="text-algin:center;margin-right:80px;"> <i class={data.icon}></i></span>
				<span style="text-algin:center;margin-right:80px;">{data.parentName?data.parentName:'顶级菜单'}</span>
				<span style="text-algin:center;margin-right:80px;">{data.url?data.url:'\t'}</span>
			</div>);
      	},
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){
       return format(row[column.property])
    },
    treeChecked(data, checkedObj) {
      let check = false;
      checkedObj.checkedKeys.forEach((item) => {
        if (data.id === item) {
          check = true;
          this.cascadeSelectionChildren(data, check);
          this.cascadeSelectionParent(data, check);
        }
      });
      if (!check) {
        this.cascadeSelectionChildren(data, check);
      }
    },
    //级联选中子节点
    cascadeSelectionChildren: function (data, check) {
      data.children.forEach((element) => {
        this.$refs.menuTree.setChecked(element.id, check, false);
        if (element.children != null && element.children.length > 0) {
          this.cascadeSelectionChildren(element, check);
        }
      });
    },
    //级联选中父节点
    cascadeSelectionParent: function (data, check) {
      this.$refs.menuTree.setChecked(data.id, check, false);
      let node = this.$refs.menuTree.getNode(data.parentId);
      if (node) {
        this.cascadeSelectionParent(node.data, check);
      }
    },

	},
	mounted() {
	}
}
</script>
<style scoped lang="scss">
.menu-container {
  position: relative;
  top: 108px;
}
.menu-header {
	padding-left: 8px;
	padding-bottom: 5px;
	text-align: left;
	font-size: 16px;
	color: rgb(20, 89, 121);

}
/deep/ .el-tag{
	width: 40px !important;
}
/deep/ .el-tree-node__content{
	.column-container{
		span{
			margin-right: 50px !important;
		}
	}
}

/deep/ .el-tree-node__content{
	.column-container{
		span:nth-child(1){
			display: inline-block;
			width: 150px;
			margin-right: 40px !important;
		}
	}
}

/deep/ .el-tree-node__children{
	.column-container{
		span:nth-child(1){
			display: inline-block;
			width: 150px;
			margin-right: 22px !important;
		}
		span:nth-child(2){
			margin-right: 67px !important;
		}
	}
}
</style>
