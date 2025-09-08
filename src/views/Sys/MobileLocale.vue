<template>
  <div class="page-content">
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <header :style="{ width: operationWidth + 'px' }">
      <el-form :inline="true" :model="pageRequest.param" :size="size" id="operationForm" label-width="60px"
        :class="{ operationExpand: openOperation }">
        <el-form-item label="号段">
          <el-input maxlength="20" class="inputTool" v-model="pageRequest.param.mobileNumber"
            placeholder="号段"></el-input>
        </el-form-item>
        <el-form-item label="号码地区">
          <el-input maxlength="20" class="inputTool" v-model="pageRequest.param.mobileArea"
            placeholder="号码地区"></el-input>
        </el-form-item>
        <el-form-item label="地区编码">
          <el-input maxlength="20" class="inputTool" v-model="pageRequest.param.areaCode" placeholder="地区编码"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-select v-model="pageRequest.param.provinceName" filterable placeholder="省份" @change="getPro"
            class="selectTool">
            <el-option :label="'全部'" :value="null"></el-option>
            <el-option :label="item.provinceName" :value="item.provinceName" v-for="(item, index) in provinceList"
              :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-select v-model="pageRequest.param.cityName" filterable placeholder="城市" class="selectTool">
            <el-option :label="'全部'" :value="null"></el-option>
            <el-option :label="item.name" :value="item.name" v-for="(item, index) in cityList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运营商">
          <el-select v-model="pageRequest.param.telco" placeholder="运营商" class="selectTool" filterable clearable
            @clear="selectClear(pageRequest.param, 'telco', null)">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="联通" value="联通"></el-option>
            <el-option label="移动" value="移动"></el-option>
            <el-option label="电信" value="电信"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" class="time_input">
          <el-date-picker v-model="pageRequest.param.createTime" type="datetimerange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button icon="fa fa-search" :label="$t('action.search')" type="primary" perms="base:mobileLocale:findPage"
          @click="refreshPageRequest(1)" />
        <kt-button icon="fa fa-plus" label="新增" type="primary" perms="base:mobileLocale:save" @click="addHandle" />
        <kt-button icon="fa fa-plus" label="导入" type="primary" perms="base:mobileLocale:mobileLocaleImport"
          @click="importFile" />
        <div class="expandButton" v-if="showOpen">
          <span @click="openOperation = !openOperation">
            {{ openOperation ? '收起' : '展开' }}
            <i class="el-icon-d-arrow-right" :class="{ 'el-icon-d-arrow-bottom': openOperation }"></i>
          </span>
        </div>
      </div>
    </header>
    <!--表格内容栏-->
    <el-table :data="pageResult.content" stripe :size="size" :height="getTableHeight()" v-loading="loading"
      :highlight-current-row="true" :element-loading-text="$t('action.loading')" class="page-table">
      <el-table-column header-align="center" width="65" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{
            (pageResult.pageNum - 1) * pageResult.pageSize + scope.$index + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="item.formatter" v-for="(item, index) in tableList" :key="index" :prop="item.prop"
        header-align="center" align="center" :label="item.label" :show-overflow-tooltip="true"
        :min-width="item.minWidth">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="200" :label="$t('action.operation')">
        <template slot-scope="scope">
          <kt-button label="编辑" perms="base:mobileLocale:save" :size="size" type="warning"
            @click="editClick(scope.row)" />
          <kt-button label="删除" perms="base:mobileLocale:delete" :size="size" type="warning"
            @click="deleteClick(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div class="bottom-bar page-bottom-bar">
      <el-pagination background @size-change="size_change" layout="total, prev,sizes, pager, next , jumper"
        @current-change="refreshPageRequest" :current-page="pageResult.pageNum" :page-size="pageResult.pageSize"
        :total="pageResult.totalSize" style="float: right" :page-sizes="[100, 500, 1000]">
      </el-pagination>
    </div>
    <!-- 新增 -->
    <el-dialog :visible.sync="editDialogVisible" :close-on-click-modal="false" v-if="editDialogVisible" fullscreen
      :modal="false" class="dialog-fullscreen"
      :class="collapse ? 'dialog-fullscreen-width-collapse' : 'dialog-fullscreen-width'">
      <div class="pathBox">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
            <span v-if="index != pagePath.length - 1">{{ item }}</span>
            <span @click="editDialogVisible = false" class="last-page-tag" v-else>{{ item }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ opa ? '新增' : '编辑' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-box">
        <i class="el-icon-close second-page-close" @click="editDialogVisible = false"></i>
        <el-form :model="formData" label-width="190px" :rules="dataFormRules" ref="dataForm" :size="size"
          style="position: relative; left: -12px;box-sizing: border-box;">
          <div class="second-title-box">
            <div class="second-title">基本信息</div>
          </div>
          <el-row class="rowItem">
            <el-col :span="12">
              <el-form-item label="号段" prop="mobileNumber">
                <el-input maxlength="7" placeholder="号段" v-model="formData.mobileNumber" class="inputItem"
                  :disabled="!opa"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="号码地区" prop="mobileArea">
                <el-input maxlength="15" placeholder="号码地区" v-model="formData.mobileArea" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="号码类型" prop="mobileType">
                <el-input maxlength="30" placeholder="号码类型" v-model="formData.mobileType" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区编码" prop="areaCode">
                <el-input maxlength="15" placeholder="地区编码" v-model="formData.areaCode" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮编" prop="postCode">
                <el-input maxlength="15" placeholder="邮编" v-model="formData.postCode" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运营商" prop="telco">
                <el-select v-model="formData.telco" placeholder="运营商" class="selectItem">
                  <el-option label="联通" value="联通"></el-option>
                  <el-option label="移动" value="移动"></el-option>
                  <el-option label="电信" value="电信"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份" prop="provinceName">
                <el-input maxlength="15" placeholder="省份" v-model="formData.provinceName" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份编码" prop="provinceCode">
                <el-input maxlength="5" placeholder="省份编码" v-model="formData.provinceCode" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="旧省份编码" prop="oldProvinceCode">
                <el-input maxlength="5" placeholder="旧省份编码" v-model="formData.oldProvinceCode"
                  class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市" prop="cityName">
                <el-input maxlength="15" placeholder="城市" v-model="formData.cityName" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="城市编码" prop="cityCode">
                <el-input maxlength="5" placeholder="城市编码" v-model="formData.cityCode" class="inputItem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="旧城市编码" prop="oldCityCode">
                <el-input maxlength="5" placeholder="旧城市编码" v-model="formData.oldCityCode" class="inputItem"></el-input>
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

    <el-dialog title="导入" width="526px" :visible.sync="importDialogVisible" :modal="true" v-if="importDialogVisible"
      :close-on-click-modal="false">
      <el-form :model="batchForm" label-width="110px" :rules="batchFormRules" ref="batchForm" :size="size"
        style="position:relative;left:10px">
        <el-col :span='24'>
          <el-col :span="12">
            <el-form-item label="号段导入" prop="filePath" ref="upload">
              <el-upload :headers="headers" :action="baseUrl + '/base/file/uploadFile'" :limit="1" accept=".xlsx"
                :on-success="handleAvatarSuccess" :on-remove="handleRemove" :on-change="changeFile"
                style="text-align: left" :size="size" :auto-upload="false" :on-exceed="onExceed" ref='uploadItem'>
                <img src="../../assets/img/upload.png" style="width: 50px; height: 50px" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <secret-tip type="upload"></secret-tip>
          </el-form-item>
        </el-col>
        <el-col :span='24' style="height:25px">
          <el-form-item label="数据模板" prop="phoneImport">
            <div id="" style="text-align:left">
              <span id="" class="modelDown" @click="modelDown">
                模板下载
              </span>
            </div>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="	footItem">
        <el-button type="info" :size="size" @click.native="importDialogVisible = false">{{
          $t("action.cancel")
        }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitImport" :loading='importLoading' class="test-style">
          {{ $t("action.submit") }}
        </el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import Cookies from "js-cookie";
import {
  format
} from "@/utils/datetime";
import {
  baseUrl
} from "global";
import KtButton from "@/views/Core/KtButton";
import { mapState } from 'vuex';
import province from '@/utils/province.js'

export default {
  name: 'path-sys-mobileLocale',
  components: {
    KtButton,
  },
  data() {
    return {
      importDialogVisible: false,
      importLoading: false,
      editLoading: false,
      opa: false,
      size: 'mini',
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
      baseUrl: "",
      headers: "",
      loading: false,
      editDialogVisible: false,
      pageRequest: {
        pageNum: 1,
        pageSize: 100,
        param: {
          mobileNumber: null,
          mobileArea: null,
          telco: null,
          cityCode: null,
          createTime: null,
          provinceName: null,
          cityName: null
        }
      },
      pageResult: {},
      formData: {
        mobileNumber: null,
        mobileArea: null,
        provinceName: null,
        mobileType: null,
        areaCode: null,
        postCode: null,
        provinceCode: null,
        telco: null,
        cityName: null,
        oldProvinceCode: null,
        cityCode: null,
        oldCityCode: null,
      },
      dataFormRules: {
        mobileNumber: [{
          required: true,
          message: '请输入号段',
          trigger: 'blur'
        }],
        mobileArea: [{
          required: true,
          message: '请输入号码地区',
          trigger: 'blur'
        }],
        provinceName: [{
          required: true,
          message: '请输入省份',
          trigger: 'blur'
        }],
        mobileType: [{
          required: true,
          message: '请输入号码类型',
          trigger: 'blur'
        }],
        areaCode: [{
          required: true,
          message: '请输入地区编码',
          trigger: 'blur'
        }],
        postCode: [{
          required: true,
          message: '请输入邮编',
          trigger: 'blur'
        }],
        provinceCode: [{
          required: true,
          message: '请输入省份编码',
          trigger: 'blur'
        }],
        telco: [{
          required: true,
          message: '请选择运营商',
          trigger: 'change'
        }],
        cityName: [{
          required: true,
          message: '请输入城市',
          trigger: 'blur'
        }],
        oldProvinceCode: [{
          required: true,
          message: '请输入旧省份编码',
          trigger: 'blur'
        }],
        cityCode: [{
          required: true,
          message: '请输入城市编码',
          trigger: 'blur'
        }],
        oldCityCode: [{
          required: true,
          message: '请输入旧城市编码',
          trigger: 'blur'
        }],
      },
      tableList: [
        {
          prop: 'mobileNumber',
          label: '号段',
          minWidth: 100
        },
        {
          prop: 'mobileArea',
          label: '号码地区',
          minWidth: 100
        },
        {
          prop: 'mobileType',
          label: '号码类型',
          minWidth: 120
        },
        {
          prop: 'areaCode',
          label: '地区编码',
          minWidth: 100
        },
        {
          prop: 'postCode',
          label: '邮编',
          minWidth: 100
        },
        {
          prop: 'telco',
          label: '运营商',
          minWidth: 100
        },
        {
          prop: 'provinceName',
          label: '省份',
          minWidth: 100
        },
        {
          prop: 'provinceCode',
          label: '省份编码',
          minWidth: 100
        },
        {
          prop: 'oldProvinceCode',
          label: '旧省份编码',
          minWidth: 100
        },
        {
          prop: 'cityName',
          label: '城市',
          minWidth: 100
        },
        {
          prop: 'cityCode',
          label: '城市编码',
          minWidth: 100
        },
        {
          prop: 'oldCityCode',
          label: '旧城市编码',
          minWidth: 100
        },
        {
          prop: 'createBy',
          label: '创建人',
          minWidth: 100
        },
        {
          prop: 'createTime',
          label: '创建时间',
          minWidth: 140
        },
        {
          prop: 'lastUpdateBy',
          label: '修改人',
          minWidth: 100
        },
        {
          prop: 'lastUpdateTime',
          label: '修改时间',
          minWidth: 140
        }
      ],
      pagePath: [], //页面路径
      batchForm: {
        filePath: null,
      },
      batchFormRules: {
        filePath: [
          {
            required: true,
            message: '请上传号段文件',
            trigger: 'change'
          }
        ]
      },
      provinceList: this.$provinceList,
      cityList: []
    }
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapState({
      collapse: state => state.app.collapse,
      operationWidth: state => state.app.operationWidth
    }),
  },
  // 监控data中的数据变化
  watch: {
    operationWidth() {
      this.$nextTick(() => {
        this.showOpen = this.lengthOverFlow('operationForm');
        console.log(this.showOpen)
      })
    }
  },
  activated() {
    this.$nextTick(() => {
      this.showOpen = this.lengthOverFlow('operationForm');
      this.pagePath = this.getCurrentPageLevel();
    })
  },
  created() {
    this.refreshPageRequest(1);
    this.baseUrl = baseUrl;
    this.headers = {
      token: Cookies.get('centerAdminToken'),
    };
  },
  methods: {
    // 省份确认获取城市列表
    getPro(e) {
      this.cityList = []
      this.pageRequest.param.cityName = null;
      if (e == null) {
        return;
      }
      this.cityList = province.filter(item => item.name == e)[0].city
    },
    // 模板下载
    modelDown() {
      let objdown = {
        label: "mobileLocal",
      };

      let fileName = `号码归属地${format(new Date())}.xlsx`;
      this.$api.NumberManagement.downModel(objdown).then((res) => {
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
    importFile() {
      this.importDialogVisible = true;
      this.batchForm = {
        filePath: ''
      }
    },
    //上传成功时
    handleAvatarSuccess(response, file, fileList) {
      if (response.code == 200) {
        let data = {
          filePath: response.msg
        }
        this.$api.MobileLocale.importFile(data).then(res => {
          this.importDialogVisible = false;
          this.importLoading = false;
          if (res.code == 200) {
            this.$message({
              message: '操作成功',
              type: "success",
            })
            this.refreshPageRequest(1)
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            })
          }
        })
      } else {
        this.$refs.uploadItem.clearFiles();
        this.batchForm.filePath = ''
        this.$message({
          message: response.msg,
          type: "error",
        });
      }
    },
    // 限制一个文件
    onExceed() {
      this.$message({
        message: '最多可上传一个文件',
        type: "error",
      });
    },
    // 移除
    handleRemove() {
      this.batchForm.filePath = ''
    },
    // 文件改变
    changeFile(file, fileList) {
      if (fileList.length == 0) {
        this.batchForm.filePath = ''
      } else {
        this.batchForm.filePath = file
      }
      this.$refs.upload.clearValidate()
    },
    submitImport() {
      this.$refs["batchForm"].validate((valid) => {
        if (valid) {
          this.importLoading = true;
          this.$refs.uploadItem.submit();
        }
      })
    },
    // 页码数量切换
    size_change(e) {
      this.pageRequest.pageNum = 1;
      this.pageRequest.pageSize = e;
      this.findPage();
    },
    // 页码切换
    refreshPageRequest(e) {
      this.pageRequest.pageNum = e;
      this.findPage();
    },
    formatRequest(obj) {
      Object.keys(obj).forEach(key => {
        obj[key] = obj[key] || null;
      });

      return obj
    },
    // 分页查询
    findPage(num) {
      this.loading = true;
      this.openOperation = false;
      let data = JSON.parse(JSON.stringify(this.pageRequest));
      data.param = this.formatRequest(data.param)
      this.$api.MobileLocale.findPage(data).then((res) => {
        if (res.code == 200) {
          this.pageResult = res.data;
          this.loading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    // 编辑
    editClick(row) {
      this.editDialogVisible = true;
      this.opa = false;
      this.formData = JSON.parse(JSON.stringify(row))
    },
    // 新增
    addHandle() {
      this.editDialogVisible = true;
      this.opa = true;
      this.formData = {
        mobileNumber: null,
        mobileArea: null,
        provinceName: null,
        mobileType: null,
        areaCode: null,
        postCode: null,
        provinceCode: null,
        telco: null,
        cityName: null,
        oldProvinceCode: null,
        cityCode: null,
        oldCityCode: null,
      };
    },
    // 提交
    submitForm() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            this.$api.MobileLocale.save(this.formData).then((res) => {
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.editDialogVisible = false;
                this.findPage();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          })
        };
      });
    },
    deleteClick(row) {
      let id = {
        id: row.id,
      };

      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning",
      }).then(() => {
        this.$api.MobileLocale.deleteItem(id).then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.refreshPageRequest(1);
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      });
    },
  }
}
</script>

<style scoped lang="scss">
.modelDown {
  color: rgb(101, 48, 150);
  border-bottom: 1px solid rgb(101, 48, 150);
  cursor: pointer;
}
</style>
