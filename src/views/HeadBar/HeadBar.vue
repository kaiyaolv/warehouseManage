<template>
  <div
    class="headbar"
    :style="{ background: 'rgb(175,17,30)' }"
    :class="
      $store.state.app.collapse ? 'position-collapse-left' : 'position-left'
    "
  >
    <!-- 导航收缩 -->
    <!-- <span class="hamburg">
      <el-menu class="el-menu-demo" :background-color="themeColor" text-color="#fff" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1" @click="onCollapse"><hamburger :isActive="collapse"></hamburger></el-menu-item>
      </el-menu>
    </span> -->
    <!-- 导航菜单 -->
    <!--    <span class="navbar">
      <el-menu :default-active="activeIndex" class="el-menu-demo"
               :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar()">
        <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>
               <el-menu-item index="2" @click="openWindow('https://www.baidu.com')">{{$t("common.projectRepo")}}</el-menu-item>
                <el-menu-item index="3" @click="openWindow('https://www.baidu.com')">{{$t("common.doc")}}</el-menu-item>
                <el-menu-item index="4" @click="openWindow('https://www.baidu.com')">{{$t("common.blog")}}</el-menu-item>
      </el-menu>
    </span> -->
    <div
      id=""
      class="mainTab navbar"
      :class="{ activeItem: currentIndex == index }"
      v-for="(item, index) in rowNav"
      :key="index"
      @click="getMenuItem(item, index)"
    >
      {{ item.name }}
    </div>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu
        class="el-menu-demo"
        background-color="rgb(175,17,30)"
        :text-color="themeColor"
        :active-text-color="themeColor"
        mode="horizontal"
      >
        <el-menu-item index="1" @click="numExceptionHandle"
          v-if="numException"
          class="function right-menu-item">
          <!-- 号码异常告警 -->
          <el-badge :is-dot="isShowDot"  style="line-height: 1;">
            <i class="el-icon-message-solid" style="color: #FFF;"></i>
          </el-badge>
        </el-menu-item>
        <el-menu-item index="2"  class="function">
          <search id="header-search" ref="search" class="right-menu-item"/>
        </el-menu-item>
        <el-menu-item index="3" class="function">
          <!-- 全屏 -->
          <screenfull id="screenfull" ref="screenfull" class="right-menu-item hover-effect"/>
        </el-menu-item>
        <el-menu-item index="4" @click="sysSettingHandle" v-if="sysSetting" class="function right-menu-item">
          <!-- 系统设置 -->
          <i class="el-icon-setting" style="color: #FFF;"></i>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-personal class="right-menu-item">
          <!-- 用户信息 -->
          <span class="user-info">{{ user.name }}</span>
          <el-popover
            ref="popover-personal"
            placement="bottom-end"
            trigger="click"
            :visible-arrow="false"
          >
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>

    <el-dialog title="系统设置" width="466px" :visible.sync="sysVisible" v-if="sysVisible" :close-on-click-modal="false"
      :modal-append-to-body="true" append-to-body class="sysDialog">
      <el-form  label-width="105px"  ref="dataFormLimitTime" size="mini"
        label-position="right" style="position: relative; left: 4px" >
        <el-form-item label="限制时长" v-if="hasPermission('base:limitTime:query')">
          <el-select v-model="limitTime" class="selectItem" placeholder="限制时长"
            :disabled="limitTimeAble">
            <el-option v-for="(item, index) in limitTimeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示"  v-if="hasPermission('base:numberDisplay:query')">
          <el-radio-group v-model="display"
            :disabled="displayControlAble">
            <el-radio :label="1" style="margin-left: 8px;">全显</el-radio>
            <el-radio :label="2">半显</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="高峰管控时间段" v-if="hasPermission('base:controlTimeLimit:query')">
          <div style="display: flex;flex-direction: column;row-gap: 10px;">
            <template v-for="(item, index) in controlTimeLimitList">
              <div v-if="index == 0" class="time-picker-box">
                <el-time-picker
                  class="time-picker"
                  v-model="controlTimeLimitList[index]"
                  is-range
                  :editable="false"
                  range-separator="至"
                  format = 'HH:mm'
                  value-format = 'HHmm'
                  :disabled="controlTimeLimitAble"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间">
                </el-time-picker>
                <el-button :size="size" type="primary" @click="addHandle">新增</el-button>
              </div>
              <div v-else class="time-picker-box">
                <el-time-picker
                  class="time-picker"
                  v-model="controlTimeLimitList[index]"
                  is-range
                  :editable="false"
                  @change="timePickChange"
                  range-separator="至"
                  format = 'HH:mm'
                  value-format = 'HHmm'
                  :disabled="controlTimeLimitAble"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-time-picker>
                <el-button :size="size" type="primary"  @click="deleteHandle(index, item)">删除</el-button>
              </div>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div  class="footItem">
        <el-button size="mini" type="info" @click.native="sysVisible = false">关闭</el-button>
        <el-button size="mini" @click.native="submitSetting" :loading="sysLoading">提交</el-button>
      </div>
    </el-dialog>

    
    <numException ref="numException" :supportNodeList="supportNodeList" />


  </div>
