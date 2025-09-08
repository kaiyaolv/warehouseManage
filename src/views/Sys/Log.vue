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
      <el-form-item label="用户名">
        <el-input v-model="filters.name" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" class="time_input">
          <el-date-picker
            v-model="filters.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
      </el-form-item>
      <el-form-item label="方法路径">
        <el-input v-model="filters.method" placeholder="方法路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="方法名">
        <el-select
          v-model="filters.methodName"
          placeholder="方法名"
          filterable
          @change="methodNameChange"
          @clear="selectClear(filters, 'methodName')" clearable
        >
          <el-option :value="null" label="全部"></el-option>
          <el-option
            v-for="(item, index) in functionNameList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作结果">
        <el-select
          v-model="filters.result"
          placeholder="操作结果"
          filterable
          @clear="selectClear(filters, 'result')" clearable
        >
          <el-option :value="null" label="全部"></el-option>
          <el-option :value="1" label="成功"></el-option>
          <el-option :value="2" label="异常"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="IP">
        <el-input v-model="filters.ip" placeholder="IP"></el-input>
      </el-form-item>
      <el-form-item label="耗时">
        <el-input v-model="filters.time" placeholder=">=(毫秒)"></el-input>
      </el-form-item>
      <el-form-item label="创建人">
        <el-select
          v-model="filters.userType"
          placeholder="创建人"
          filterable
          @clear="selectClear(filters, 'userType')" clearable
        >
          <el-option :value="null" label="全部"></el-option>
          <el-option :value="1" label="系统用户"></el-option>
          <el-option :value="2" label="操作用户"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="filters.type"
          placeholder="类型"
          filterable
          @clear="selectClear(filters, 'type')" clearable
        >
          <el-option :value="null" label="全部"></el-option>
          <el-option :value="1" label="登录"></el-option>
          <el-option :value="2" label="操作"></el-option>
        </el-select>
      </el-form-item>
		</el-form>
    <div class="btnSearch">
      <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:log:view" type="primary" @click="searchPage()"/>
      <div class="expandButton"  v-if="showOpen" >
      	<span @click="openOperation=!openOperation">
      		{{openOperation?'收起': '展开'}}
      		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
      	</span>
      </div>
    </div>
	</header>
	<!--表格内容栏-->
	<kt-table :height="getTableHeight()" ref="tableItem" :isPageTable="true"
    :data="pageResult" @size_change="size_change" :columns="columns" :showOperation="showOperation" @findPage="findPage">
	</kt-table>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import { mapState } from 'vuex';
import {functionNameList} from "@/utils/functionNameData.js"
export default {
	name: "path-sys-log",
	components: {
		KtTable,
		KtButton
	},
	data() {
		return {
      functionNameList: functionNameList,
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
			size: 'mini',
			filters: {
        ip: null,
        result: null,
				name: '',
        method: null,
        time: 500,
        methodName: null,
        userType: 2,
        type: null,
        date:  [
          format(new Date(new Date().setMinutes(0)).setSeconds(0) - 60 * 60 * 1000),
          format(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1),
        ], //添加日期
			},
			columns: [
				// {prop:"id", label:"ID", minWidth:60},
				{prop:"userName", label:"用户名", minWidth:100, formatter: this.formateUser},
				// {prop:"operation", label:"操作", minWidth:120},
				{prop:"method", label:"方法路径", minWidth:180},
        {prop:"", label:"方法名", minWidth:180, formatter: this.formateMethod},
				{prop:"params", label:"参数", minWidth:220},
				{prop:"ip", label:"IP", minWidth:120},
				{prop:"time", label:"耗时", minWidth:80},
        {prop:"result", label:"操作结果", minWidth:80, formatter: this.formateResult},
        {prop:"message", label:"异常日志", minWidth:100},
				{prop:"createBy", label:"创建人", minWidth:100, formatter: this.formateCreateBy},
				{prop:"createTime", label:"创建时间", minWidth:140, formatter:this.dateFormat}
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			],
			pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      showOperation:false,
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
    formateResult(row, col, val) {
      return val == 1? '成功': val == 2? '异常': null;
    },
    formateUser(row, col, val) {
      let reg = /\s+$/;
      if (reg.test(val)) {
        return '运维监控'
      } else {
        return val
      }
    },
    formateCreateBy(row, col, val) {
      let reg = /\s+$/;
      if ( reg.test(val) || val == 'system' || val == '运维监控') {
        return '系统用户'
      } else {
        return '操作用户'
      }
    },
    formateMethod(row, col) {
      let data;
      functionNameList.forEach(res=>{
        if (res.value == row.method) {
          data = res.label
        }
      })
      return data
    },
    methodNameChange(e) {
      this.$set(this.filters, 'method', e)
    },
    findPage1(){

      this.pageRequest.pageNum = 1
      let obj = {
        pageRequest:this.pageRequest
      }
      this.findPage(obj)
    },
    size_change(e){
      this.pageRequest.pageSize = e.pageRequest.pageSize
      this.pageRequest.pageNum = 1
      let obj = {
        pageRequest:this.pageRequest
      }
      this.findPage(obj)
    },
    searchPage() {
      this.$refs.tableItem.refreshPageRequest(1);
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
			this.pageRequest.param = {
        userName: this.filters.name,
        createTime: this.filters.date,
        method: this.filters.method,
        time: this.filters.time*1,
        ip: this.filters.ip,
        result: this.filters.result,
        userType: this.filters.userType,
        type: this.filters.type
      }
      this.openOperation = false;
			this.$api.log.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){	return format(row[column.property])	}
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>
