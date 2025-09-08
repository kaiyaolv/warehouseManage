<template>
  <div id="main-container" class="main-container" :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 标签页 -->
    <div class="tab-container">
      <el-tabs class="tabs" :class="$store.state.app.collapse?'position-collapse-left':'position-left'"
        v-model="mainTabsActiveName" :closable="true" type="card"
        @tab-click="selectedTabHandle" @tab-remove="removeTabHandle">
        <el-dropdown class="tabs-tools" :show-timeout="0" trigger="hover">
          <div style="font-size:20px;width:50px;"><i class="el-icon-arrow-down"></i></div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tab-pane v-for="item in mainTabs"
          :key="item.name" :label="item.title" :name="item.name" >
          <span slot="label"><i :class="item.icon"></i> {{item.title}} </span>
        </el-tab-pane >
      </el-tabs>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content">
      <keep-alive>
        <transition name="fade" mode="out-in"  @after-enter="afterRouterChange">
          <keep-alive :include="keepAliveArr">
            <router-view v-if = "refreshControl" ref="child"></router-view>
          </keep-alive>
        </transition>
      </keep-alive>
    </div>
    <!-- 弹出框修改密码 -->
    <el-dialog  title="修改密码" width="466px" :close-on-press-escape="false" :visible.sync="editPwdVisible" :show-close="false" :close-on-click-modal="false"
                :append-to-body="true">
      <el-form :model="param" label-width="80px" :rules="dataFormRules" ref="dataFormPassword" :size="size" label-position="right"
        style="text-align:left;position: relative;left:14px">
        <el-form-item label="原密码" prop="password">
          <el-row>
            <el-col :span="16">
              <el-input v-model="param.password" placeholder="原密码" type="password" auto-complete="off" ></el-input>
            </el-col>
            <el-col :span="1" class="icon-list__tips">
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-row>
            <el-col :span="16">
              <el-input v-model="param.newPassword" placeholder="新密码" auto-complete="off" 
                disabled></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips" style="display: flex; align-items: center;">
              <el-button type="primary" style="margin-left: 10px;" @click="generatePassword()">生成</el-button>
              <el-button type="primary" style="margin-left: 10px;" @click="copyPassword">复制</el-button>
              <!-- <el-tooltip placement="top" effect="light" style="padding: 10px; margin-left: 5px">
                <div slot="content">
                  <p>密码长度8~15位，必须包含大小写字母、数字和符号</p>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip> -->
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-row>
            <el-col :span="16">
              <el-input v-model="param.confirmPassword" placeholder="确认密码"  auto-complete="off" ></el-input>
            </el-col>
            <el-col :span="1" class="icon-list__tips">

            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="footItem">
        <!-- <el-button :size="size" type="primary" @click.native="editPwdVisible = false" >{{$t('action.cancel')}}</el-button> -->
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="submitLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Encrypt from "@/utils/encrypt"
import Cookies from "js-cookie";
export default {
  data () {
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
    return {
      refreshControl: true,
      editPwdVisible: false,
        param: {
          password: "",
          newPassword: "",
          confirmPassword: ""
        },
        dataFormRules: {
          password: [
            {
              required: true,
              message: "请输入原密码",
              trigger: "blur"
            }
          ],
          newPassword: [
            {
              required: true,
              message: "请输入新密码",
              trigger: "blur"
            },
            {
              required: true,
              validator: validatePass1,
              trigger: "blur"
            }
          ],
          confirmPassword: [
            {
              required: true,
              message: "请再次输入新密码",
              trigger: "blur"
            },
            {
              required: true,
              validator: validatePass1,
              trigger: "blur"
            }
          ]
        },
        size: "mini",
        submitLoading: false,
    }
  },
  computed: {
    mainTabs: {
      get () {
        let data = JSON.parse(JSON.stringify(this.$store.state.tab.mainTabs))
        let tip = false;
        try{
          if (this.$store.state.menu.navTree.length != 0) {
            this.$store.state.menu.navTree.forEach(res=>{
              if (res.name == '首页') {
                tip = true
              }
            })
            if (tip) {
              return this.$store.state.tab.mainTabs
            } else {
              return this.$store.state.tab.mainTabs.filter(item => item.name !== '首页')
            }
          };
          return this.$store.state.tab.mainTabs
        }catch(e){
          return this.$store.state.tab.mainTabs
          //TODO handle the exception
        }
      },
      set (val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.tab.mainTabsActiveName },
      set (val) { this.$store.commit('updateMainTabsActiveName', val) }
    },
    keepAliveArr: {
      get() {
        let arr = this.$store.state.tab.mainTabs;
        let obj = []
        arr.forEach((item) => {
          obj.push("path" + item.path.replace(/\//g,'-'))
        })
        return obj;
      },
    },
    cache: {
      get() {
        if (!this.$route.matched[1]) return;
        const instances = this.$route.matched[1].instances;
        return instances && instances.default && instances.default.$vnode ?
          instances.default.$vnode.parent.componentInstance.cache :
          {};
      },
      set(val) {
        this.$route.matched[1].instances.default.$vnode.parent.componentInstance.cache =
          val;
      },
    },
    cache_key: {
      get() {
        if (!this.$route.matched[1]) return;
        const instances = this.$route.matched[1].instances;
        return instances && instances.default && instances.default.$vnode ?
          instances.default.$vnode.parent.componentInstance.keys :
          [];
      },
      set(val) {
        this.$route.matched[1].instances.default.$vnode.parent.componentInstance.keys =
          val;
      },
    },
  },
  // created() {
  //   window.onbeforeunload = function (e) {
  //     e = e || window.event;
  //     if (e) {
  //       e.returnValue = '关闭提示';
  //     }
  //     return '关闭提示';
  //   };
  // },
  methods: {
    copyPassword() {
      if (!this.param.newPassword) {
        this.$message({
          message: "请先生成密码",
          type: "error"
        });
        return;
      }
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.param.newPassword)
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
        this.fallbackCopyText(this.param.newPassword)
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
      
      console.log(password)

      // 剩下的随机填充
      for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
      }

      // 打乱顺序（Fisher-Yates 洗牌）
      password = password.split('').sort(() => 0.5 - Math.random()).join('');
      
      console.log(password)
      
      this.$set(this.param, 'newPassword', password)
      
      this.$message({
        message: "密码生成成功",
        type: "success"
      });
      
    },

    // tabs, 选中tab
    selectedTabHandle (tab) {
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push(tab[0].path)
      }
    },
    // tabs, 删除tab
    removeTabHandle (tabName) {
      // if(tabName == '系统介绍') return
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          if (tabName === this.mainTabsActiveName) {
            this.$router.push(this.mainTabs[this.mainTabs.length - 1].path)
          }
        }
      } else {
        this.$router.push("/")
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle () {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.mainTabs = []
      this.$router.push("/")
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle () {
      // var tempTabName = this.mainTabsActiveName
      // this.removeTabHandle(tempTabName)
      // this.$nextTick(() => {
      //   this.$router.push({ name: tempTabName })
      // })
      let cache = this.cache;
      let keys = this.cache_key;
      let tab = this.$route.matched[1].instances.default.$vnode.key;
      if (cache[tab] != null) {
        delete cache[tab];
        keys.splice(keys.indexOf(tab), 1);
      }

      const name = this.$refs.child.$options.name
      this.keepAliveArr.splice(this.keepAliveArr.indexOf(name), 1)
      this.refreshControl = false
      this.$nextTick(() => {
        if(!this.keepAliveArr.includes(name)) {
          this.keepAliveArr.push(name)
        }
        this.refreshControl = true
      })
    },
    afterRouterChange () {
      const childName = this.$refs.child.$options.name
      if(!this.keepAliveArr.includes(childName)) {
        this.keepAliveArr.push(childName)
      }
    },
    //查询用户信息 却认这个字段是否为空 为空就弹出 lastUpdatePasswordTime
    findUserInfo() {
      this.$api.user.findCurrentUser().then(res => {
        if(res.data.lastUpdatePasswordTime == null){
          this.openEditPwdDialog()
        }
      });
    },
    //打开修改密码对话框
    openEditPwdDialog() {
        if (this.$refs["dataFormPassword"] !== undefined) {
          this.$refs["dataFormPassword"].resetFields();
        }
        this.editPwdVisible = true;
    },
    // 弹出验证框重新验证密码
    submitForm() {
      this.$refs.dataFormPassword.validate(valid => {
        if (valid) {
          let checkOldPassword = this.param.password;
          let checkNewPassword = this.param.newPassword;
          let checkConfirmPassword = this.param.confirmPassword;
          if (checkNewPassword != checkConfirmPassword) {
            this.$message({
              message: "修改失败：两次输入的密码不一致",
              type: "error"
            });
          } else {
            if (checkOldPassword == checkNewPassword) {
              this.$message({
                message: "修改失败：原密码不能与新密码相同",
                type: "error"
              });
            } else {
              // this.param.confirmPassword = "";
              this.param.password = Encrypt.encryptRSA(this.param.password);
              let encryptPassword = this.param.password;
              this.param.password = checkOldPassword;
              this.$confirm("确认提交吗？", "提示", {
                customClass: "mzindex"
              })
                .then(() => {
                  this.submitLoading = true;
                  var param = {
                    password:encryptPassword,
                    newPassword:Encrypt.encryptRSA(this.param.newPassword)
                  }
                  this.$api.user.updatePassword(param).then(res => {
                    this.submitLoading = false;
                    if (res.code == 200) {
                      this.param = {};
                      this.$message({
                        message: "密码修改成功,请重新登录",
                        type: "success"
                      });
                      this.logout();
                    } else {
                      this.param.newPassword = checkNewPassword;
                      this.param.password = checkOldPassword;
                      this.$message({
                        message: "修改失败, " + res.msg,
                        type: "error"
                      });
                    }
                  });
                })
                .catch(() => {

                });
            }
          }
        }
      });
    },
    logout() {
        this.$api.login
          .logout()
          .then(res => {
            localStorage.removeItem("user");
            this.deleteCookie("centerAdminToken");
            this.$router.push("/login");
            return
          })
          .catch(function(res) {});

      },
      // 删除cookie
    deleteCookie: function(name) {
        Cookies.remove(name);
      },
    debounce(callback, duration) {
    	let debounceTimer;
      return function (...args) {
        let ctx = this;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          callback.apply(ctx, args);
        }, duration);
      };
    },
  },
  mounted() {
    // this.findUserInfo()
    if (localStorage.getItem('centerUserInfo')) {
      let centerUserInfo = JSON.parse(localStorage.getItem('centerUserInfo'));
      if(centerUserInfo.lastUpdatePasswordTime == null){
        this.openEditPwdDialog()
      };
      if (new Date().getTime() - centerUserInfo.lastUpdatePasswordTime > 3 * 30 * 24 * 60 * 60 * 1000) {
        this.openEditPwdDialog()
      }
    }

    if (this.$route.path == '/onlineSql') {

    } else {
      this.mainTabs = this.mainTabs.filter(item => item.name === '首页')

      this.$router.push("/")
    }

    let width  =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    let sideWidth = this.collapse? 86: 221;
    this.$store.commit('operationWidth', window.innerWidth - sideWidth)
    window.onresize = this.debounce(() => {
      let width  =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      this.$store.commit('operationWidth', window.innerWidth - sideWidth)
    }, 50)

  }
}
</script>

<style scoped lang="scss">
.main-container {
  padding: 0 5px 0;
  position: absolute;
  top: 50px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  // background: rgba(56, 5, 114, 0.5);
  .tabs {
    position: fixed;
    top: 50px;
    right: 50px;
    padding-left: 0px;
    padding-right: 2px;
    z-index: 1020;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: rgb(255, 253, 255);
    border-color: rgba(200, 206, 206, 0.5);
    // border-left-width: 1px;
    // border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
 .tabs-tools {
    position: fixed;
    top: 50px;
    right: 0;
    z-index: 1020;
    height: 40px;
    // padding: 0 10px;
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
    border-color: rgba(200, 206, 206, 0.5);
    border-left-width: 1px;
    border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: rgba(255, 255, 255, 1);
  }
  .tabs-tools:hover {
    background: rgba(200, 206, 206, 1);
  }
  .main-content {
    position: absolute;
    top: 41px;
    left: 5px;
    right: 5px;
    bottom: 0;
    padding: 0 5px;
    overflow: auto;
    // background: rgba(209, 212, 212, 0.5);
  }
  .main-content::-webkit-scrollbar {
    width: 0px;
  }
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>