</template>

<script>
import { mapState } from "vuex";
import Hamburger from "@/components/Hamburger";
import ThemePicker from "@/components/ThemePicker";
import LangSelector from "@/components/LangSelector";
import Action from "@/components/Toolbar/Action";
import NoticePanel from "@/views/Core/NoticePanel";
import PersonalPanel from "@/views/Core/PersonalPanel";
import { mainNavMain } from 'global'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import store from '@/store'
import { format } from '@/utils/datetime'

import  { hasPermission } from '@/permission'
import numException from '@/components/NumException/numException.vue'

export default {
  components: {
    Hamburger,
    ThemePicker,
    LangSelector,
    Action,
    NoticePanel,
    PersonalPanel,
    Screenfull,
    Search,
    numException
  },
  data() {
    return {
      size: 'mini',
      limitTimeList: [
        {
          label: '30分钟',
          value: 30
        },
        {
          label: '60分钟',
          value: 60
        },
        {
          label: '90分钟',
          value: 90
        },
        {
          label: '120分钟',
          value: 120
        },
        {
          label: '150分钟',
          value: 150
        },
        {
          label: '180分钟',
          value: 180
        },
      ],
      limitTime: null,
      limitTimeAble: false,
      sysVisible: false,
      display: false,
      displayControlAble: false,

      currentIndex: 0,
      user: {
        name: "",
        avatar: "",
        role: "",
        registeInfo: "",
      },
      activeIndex: "1",
      langVisible: false,
      realNavTree: [],
      controlTimeLimitList: [],
      controlTimeLimitAble: false,
      isShowDot: false,
      sysLoading: false,
      supportNodeList: [],
    };
  },
  methods: {
    closeNumException() {
      this.detailShow = false
    },
    hasPermission(perm) {
      return hasPermission(perm)
    },
    submitSetting() {
      this.$confirm('确定提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = [];
        if (hasPermission('base:limitTime:query')) {
          this.limitTimeAble = true;
          let limitTime = this.limitTime;
          arr.push(this.$api.user.updateLimitTime({limitTime}))
        };
        if (hasPermission('base:numberDisplay:query')) {
          this.displayControlAble = true;
          let display = this.display;
          arr.push(this.$api.user.updateNumberDisplayStatus({display}))
        };
        if (hasPermission('base:controlTimeLimit:query')) {
          let data = this.controlTimeLimitList.filter(val=>val).map(item=>{
            return {
              controlTimeLimitStartTime: item[0],
              controlTimeLimitEndTime: item[1]
            }
          });
          this.controlTimeLimitAble = true
          arr.push(this.$api.user.updateControlTimeLimit(data))
        };
        this.sysLoading = true
        Promise.all(arr).then(res=>{
          this.sysLoading = false;
          if (res.some(item=>item.code == 200)) {
            this.limitTimeAble = false;
            this.displayControlAble = false;
            this.controlTimeLimitAble = false;
            this.sysVisible = false;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }
        })
      })
    },
    addHandle() {
      this.controlTimeLimitList.push(null)
    },
    deleteHandle(index, item) {
      this.controlTimeLimitList.splice(index, 1);
    },
    async sysSettingHandle() {
      this.sysVisible = true;
      if (hasPermission('base:limitTime:query')) {
        let res = await this.$api.user.quertLimitTime();
        if (res.code == 200) {
          this.limitTime = res.data || 30;
        }
      }
      if (hasPermission('base:numberDisplay:query')) {
        let res = await this.$api.user.quertNumberDisplayStatus();
        if (res.code == 200) {
          this.display = res.data || 1;
        }
      };
      if (hasPermission('base:controlTimeLimit:query')) {
        let res = await this.$api.user.quertControlTimeLimit();
        if (res.code == 200) {
          if (res.data) {
            this.controlTimeLimitList  = res.data.map(item=>{
              return [item.controlTimeLimitStartTime, item.controlTimeLimitEndTime]
            })
          } else {
            this.controlTimeLimitList  = [null]
          }
        }
      }
    },
    numExceptionHandle() {
      this.$refs.numException.numExceptionHandle()
    },
    getWeekTime() {
      const startTime = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0);
      const endTime = new Date(new Date().getTime()).setHours(23, 59, 59, 999);
      return [format(startTime), format(endTime)]
    },
    getMenuItem(item, index) {
      this.currentIndex = index;
      if (this.currentIndex == 0) {
        this.realNavTree =  this.navTree.filter(item => !mainNavMain.some(x => x.id == item.id))
      } else {
        this.realNavTree =  this.navTree.filter(item => item.id == this.rowNav[index].id)[0].children
      }
      this.$store.commit('setrealNavTree', this.realNavTree)
    },
    openWindow(url) {
      window.open(url);
    },
    selectNavBar(key, keyPath) {

    },
    // 折叠导航栏
    onCollapse: function () {
      this.$store.commit("onCollapse");
    },
    // 切换主题
    onThemeChange: function (themeColor) {
      this.$store.commit("setThemeColor", themeColor);
    },
    // 语言切换
    changeLanguage(lang) {
      lang === "" ? "zh_cn" : lang;
      this.$i18n.locale = lang;
      this.langVisible = false;
    },
    async getNumException() {
      if (hasPermission('base:numberAbnormal:findPage')) {
        const response = await this.$api.CustomerAppManage.findAllSupportNode({ all: true });
        this.supportNodeList = response.data;
        const data = {
          pageNum: 1,
          pageSize: 10,
          param: {
            "customerId": null,   // 客户id
            "telX": null,  // 号码
            "type": null, // 类型：1-回抢失败，2-停机
            "abnormalTime": this.getWeekTime(),  // 时间
            "gtAddr": null, // gt
            "gtType": null, // gt类型：0-隐私号平台，1-非隐私号平台
            "gtPlatform": null,  // gt归属平台
            "supportNodeId": 59  // 支撑节点
          }
        };
        this.$api.user.findAbnormalNumber(data).then(res=>{
          if (res.code == 200) {
            if (res.data.content.length > 0) {
              this.isShowDot = true;
            } else {
              this.isShowDot = false;
            }
          }
        })
      }
    }
  },
  mounted() {
    var user = localStorage.getItem("centerUserInfo");
    if (user) {
      this.user.name = JSON.parse(user).name;
    };
  },
  watch:{
    numException:{
      handler(val,oldVal) {
        if (val) {
          this.getNumException();
        }
      },
      immediate: true
    },
    $route: 'closeNumException'
  },
  computed: {
    ...mapState({
      themeColor: (state) => state.app.themeColor,
      collapse: (state) => state.app.collapse,
      navTree: state => state.menu.navTree,
      rowNav: state => state.menu.rowNav,
      sysSetting: state => state.menu.sysSetting,
      numException: state => state.menu.numException
    }),
  },
};
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 50px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}
.hamburg,
.navbar {
  float: left;
}
.toolbar {
  float: right;
}
.toolbar >>> .el-popover__reference {
  height: 50px;
  line-height: 50px;
}
.toolbar >>> .el-menu--horizontal {
  .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
  .is-active {
    border: none;
  }
}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
.mainTab {
  cursor: pointer;
  color: #ffffff;
  text-align: center;
  width: 100px;
  font-size: 14px;
  margin-left: 10px;
  line-height: 50px;
}
.activeItem {
  width: 100px;
  height: 30px;
  border-radius: 20px;
  font-size: 14px;
  background-color: rgba(225, 225, 225, 0.35);
  line-height: 30px;
  margin: auto;
  display: inline-block;
  margin-top: 10px;
  margin-left: 10px;
}
/deep/ .el-menu.el-menu--horizontal {
    border: none;
  }

  /deep/ .sysDialog {
    .el-dialog__header {
      line-height: normal;
    }
  }


  .right-menu-item {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #FFFFFF;
  }

  /deep/ .el-menu-item {
    background-color: rgb(175, 17, 30) !important;;
  }
  /deep/ .el-menu-item:hover {
    background-color: rgba(255, 255, 255, 0.2) !important;
  }
  /deep/ .function {
    background-color: rgb(175, 17, 30) !important;
    padding: 0;
    margin: 0 20px;
  }
  /deep/ .function:hover {
    background-color: rgb(175, 17, 30) !important;
  }

  .time-picker {
    width: 260px;
  }

  .time-picker-box {
    display: flex;
    column-gap: 10px;
    align-items: center;
  }

  .itemDetail {
    display: flex;
    /* align-items: center; */
    margin-bottom: 15px !important;
    align-items: baseline;
  }

  .leftDiv {
    width: 200px;
    text-align: right;
    /* margin-left:36px; */
    font-size: 14px;
  }

  .rightDiv {
    flex: 1;
    padding-left: 18px;
    display: flex;
    align-items: flex-end;
    font-size: 14px;
    /* margin-left:18px; */
    text-align: left;
    word-break: auto-phrase;
  }
  .num-title {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
  }
  .no-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
