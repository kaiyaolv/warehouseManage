<template>
  <div>
    <el-dialog
      :visible.sync="viewDialogVisible"
      v-if="viewDialogVisible"
      :close-on-click-modal="false" :modal = 'false' fullscreen
      class="dialog-fullscreen"
      :class=" collapse?'dialog-fullscreen-width-collapse':'dialog-fullscreen-width'"
    >
      <div class="pathBox">
      	<el-breadcrumb separator-class="el-icon-arrow-right">
      		<el-breadcrumb-item>业务管理</el-breadcrumb-item>
      		<el-breadcrumb-item>
      			<span @click="viewDialogVisible = false" class="last-page-tag">
      				拨测记录
      			</span>
      		</el-breadcrumb-item>
      		<el-breadcrumb-item>拨测轮次详情</el-breadcrumb-item>
      	</el-breadcrumb>
      </div>
      <!-- 表格 -->
      <el-table stripe :highlight-current-row="true" :element-loading-text="$t('action.loading')" v-loading="loading"
        :data="pageResult" size="mini" rowKey="id" :height="getHeightResult()" ref="tableData">
        <el-table-column prop="" header-align="center" width="60" align="center" label="序号">
          <template slot-scope="scope">
            <span>{{
                scope.$index +1
              }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in filterColumns" :key="index" :prop="item.prop" :formatter="item.formatter"
          header-align="center" align="center" :label="item.label" :show-overflow-tooltip="true"
          :min-width="item.minWidth">

        </el-table-column>
      </el-table>

      <el-row>
      <div class="bottom-bar" style="justify-content: flex-end;">
        <el-button
          :size="size"
          @click.native="viewDialogVisible = false"
          type="primary"
        >
          我知道了</el-button
        >
        </div>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";

  export default {
    components: {
      KtButton,
    },
    props: {
      collapse: {
        type: Boolean,
        default: false
      },
      pagePath: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        viewDialogVisible: false,
        filterColumns: [
          {
            prop: "roundCount",
            label: "第几次",
            minWidth: 100,
          },
          {
            prop: "startTime",
            label: "拨测开始时间",
            minWidth: 100,
          },
          {
            prop: "endTime",
            label: "拨测结束时间",
            minWidth: 100,
          },
          {
            prop: "numberCount",
            label: "本轮拨测号码数量",
            minWidth: 100,
          },
          {
            prop: "warningCount",
            label: "本轮告警号码数量",
            minWidth: 100,
          },
        ],
        pageResult: [],
        loading: false,
        size: 'mini',
      }
    },
    methods: {
      parentHandle(id,supportNodeId) {
        this.viewDialogVisible = true;
        let data = {
          dialTaskId: id,
          supportNodeId: supportNodeId
        }
        this.findPage(data);
      },
      getHeightResult() {
        // 50为顶部栏 41为菜单栏 26为路由标签 98为操作栏 8 为 操作栏和列表距离 42为底部菜单
        let width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        let height;
        height =
          (window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight) - 50 - 41 - 37 - 42;
        return height;
      },
      findPage(data) {
        this.loading = true;
        this.$api.DialTaskRecord.listDialTaskItem(data).then((res) => {
          if (res.code == 200) {
            this.pageResult = res.data
            this.loading = false
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
      },
    }
  }


</script>

<style lang="scss" scoped>

</style>
