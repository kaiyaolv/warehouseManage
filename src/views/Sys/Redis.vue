<template>
  <div>
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
          {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <header :style="{width: operationWidth + 'px'}">
      <el-form
        :inline="true"
        :model="pageRequest"
        :size="size"
        style="text-align: left"
        id="operationForm"
        :class="{operationExpand: openOperation}"
      >
        <el-form-item label="redis">
          <el-select
            v-model="pageRequest.label"
            placeholder="redis"
            class="selectTool"
            clearable
            @change="findPage"
            @clear="selectClear(pageRequest, 'label', null)"
          >
            <el-option
              v-for="(item, index) in redisList"
              :key="index"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btnSearch">
        <kt-button
          :label="$t('action.search')"
          perms="monitor:cache:list"
          type="primary"
          @click="findPage"
        />
        <div class="expandButton"  v-if="showOpen" >
        	<span @click="openOperation=!openOperation">
        		{{openOperation?'收起': '展开'}}
        		<i class="el-icon-d-arrow-right" :class="{'el-icon-d-arrow-bottom': openOperation}"></i>
        	</span>
        </div>
      </div>
    </header>

    <el-row v-if="cache" :gutter="20">
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header"><span><i class="el-icon-monitor"></i> 基本信息</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">Redis版本</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.redis_version }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">运行模式</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{
                      cache.info.redis_mode == "standalone" ? "单机" : "集群"
                    }}
                  </div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">端口</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.tcp_port }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">客户端数</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.connected_clients }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">运行时间(天)</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.uptime_in_days }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">使用内存</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.used_memory_human }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">使用CPU</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{
                      parseFloat(cache.info.used_cpu_user_children).toFixed(2)
                    }}
                  </div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">内存配置</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.maxmemory_human }}</div>
                </td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf">
                  <div class="cell">AOF是否开启</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">RDB是否成功</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{ cache.info.rdb_last_bgsave_status }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">Key数量</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.dbSize" class="cell">{{ cache.dbSize }}</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div class="cell">网络入口/出口</div>
                </td>
                <td class="el-table__cell is-leaf">
                  <div v-if="cache.info" class="cell">{{
                      cache.info.instantaneous_input_kbps
                    }}kps/{{ cache.info.instantaneous_output_kbps }}kps
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span><i class="el-icon-pie-chart"></i> 命令统计</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" id="commandstats" style="height: 420px"/>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span><i class="el-icon-odometer"></i> 内存信息</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" id="usedmemory" style="height: 420px"/>
          </div>
        </el-card>
      </el-col>

    </el-row>

  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  import { mapState } from 'vuex';

  export default {
    name: "path-sys-redis",
    components: { KtButton },
    data() {
      return {
        pagePath: [], //页面路径
        openOperation: false, // 是否展开搜索栏
        showOpen: false, // 是否显示展开按钮
        size: 'mini',
        loading: false,
        pageRequest: {
          label: "",
        },
        redisList: [],
        tableList: [
          {
            prop: 'redis_version',
            label: "Redis版本",
            minWidth: "120",
          },
          {
            prop: 'redis_mode',
            label: "运行模式",
            minWidth: "120",
            formatter: this.formatRedisMode
          },
          {
            prop: 'tcp_port',
            label: "端口",
            minWidth: "120",
          },
          {
            prop: 'connected_clients',
            label: "客户端数",
            minWidth: "120",
          },
          {
            prop: 'uptime_in_days',
            label: "运行时间(天)",
            minWidth: "120",
          },
          {
            prop: 'used_memory_human',
            label: "使用内存",
            minWidth: "120",
          },
          {
            prop: 'used_cpu_user_children',
            label: "使用CPU",
            minWidth: "120",
          },
          {
            prop: 'aof_enabled',
            label: "AOF是否开启",
            minWidth: "120",
          },
          {
            prop: 'rdb_last_bgsave_status',
            label: "RDB是否成功",
            minWidth: "120",
          },
          {
            prop: 'dbSize',
            label: "Key数量",
            minWidth: "120",
          },
          {
            prop: 'dbSize',
            label: "网络入口/出口",
            minWidth: "120",
            formatter: this.formatNet
          },
        ],
        cache: null,
        // 统计命令信息
        commandstats: null,
        // 使用内存
        usedmemory: null,

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
      formatNet(row) {
        return `${row.instantaneous_input_kbps}kps/${row.instantaneous_output_kbps}kps`
      },
      formatRedisMode(row) {
        return row['redis_mode'] == "standalone" ? "单机" : "集群"
      },
      // 获取分页数据
      findPage: function () {
        if (!this.pageRequest.label) {
          return this.$message({
            message: 'redis不能为空',
            type: 'error'
          })
        }

        this.loading = true;
        this.openOperation = false;
        this.$api.redis.getInfo(this.pageRequest).then((res) => {
          this.cache = res.data;
          this.loading = false;
          this.$nextTick(()=>{
            this.commandstats = this.$echarts.init(document.getElementById("commandstats"));
            this.commandstats.setOption({
              tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              series: [
                {
                  name: "命令",
                  type: "pie",
                  roseType: "radius",
                  radius: [15, 95],
                  center: ["50%", "38%"],
                  data: res.data.commandStats,
                  animationEasing: "cubicInOut",
                  animationDuration: 1000,
                }
              ]
            });
            this.usedmemory = this.$echarts.init(document.getElementById("usedmemory"));
            this.usedmemory.setOption({
              tooltip: {
                formatter: "{b} <br/>{a} : " + this.cache.info.used_memory_human,
              },
              series: [
                {
                  name: "峰值",
                  type: "gauge",
                  min: 0,
                  max: 1000,
                  detail: {
                    formatter: this.cache.info.used_memory_human,
                  },
                  data: [
                    {
                      value: parseFloat(this.cache.info.used_memory_human),
                      name: "内存消耗",
                    }
                  ]
                }
              ]
            });
            window.addEventListener("resize", () => {
              this.commandstats.resize();
              this.usedmemory.resize();
            });
          })
        });
      },
      getDict() {
        this.$api.dict.findByType({type: 'redisList'}).then((res) => {
          this.redisList = res.data
        })
      }
    },
    mounted() {
      this.getDict()
    }
  }

</script>

<style scoped lang="scss">
  .card-box {
    margin-bottom: 10px;
    top: 108px;
    position: relative;
  }
  /deep/ .el-card__header {
    text-align: left;
  }
</style>
