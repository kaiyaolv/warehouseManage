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
      <el-form-item label="耗时">
        <el-input v-model="filters.consumeTime" placeholder=">=(毫秒)"></el-input>
      </el-form-item>
      <el-form-item label=" 服务器IP">
        <el-select
          v-model="filters.ipAndPort"
          placeholder="服务器IP"
          filterable
          clearable
          @clear="selectClear(filters, 'ipAndPort')"
        >
          <el-option label="全部" :value="null"></el-option>
          <el-option
            v-for="(item, index) in ipAndPortList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语句">
        <el-input v-model="filters.executeCommands" placeholder="语句"></el-input>
      </el-form-item>
      <el-form-item label="过滤">
        <el-input v-model="filters.excludeCommands" placeholder="过滤"></el-input>
      </el-form-item>
      <el-form-item label="执行时间" class="time_input">
          <el-date-picker
            v-model="filters.executionTime"
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
    </el-form>
    <div class="btnSearch">
      <kt-button icon="fa fa-search" :label="$t('action.search')" perms="slow:log:view" type="primary" @click="searchPage()"/>
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
export default {
	name: "path-sys-slowLog",
	components: {
		KtTable,
		KtButton
	},
	data() {
		return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
			size: 'mini',
			filters: {
				consumeTime: null,
        ipAndPort: null,
        executeCommands: null,
        excludeCommands: null,
        executionTime:  [
            format(
              new Date(new Date(new Date().toLocaleDateString()).getTime())
            ),
            format(
              new Date(
                new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 - 1
              )
            ),
          ], //添加日期
			},
			columns: [
				{prop:"logId", label:"logId", minWidth:80},
				{prop:"executionTime", label:"执行时间", minWidth:150},
				{prop:"consumeTime", label:"耗时(ms)", minWidth:80},
				{prop:"executeCommands", label:"语句", minWidth:500},
				{prop:"ipAndPort", label:"服务器IP", minWidth:200, formatter: this.ipAndPortFormat},
			],
       // renderHeaderDate: this.serverIdHeaderData
			pageRequest: {
        pageNum: 1,
        pageSize: 10
      },
      pageResult: {},
      showOperation:false,
      pagePath: [], //页面路径
      ipAndPortList: [],
      serverIpList: [
        '126.20:6432  ####中心主库',
        '126.11:8432  ####中心从库',
        '126.21:9021  ####中心从库',
        '126.22:6435  ####中心从库',
        '126.20:7432  ####中心-集约化库'
      ],
      dateBaseList: [
        {
          label: '中心主库',
          value: '172点21点126点20:6432'
        },
        {
          label: '中心从库',
          value: '172点21点126点11:8032'
        },
        {
          label: '中心从库(21:9021)',
          value: '172点21点126点21:9021'
        },
        {
          label: '中心从库(22:9022)',
          value: '172点21点126点22:9022'
        },
        {
          label: '中心从库(23:9023)',
          value: '172点21点126点23:9023'
        },
        {
          label: '中心-集约化库',
          value: '172点21点126点20:7032'
        }
      ]
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
    ipAndPortFormat(row) {
      let data = '';
      this.ipAndPortList.forEach(res=>{
        if (res.value == row.ipAndPort) {
          data = res.label.split('-')[0]
        }
      })
      return `${data}${row.ipAndPort}`
    },
    serverIdHeaderData(h, { column }) {
      return h('div', [
        h('span', column.label),
        h('el-tooltip',
          {
            props: {
              effect: 'light',
              placement: 'bottom',
            }
          },
          [
            h('div',
              {
                slot: 'content'
              },
              [
                this.serverIpList.map(res=>{
                  return h('p', res)
                })
              ]
            ),
            h('i', {
              class: 'el-icon-warning-outline',
              style: 'margin-left:5px;font-size:14px',
            })
          ]
        )
      ])
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
      if (width < 1458) {
        height =
          (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) -
          345;
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
        consumeTime: this.filters.consumeTime*1,
        ipAndPort: this.filters.ipAndPort,
        executeCommands: this.filters.executeCommands == '' ? null : this.filters.executeCommands,
        excludeCommands: this.filters.excludeCommands == '' ? null : this.filters.excludeCommands,
        executionTime: this.filters.executionTime,
      }
      this.openOperation = false;
			this.$api.log.slowLogFindPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
			}).then(data!=null?data.callback:'')
		},
		// 时间格式化
    dateFormat: function (row, column, cellValue, index){	return format(row[column.property])	},
    getDict() {
      this.$api.dict.findByType({type: 'redisList'}).then((res) => {
        this.ipAndPortList = res.data
      })
    }
	},
	mounted() {
    this.getDict()
	},
}
</script>

<style scoped>

</style>
