<template>
	<!-- <el-card class="box-card" style="margin: 5px;height: 97%;overflow: auto;"> -->
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
        <el-form-item label="用户名">
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
			</el-form>
      <div class="btnSearch">
        <kt-button  :label="$t('action.search')" perms="sys:user:view" type="primary"
        	@click="findPage1(null)" />
        <kt-button  :label="$t('action.add')" perms="sys:user:add" type="primary"
        	@click="handleAdd" />
        <div class="expandButton"  v-if="showOpen" >
        	<span @click="openOperation=!openOperation">
        		{{openOperation?'收起': '展开'}}
        		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        	</span>
        </div>
      </div>
		</header>


		<!--表格内容栏-->
		<el-table :data="pageRequest.content" class="page-table" stripe :size="size" :height="getTableHeight()" rowKey="id" v-loading="loading"
			:highlight-current-row="true" :element-loading-text="$t('action.loading')">
      <el-table-column prop="" header-align="center" width="65" align="center" label="序号">
            <template slot-scope="scope">
                    <span>{{
                    (pageRequest.pageNum - 1) * pageRequest.pageSize + scope.$index + 1
                  }}</span>
            </template>
      </el-table-column>
			<!-- <el-table-column prop="id" header-align="center" align="center" label="ID">
			</el-table-column> -->
			<el-table-column prop="name" header-align="center" align="center" label="用户名" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="roleNames" header-align="center" align="center" label="角色" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="email" header-align="center" align="center" label="邮箱" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="mobile" header-align="center" align="center" label="手机" :show-overflow-tooltip="true">
			</el-table-column>
      <el-table-column prop="lastLoginTime" header-align="center" align="center" label="上次登录时间"
        :show-overflow-tooltip="true" :formatter='dateFormat'>
      </el-table-column>
      <!-- <el-table-column prop="numberDesensitization" header-align="center" align="center" label="是否脱敏" :show-overflow-tooltip="true"
        :formatter="formatStatus">
      </el-table-column> -->
			<el-table-column prop="status" header-align="center" align="center" label="状态" :show-overflow-tooltip="true"
        :formatter="(row, col, val)=>{return val == 1?'正常':'禁用'}">
      </el-table-column>
      <el-table-column prop="mark" header-align="center" align="center" label="备注" :show-overflow-tooltip="true">
      </el-table-column>
			<el-table-column header-align="center" align="left" width="350" :label="$t('action.operation')">
				<template slot-scope="scope">
					<kt-button icon="fa fa-edit" :label="$t('action.edit')" type="success" perms="sys:user:edit"
						@click="handleEdit(scope.row)" />
					<kt-button icon="el-icon-refresh" label="重置密码" type="primary" perms="sys:user:edit"
						@click="openEditPwdDialog(scope.row)" />
					<kt-button icon="fa fa-trash" :label="$t('action.delete')" type="danger" perms="sys:user:delete"
						@click="handleDelete(scope.row)" />
          <kt-button :label="scope.row.numberDesensitization == 1?'脱敏':'不脱敏'" type="danger" perms="sys:user:numberDesensitization"
          	@click="handlePrivacy(scope.row)" />
					<kt-button :label="scope.row.status == 1?'禁用':'启用'" type="danger" perms="sys:user:edit"
					@click="handleStatus(scope.row)" />
				</template>
			</el-table-column>
		</el-table>

		<!--分页栏-->
		<div class="bottom-bar page-bottom-bar">
			<el-pagination  background @size-change="size_change" :page-sizes="[100, 500, 1000]"
				layout="total, prev,sizes, pager, next , jumper" @current-change="refreshPageRequest"
				:current-page="pageRequest.pageNum" :page-size="pageRequest.pageSize" :total="pageRequest.totalSize"
				style="float:right;">
			</el-pagination>
		</div>
		<!--新增编辑界面-->
		<el-dialog :title="operation ? '新增' : '编辑'" width="466px" :visible.sync="dialogVisible"
			:close-on-click-modal="false">
			<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" size="mini"
				label-position="right" style="position: relative;left:4px" v-if="dialogVisible">
				<el-form-item label="ID" prop="id" v-if="false">
					<el-input v-model="dataForm.id" :disabled="true" auto-complete="off" class="inputItem"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="name">
					<el-input class="inputItem" placeholder="用户名" maxlength="20" v-model="dataForm.name" auto-complete="new-password"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" v-if="orderPasswords==true">
					<el-row>
						<el-col :span="18">
							<el-input placeholder="密码" v-model="dataForm.password" auto-complete="new-password"
								style="margin-left: 6px;"></el-input>
						</el-col>
						<el-col :span="2" class="icon-list__tips" style="display: flex; align-items: center;">
							<el-tooltip placement="top" effect="light" style="padding: 10px; margin-left: 5px">
                <div slot="content">
                  <p>密码长度8~15位，必须包含大小写字母、数字和符号</p>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
              <!-- <el-button type="primary" style="margin-left: 16px;" @click="editPassword()">生成</el-button>
              <el-button type="primary" style="margin-left: 10px;" @click="copyPassword(dataForm.password)">复制</el-button> -->
            </el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="确认密码" prop="orderPassword" v-if="orderPasswords==true">
					<el-input class="inputItem" placeholder="确认密码" v-model="dataForm.orderPassword" auto-complete="off">
					</el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input class="inputItem" placeholder="邮箱" v-model="dataForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input class="inputItem" placeholder="手机" v-model="dataForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色" prop="userRoles">
					<el-select v-model="dataForm.userRoles" multiple placeholder="请选择" class="selectItem" filterable>
						<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="备注" prop="mark">
        	<el-input class="inputItem" placeholder="备注" v-model="dataForm.mark" auto-complete="off"
            maxlength="500" type="textarea"></el-input>
        </el-form-item>
			</el-form>
			<div slot="" class="footItem">
				<el-button :size="size" type="info" @click.native="dialogVisible = false">{{
          $t("action.cancel")
          }}</el-button>
				<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading" class="edit-button">
					{{ $t("action.submit") }}
				</el-button>
			</div>
		</el-dialog>

		<!--重置密码界面-->
		<el-dialog title="重置密码" width="466px" :visible.sync="editPwdVisible" :close-on-click-modal="false"
			:modal-append-to-body="false">
			<el-form :model="editPwdDataForm" label-width="80px" :rules="editPwdDataFormRules" ref="editPwdDataForm"
				:size="size" label-position="right" style="position: relative;left:16px">
				<el-form-item label="新密码" prop="password">
					<el-row>
            <el-col :span="18">
              <el-input v-model="editPwdDataForm.password" placeholder="新密码" auto-complete="off" >
              </el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips" style="display: flex; align-items: center;">
							<el-tooltip placement="top" effect="light" style="padding: 10px; margin-left: 5px">
                <div slot="content">
                  <p>密码长度8~15位，必须包含大小写字母、数字和符号</p>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
              <!-- <el-button type="primary" style="margin-left: 10px;" @click="changePassword()">生成</el-button>
              <el-button type="primary" style="margin-left: 10px;" @click="copyPassword(editPwdDataForm.password)">复制</el-button> -->
            </el-col>
          </el-row>
				</el-form-item>
				<el-form-item label="确认密码" prop="orderPassword">
					<el-row>
						<el-col :span="18">
							<el-input v-model="editPwdDataForm.orderPassword" placeholder="确认密码" auto-complete="off"></el-input>
						</el-col>
					</el-row>
					
				</el-form-item>
			</el-form>
			<div class="footItem">
				<el-button :size="size" @click.native="editPwdVisible = false" style="" type="info">
					{{$t('action.cancel')}}</el-button>
				<el-button :size="size" type="primary" @click.native="submitEditPasswordForm" :loading="submitLoading">
					{{$t('action.submit')}}</el-button>
			</div>
		</el-dialog>
	</div>
	<!-- </el-card> -->

