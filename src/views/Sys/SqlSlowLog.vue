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
        <el-form-item label="sql类型">
          <el-select
            v-model="filters.label"
            placeholder="sql类型"
            class="selectTool"
            @change="changePgSlowLogType"
          >
            <el-option
              v-for="(item, index) in pgSlowLogTypeList"
              :key="index"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库">
          <el-select
            v-model="filters.masterEnableStatus"
            placeholder="数据库"
            class="selectTool"
            @change="changeMasterEnableStatus"
          >
            <el-option label="主库" :value="1"></el-option>
            <el-option label="从库" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button icon="fa fa-search" :label="$t('action.search')" perms="pg:slow:log:list" type="primary"
        @click="findPage1()"/>
        <div class="expandButton"  v-if="showOpen" >
        	<span @click="openOperation=!openOperation">
        		{{openOperation?'收起': '展开'}}
        		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        	</span>
        </div>
      </div>
    </header>
    <!--表格内容栏-->
    <div class="tableBox page-table" :style="{'height': `${getTableHeight()}px`}" v-loading="loading">
      <div v-if="pageResult.length>0">
        <el-table
          :data="pageResult"
          stripe
          size="mini"
          :height="getTableHeight()"
          :highlight-current-row="true"
          :element-loading-text="$t('action.loading')"
        >
        <el-table-column prop="" header-align="center" width="75"  align="center" :show-overflow-tooltip="true" label="序号">
          <template slot-scope="scope">
            <span>{{
               scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <template v-for="(item, key) in pageResult[0]" >
          <el-table-column
            :key="key"
            :prop="key"
            :label="key"
            header-align="center"
            align="center"
          >
          </el-table-column>
        </template>
        </el-table>
      </div>
      <div class="noData" v-else>暂无数据</div>
    </div>
    <div class="total-num page-bottom-bar" v-if="pageResult.length > 0" id="total-num">
      共 {{pageResult.length}} 条
    </div>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import { format } from "@/utils/datetime"
import { mapState } from 'vuex';
export default {
	name: "path-sys-sqlSlowLog",
	components: {
		KtTable,
		KtButton
	},
	data() {
		return {
      openOperation: false, // 是否展开搜索栏
      showOpen: false, // 是否显示展开按钮
			size: 'mini',
      pgSlowLogTypeList:[],
      loading:false,
			filters: {
				type: 'pgSlowLogType',
        label:'',
        masterEnableStatus: 1,
			},
      pageResult:[],
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
    findPage1(){
      this.findPage()
    },
    changePgSlowLogType(e){
      this.filters.label = e;
      this.findPage()
    },
    changeMasterEnableStatus() {
      this.findPage()
    },
    // 获取分页数据
    findPage () {
      if(this.filters.label == ''){
        this.$message({
          message: '请选择sql类型',
          type: "error",
        });
      }else{
        let param = {
          type:this.filters.type,
          label:this.filters.label,
          masterEnableStatus: this.filters.masterEnableStatus
        }
        this.openOperation = false;
        this.loading = true;
        this.$api.log.findList(param).then((res) => {
        	this.pageResult = res.data;
          this.loading = false;
        })
      }
    },
    //字典查询
    getDict(type) {
      let data = {
        type: type,
      };
      this.$api.dict.findByType(data).then((res) => {
        if (type == "pgSlowLogType") {
          this.pgSlowLogTypeList = res.data;
        }
      });
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
	},
	mounted() {
    this.getDict("pgSlowLogType");
	}
}
</script>

<style scoped lang="scss">
  .topbar1{
    padding: 20px 0px 0px 0px;
    width: 100%;
    background-color: #FFFFFF;
    margin-bottom: 20px;
    border-left: 1px solid #d2d2d2 !important;
    border-right: 1px solid #d2d2d2 !important;
    border-top: 1px solid #d2d2d2 !important;
  }
  .tableBox{
    width: 100%;
    position: relative;
  }
  .tableBorder{
    border: 1px solid #d2d2d2;
    display: inline-block;
    float: left;
  }
  .tableItem{
    display: flex;
  }
  .tableRow:last-child{
     border-right:0px;
  }
  .tableRow{
      width: 120px;
      text-align: center;
      border-right: 1px solid #d2d2d2;
  }
  .noData{
  	position: absolute;
    left:50%;
    top: 50%;
    transform: translate(-50%,50%);
  }
  .total-num {
    height: 30px;
    line-height: 30px;
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    position: relative;
  }
</style>
