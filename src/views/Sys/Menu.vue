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
      <el-form-item label = "名称">
        <el-input v-model="filters.name" placeholder="名称"></el-input>
      </el-form-item>
		</el-form>
    <div class="btnSearch">
      <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:menu:view" type="primary" @click="findTreeData(null)"/>
      <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:menu:add" type="primary" @click="handleAdd"/>
      <div class="expandButton"  v-if="showOpen" >
      	<span @click="openOperation=!openOperation">
      		{{openOperation?'收起': '展开'}}
      		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
      	</span>
      </div>
    </div>
	</header>
	<!--表格树内容栏-->
    <el-table :data="tableTreeDdata" stripe size="mini" style="width: 100%;"
      row-key="id" v-loading="loading" class="page-table" :element-loading-text="$t('action.loading')">
      <el-table-column prop="" header-align="center" width="65" align="center" type="index" label="序号">
      </el-table-column>
      <!-- <el-table-column
        prop="id" header-align="center" align="center" width="120" label="ID">
      </el-table-column> -->
<!--      <table-tree-column
        prop="name" header-align="center" treeKey="id" width="150" label="名称">
      </table-tree-column> -->
      <el-table-column
        prop="name" header-align="center"  width="150" label="名称">
      </el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentName" header-align="center" align="center" width="120" label="上级菜单">
      </el-table-column>
      <el-table-column
        prop="url" header-align="center" align="center" width="150"
        :show-overflow-tooltip="true" label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="perms" header-align="center" align="center" width="150"
        :show-overflow-tooltip="true" label="授权标识">
      </el-table-column>
      <el-table-column
        prop="orderNum" header-align="center" align="center" label="排序">
      </el-table-column>
      <el-table-column
        prop="delFlag" header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.delFlag == 0" size="small" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.delFlag == 1" size="small" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <kt-button icon="fa fa-edit" type='success' :label="$t('action.edit')" perms="sys:menu:edit" @click="handleEdit(scope.row)"/>
          <kt-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys:menu:delete" type="danger" @click="handleDelete(scope.row)"/>
          <kt-button type='success' :label="scope.row.delFlag == 0 ? '禁用' : '启用'" perms="sys:menu:edit" @click="handleDelFlag(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" width="466px" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
        label-width="80px" :size="size" style="text-align:left;position: relative;left:14px">
        <el-form-item label="菜单类型" prop="type">
   <!--       <el-radio-group v-model="dataForm.type" v-if="dataForm.type">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index" v-show="dataForm.type==index">{{ type }}</el-radio>
          </el-radio-group> -->
        <el-radio-group v-model="dataForm.type" class="inputItem" >
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="menuTypeList[dataForm.type] + '名称'" class="inputItem"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input
              :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
              :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange" class="inputItem">
            </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
          <el-input v-model="dataForm.perms" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete" class="inputItem"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="19">
                <el-input v-model="dataForm.url" placeholder="菜单路由" class="inputItem"></el-input>
            </el-col>
            <el-col :span="1" class="icon-list__tips" style="position: relative;left:-7px">
                <el-tooltip placement="top" effect="light" style="padding: 10px;" class="inputItem">
                  <div slot="content">
                    <p>URL格式：</p>
                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" class="inputItem"></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="19">
              <!-- <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in dataForm.iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover> -->
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input  inputItem" ></el-input>
            </el-col >
			 <el-col :span="1">

              <fa-icon-tooltip />
			  </el-col>
            <!-- <el-col :span="2" class="icon-list__tips"> -->
            <!-- </el-col> -->
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="" class="footItem">
        <el-button :size="size" type="info"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()" :loading="editLoading" class="edit-button">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
import { mapState } from 'vuex';
export default {
	name: "path-sys-menu",
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
      size: "mini",
      loading: false,
      filters: {
        name: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      menuTypeList: ["目录", "菜单", "按钮"],
      dataForm: {
        id: null,
        type: 1,
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      },
      dataRule: {
        name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "name",
        children: "children"
      },
      pagePath: [], //页面路径
      editLoading: false
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
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.openOperation = false;
      this.$api.menu.findMenuTree().then(res => {
        this.tableTreeDdata = res.data;
        this.popupTreeData = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.dataForm = {
        id: null,
        type: 1,
        typeList: ["目录", "菜单", "按钮"],
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      };
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogVisible = true;
      Object.assign(this.dataForm, row);
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      }).then(() => {
        let params = this.getDeleteIds([], row);
        this.$api.menu.batchDelete(params).then(res => {
          this.findTreeData();
          this.$message({ message: "删除成功", type: "success" });
        });
      });
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.parentName = data.name;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 菜单启用禁用
    handleDelFlag(row) {
      this.$confirm(`确认${row.delFlag == 0 ? '禁用' : '启用'}该菜单吗？`, "提示", {
        type: "warning"
      }).then(() => {
        let params = {
          parentId: row.parentId,
          id: row.id,
          delFlag: row.delFlag == 0 ? 1 : 0
        }
        this.$api.menu.save(params).then(res => {
          if(res.code == 200) {
            setTimeout(() => {
              this.findTreeData();
            }, 1000);
            this.$message({ message: "操作成功", type: "success" });
          } else {
            this.$message({ message: "操作失败, " + res.msg, type: "error" });
          }
        })
      })
    },
    // 表单提交
    submitForm() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            this.$api.menu.save(params).then(res => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.$refs["dataForm"].resetFields();
                this.dialogVisible = false;
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
              this.findTreeData();
            });
          });
        }
      });
    }
  },
  mounted() {
    this.findTreeData();
  }
};
</script>

<style lang="scss" scoped>
	/deep/ .el-form-item__error{
		padding-left:4px;
		}
</style>