</template>

<script>
	import PopupTreeInput from "@/components/PopupTreeInput";
	import KtTable from "@/views/Core/KtTable";
	import KtButton from "@/views/Core/KtButton";
	import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
	import Encrypt from '@/utils/encrypt.js'
  import { mapState } from 'vuex';
	import {
		format
	} from "@/utils/datetime";
	export default {
	  name: "path-sys-user",
		components: {
			PopupTreeInput,
			KtTable,
			KtButton,
			TableColumnFilterDialog,
		},
		data() {
			//自定义表单密码验证
			var validatePass1 = (rule, value, callback) => {
				var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,15}$/;

				if (value === "") {
					callback(new Error("请输入密码"));
				} else if (!reg.test(value)) {
					callback(new Error("密码长度8~15位，必须包含大小写字母、数字和符号"));
				} else {
					callback();
				}
			};

			var validatePass3 = (rule, value, callback) => {
				if (this.dataForm.orderPassword.toString() == this.dataForm.password.toString()) {
					callback();
				} else {
					callback(new Error("两次密码不相等"));
				}
			};
			var validatePass4 = (rule, value, callback) => {
				if (this.editPwdDataForm.orderPassword.toString() == this.editPwdDataForm.password.toString()) {
					callback();
				} else {
					callback(new Error("两次密码不相等"));
				}
			};
			return {
        openOperation: false, // 是否展开搜索栏
        showOpen: false, // 是否显示展开按钮
				orderPasswords: true,
				size: "mini",
				filters: {
					name: "",
				},
				columns: [],
				pageRequest: {
					pageNum: 1,
					pageSize: 100
				},
				loading: false,
				editPwdVisible: false,
				editPwdDataForm: {},
				submitLoading: false,
				customer: {},
				poolNumberList: [], // 所有号码并且除去用户表中的phone_number字段号码
				showBatchDelete: false,
				operation: false, // true:新增, false:编辑
				dialogVisible: false, // 新增编辑界面是否显示
				editLoading: false,
				editPwdDataFormRules: {
					password: [{
						required: true,
						validator: validatePass1,
						trigger: "blur"
					}, ],
					orderPassword: [{
						required: true,
						validator: validatePass4,
						trigger: "blur"
					}]
				},
				dataFormRules: {
					name: [{
						required: true,
						message: "请输入用户名",
						trigger: "blur"
					},{
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/,
            message: '请输入正确的用户名',
            trigger: 'blur'
          }],
					password: [{
							required: true,
							validator: validatePass1,
							trigger: "blur"
						},

					],
					orderPassword: [{
							required: true,
							validator: validatePass1,
							trigger: "blur"
						},
						{
							required: true,
							validator: validatePass3,
							trigger: "blur"
						}
					],
          email: [{
          	pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          	trigger: "blur",
          	message: "请输入正确的邮箱"
          }],
          mobile: [{
            required: true,
            trigger: 'blur',
            message: '请输入手机'
          },{
          	pattern:  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          	trigger: "blur",
          	message: "请输入正确的手机"
          }]
				},
				// 新增编辑界面数据
				dataForm: {
					id: null,
					name: "",
					password: "",
					email: "",
					mobile: "",
					status: 1,
					userRoles: [],
					orderPassword: "",
          mark: ""
				},
				roles: [],
        pagePath: [], //页面路径
			};
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
			copyPassword(password) {
				if (!password) {
					this.$message({
						message: "请先生成密码",
						type: "error"
					});
					return;
				}
				
				if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(password)
        .then(() => {
          this.$message({
            message: "复制成功",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: "复制失败",
            type: "error"
          });
        });
      } else {
        this.fallbackCopyText(password)
      }
			},
			generatePassword(length = 15) {
				const numbers = '0123456789';
				const lower = 'abcdefghijklmnopqrstuvwxyz';
				const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

				const allChars = numbers + lower + upper + symbols;

				let password = '';

				// 确保每类字符至少一个
				password += numbers[Math.floor(Math.random() * numbers.length)];
				password += lower[Math.floor(Math.random() * lower.length)];
				password += upper[Math.floor(Math.random() * upper.length)];
				password += symbols[Math.floor(Math.random() * symbols.length)];

				// 剩下的随机填充
				for (let i = 4; i < length; i++) {
					password += allChars[Math.floor(Math.random() * allChars.length)];
				}

				// 打乱顺序（Fisher-Yates 洗牌）
				password = password.split('').sort(() => 0.5 - Math.random()).join('');
				
				return password
				
			},
			changePassword() {
				this.$set(this.editPwdDataForm, 'password', this.generatePassword())
				
				this.$message({
					message: "密码生成成功",
					type: "success"
				});
			},
			editPassword() {
				this.$set(this.dataForm, 'password', this.generatePassword())
				
				this.$message({
					message: "密码生成成功",
					type: "success"
				});
			},
      formatStatus(row, col, val) {
        return val == 1? '不脱敏': '脱敏'
      },
			size_change(e) {
				this.pageRequest.pageSize = e
				this.pageRequest.pageNum = 1
				this.findPage()

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

			// 换页刷新
			refreshPageRequest: function(pageNum) {
				this.pageRequest.pageNum = pageNum
				this.findPage()
			},
			//打开重置密码对话框
			openEditPwdDialog(row) {
				this.editPwdDataForm = Object.assign({}, row);
				if (this.$refs["editPwdDataForm"]) {
					this.$refs["editPwdDataForm"].resetFields();
				}
				this.editPwdVisible = true
			},
			// 重置用户密码
			submitEditPasswordForm: function() {
				this.$refs.editPwdDataForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							let param = Object.assign({}, this.editPwdDataForm);
							param.password = Encrypt.encryptRSA(param.password)
              delete param.orderPassword;
							this.$api.user.resetPassword(param).then((res) => {
								if (res.code == 200) {
									this.$message({
										message: '操作成功',
										type: 'success'
									})
									this.editPwdVisible = false
								} else {
									this.$message({
										message: '操作失败, ' + res.msg,
										type: 'error'
									})
								}
							})
						})
					}

				});

			},
			findPage1() {
				this.pageRequest.pageNum = 1
				this.findPage()
			},
			// 获取分页数据
			findPage: function() {
        this.loading = true;
				this.pageRequest.columnFilters = {
					name: {
						name: "name",
						value: this.filters.name
					},
				};
        this.openOperation = false;
				this.$api.user
					.findPage(this.pageRequest)
					.then((res) => {
            this.loading = false;
						this.pageRequest = res.data;
						this.findUserRoles();
					})
			},
			// 加载用户角色信息
			findUserRoles: function() {
				this.$api.role.findAll().then((res) => {
					// 加载角色集合
					this.roles = res.data;
				});
			},
			// 批量删除
			handleDelete: function(data) {
				let deleteDate = []
				deleteDate.push(data)
				this.$confirm("确认删除选中记录吗？", "提示", {
					type: 'warning'
				}).then(() => {
					this.$api.user.batchDelete(deleteDate).then(res => {
						if (res.code == 200) {
							this.$message({
								message: "删除成功",
								type: "success"
							});
						} else {
							this.$message({
								message: "删除失败, " + res.msg,
								type: "error",
							});
						}
						this.findPage();
					});
				});

			},
      handlePrivacy(row) {
        this.$confirm(`确认${row.numberDesensitization == 1? '脱敏':'不脱敏'}吗？`, "提示", {
        	type: 'warning'
        }).then(() => {
          let data = {
            id: row.id,
            status: row.numberDesensitization == 1? 2:1,
          }
        	this.$api.user.numberDesensitization(data).then(res => {
        		if (res.code == 200) {
        			this.$message({
        				message: "操作成功",
        				type: "success"
        			});
        		} else {
        			this.$message({
        				message: res.msg,
        				type: "error",
        			});
        		}
        		this.findPage();
        	});
        }).catch((e)=>{console.log(e)});
      },
			// 显示新增界面
			handleAdd: function() {
				this.orderPasswords = true
				this.dialogVisible = true;
				this.operation = true;
				this.dataForm = {
					id: null,
					name: "",
					password: "",
					email: "",
					mobile: "",
					status: 1,
					userRoles: [],
          mark: ''
				};
        // this.dataForm.name = "NAN";
        // this.dataForm.password = "AN";
				if (this.$refs["dataForm"]) {
					this.$refs["dataForm"].resetFields();
				}
			},
			// 显示编辑界面
			handleEdit: function(row) {

				if (this.$refs["dataForm"]) {
					this.$refs["dataForm"].resetFields();
				}
				this.dialogVisible = true;
				this.orderPasswords = false
				this.operation = false;
				this.dataForm = Object.assign({}, row);
				this.dataForm.name = this.dataForm.name.split('@')[0]
				let userRoles = [];
				for (let i = 0, len = row.userRoles.length; i < len; i++) {
					userRoles.push(row.userRoles[i].roleId);
				}
				this.dataForm.userRoles = userRoles;
			},
			handleStatus(row) {
				this.$confirm(`确认${row.status == 1?'禁用':'启用'}吗？`, "提示", {
					type: 'warning'
				}).then(() => {
					this.$api.user.updateUserStatus({
						id: row.id,
						status: row.status == 1? 0:1,
					}).then(res => {
						if (res.code == 200) {
							this.$message({
								message: "操作成功",
								type: "success"
							});
						} else {
							this.$message({
								message: "操作失败, " + res.msg,
								type: "error",
							});
						}
						this.findPage();
					})
				})
			},
			// 编辑
			submitForm: function() {
				this.$refs.dataForm.validate((valid) => {
					if (valid) {
						this.$confirm("确认提交吗？", "提示", {}).then(() => {
							this.editLoading = true;
							let params = Object.assign({}, this.dataForm);
							let userRoles = [];
							for (let i = 0, len = params.userRoles.length; i < len; i++) {
								let userRole = {
									userId: params.id,
									roleId: params.userRoles[i],
								};
								userRoles.push(userRole);
							}
							params.userRoles = userRoles;
							// 如果是新增则密码加密
							if (this.operation) {
								params.password = Encrypt.encryptRSA(params.password);
                delete params.orderPassword;
                this.$api.user.save(params).then((res) => {
                	this.editLoading = false;
                	if (res.code == 200) {
                		this.$message({
                			message: "操作成功",
                			type: "success"
                		});
                		this.dialogVisible = false;
                		this.$refs["dataForm"].resetFields();
                	} else {
                		this.$message({
                			message: "操作失败, " + res.msg,
                			type: "error",
                		});
                	}
                	this.findPage(null);
                });
							} else {
                this.$api.user.edit(params).then((res) => {
                	this.editLoading = false;
                	if (res.code == 200) {
                		this.$message({
                			message: "操作成功",
                			type: "success"
                		});
                		this.dialogVisible = false;
                		this.$refs["dataForm"].resetFields();
                	} else {
                		this.$message({
                			message: "操作失败, " + res.msg,
                			type: "error",
                		});
                	}
                	this.findPage(null);
                });
              }
						});
					}
				});
			},


			// 获取部门列表
			findDeptTree: function() {
				this.$api.dept.findDeptTree().then((res) => {
					this.deptData = res.data;
				});
			},
			// 菜单树选中
			deptTreeCurrentChangeHandle(data, node) {
				this.dataForm.deptId = data.id;
				this.dataForm.deptName = data.name;
			},
			// 时间格式化
			dateFormat: function(row, column, cellValue, index) {
				return format(row[column.property]);
			},
			statusFormat: function(row, column, cellValue, index) {
				if (cellValue == 1) {
					return "正常";
				}
				if (cellValue == 0) {
					return "禁用";
				}
			},

		},
		mounted() {
			this.findPage()
		},
	};
</script>

<style scoped lang='scss'>
	/deep/ .el-form-item__error {
		padding-left: 4px;
	}

	.toolbarBox {
		background-color: #F0F2F5;
		box-shadow: 0px 10px 34px 30px rgba(37, 40, 47, 0.1);
	}
</style>
