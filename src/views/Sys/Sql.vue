<template>
  <div>
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          语句
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <header :style="{width: operationWidth + 'px'}">
      <el-form :size="size" id="operationForm" style="height: auto;"
        :class="{operationExpand: openOperation}" label-width="40px">
        <el-form-item class="input-item">
          <el-row class="rowItem" >
            <el-col :span='24'>
              <el-col :span="23" style="display: flex;">
                <span style="width: 60px;">
                  <span style="color: #F56C6C;">*</span>
                  语句
                </span>
                <el-input placeholder="语句" v-model="sql" type="textarea"
                  :rows="15" resize="none" clearable>
                </el-input>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" :size="size" @click="findPage" style="margin-left: 20px;">
                  查询
                </el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </header>

    <!--表格内容栏-->
    <template v-if="pageResult.type == 1">
      <el-table :data="pageResult.queryResult" stripe :size="size" height="420" v-loading="loading"
        :highlight-current-row="true" style="top: 332px;" :element-loading-text="$t('action.loading')">
        <el-table-column :formatter="item.formatter" v-for="(item, index) in tableList" :key="index" :prop="item.prop"
          header-align="center" align="center" :label="item.label" :show-overflow-tooltip="true"
          :min-width="getColumnWidth(item.prop, pageResult.queryResult)"
         >
        </el-table-column>
      </el-table>
      <div class="total-num" v-if="pageResult.queryResult.length > 0" id="total-num">
        共 {{pageResult.queryResult.length}} 条
      </div>
    </template>

    <template v-if="pageResult.type == 2">
      <div class="msg-box">
        查询结果：{{pageResult.msg}}
      </div>
    </template>


  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'path-online',
    data() {
      return {
        sql: null,
        openOperation: false, // 是否展开搜索栏
        size: "mini",
        loading: false,
        pageResult: {
          type: 0,
          queryResult: []
        },
        tableList: []
      }
    },
    computed:{
    	...mapState({
    	  collapse: state => state.app.collapse,
    	  operationWidth: state=> state.app.operationWidth
    	})
    },
    methods: {
      getColumnWidth(prop, records) {
        const minWidth = 80; // 最小宽度
        const padding = 10; // 列内边距

        const contentWidths = records.map((item) => {
          const value = item[prop] ? String(item[prop]) : "";
          const headValue = this.tableList.filter(res=> {
            return res['prop'] == prop
          })[0].label;
          const textWidth = this.getTextWidth(value) > this.getTextWidth(headValue)?this.getTextWidth(value):this.getTextWidth(headValue);
          return textWidth + padding;
        });

        const maxWidth = Math.max(...contentWidths);
        return Math.max(minWidth, maxWidth);
      },
      getTextWidth(text) {
        const span = document.createElement("span");
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.top = "-9999px";
        span.style.whiteSpace = "nowrap";
        span.style.fontSize = "12px";
        span.style.fontWeight = "bold";
        span.innerText = text;
        document.body.appendChild(span);
        const width = span.offsetWidth + 20;
        document.body.removeChild(span);
        return width;
      },
       // 表头部重新渲染
      renderHeader(h, { column, $index }) {
        // 新建一个 span
        let span = document.createElement('span');
        // 设置表头名称
        span.innerText = column.label;
        // 临时插入 document
        document.body.appendChild(span);
        // 重点：获取 span 最小宽度，设置当前列，注意这里加了 20，字段较多时还是有挤压，且渲染后的 div 内左右 padding 都是 10，所以 +20 。（可能还有边距/边框等值，需要根据实际情况加上）
        column.minWidth = span.getBoundingClientRect().width + 20;
        // 移除 document 中临时的 span
        document.body.removeChild(span);
        return h('span', column.label);
      },
      // 获取分页数据
      findPage: function() {
        if (!this.sql) {
          return this.$message({
             message: '请输入语句',
             type: 'error'
          })
        };

        this.loading = true;
        this.openOperation = false;
        let data = btoa(unescape(encodeURIComponent(this.sql)))
        this.$api.Common.onlineSqlExecute(data).then((res) => {
          if (res.code == 200) {
            this.pageResult = res.data;
            if (this.pageResult.type == 1) {
              if (this.pageResult.columns) {
                this.tableList = this.pageResult.columns.map(item=>{
                  return {
                    prop: item.field,
                    label: item.field,
                  }
                })
              }
            }
            this.loading = false;
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        });
      },
    },
    created() {
      // this.findPage()
    },
  }
</script>

<style scoped lang="scss">
  .msg-box {
    position: relative;
    top: 332px;
    background-color: #FFF;
    text-align: left;
    padding: 10px 8px;
    font-size: 12px;
  }
  /deep/.input-item {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .total-num {
    top: 332px;
    height: 30px;
    line-height: 30px;
    padding-right: 10px;
    text-align: right;
    font-size: 14px;
    position: relative;
  }
</style>
