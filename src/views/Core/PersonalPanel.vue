<template>
  <div class="personal-panel">
    <div class="personal-desc" :style="{'background':'rgb(175,17,30)'}">
      <div class="name-role">
        <span class="sender">{{ user.name }} - {{ roles }}</span>
      </div>
    </div>
    <div class="main-operation">
      <span class="main-operation-item">
        <el-button size="small" type="danger" icon="fa fa-male" @click="openPersonaCenterlDialog"> 个人中心</el-button>
      </span>
      <span class="main-operation-item">
        <el-button size="small" type="primary" icon="fa fa-key" @click="openEditPwdDialog"> 修改密码</el-button>
      </span>
    </div>
    <div class="personal-footer" @click="handleLogout">
      <li class="fa fa-sign-out"></li>
      {{$t("common.logout")}}
    </div>

    <el-dialog  title="修改密码" width="466px" :visible.sync="editPwdVisible" :close-on-click-modal="false"
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
              <el-input v-model="param.newPassword" placeholder="新密码"  auto-complete="off" disabled></el-input>
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
        <el-button :size="size" type="primary" @click.native="editPwdVisible = false" >{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="submitLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="个人中心" width="466px" :visible.sync="editPersonaCenterVisible" v-if="editPersonaCenterVisible" :close-on-click-modal="false"
               :modal-append-to-body="false">
      <el-form :model="userInfo" label-width="80px"  ref="dataForm" :size="size" label-position="right" :rules="dataFormRules"
          style="text-align:left;position: relative;left:14px">
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="userInfo.name" placeholder="账号名称" :disabled="true"  auto-complete="off" class="inputItem"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email" placeholder="邮箱" auto-complete="off" class="inputItem"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userInfo.mobile" placeholder="手机" auto-complete="off" class="inputItem"></el-input>
        </el-form-item>
        <el-form-item label="显示" >
          <el-radio v-model="displayControl" label="whole" style="margin-left: 8px;">全显</el-radio>
          <el-radio v-model="displayControl" label="half">半显</el-radio>
        </el-form-item>
        <el-form-item label="角色" prop="name">
          <div class="inputItem" style="display: flex; row-gap: 10px; column-gap: 10px;flex-wrap: wrap;">
            <el-tag v-for="(item, index) in rolesList" :key="index">{{item}}</el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div class="footItem">
        <el-button :size="size" type="primary" @click.native="editPersonaCenterVisible = false" >{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="userInfoSubmitForm" :loading="submitLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Cookies from "js-cookie";
  import Encrypt from "@/utils/encrypt.js";
  export default {
    name: "PersonalPanel",
    props: {
      user: {
        type: Object,
        default: {
          name: "",
          avatar: "",
          role: "",
          registeInfo: ""
        }
      }
    },
    data() {
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
        roles: "",
        rolesList: [],
        editPwdVisible: false,
        editPersonaCenterVisible: false,
        submitLoading: false,
        param: {
          password: "",
          newPassword: "",
          confirmPassword: ""
        },
        userInfo: {
          mobile: "",
          email: ""
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
          ],
          email: [{
          	pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          	trigger: "blur",
          	message: "请输入正确的邮箱"
          }],
          mobile: [{
            required: true,
            trigger: 'blur',
            message: '请输入手机'
          },{
          	pattern:  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
          	trigger: "blur",
          	message: "请输入正确的手机"
          }]
        },
        publicKey: "",
        size: "mini"
      };
    },
    computed: {
      displayControl: {
        get () {
          return this.$store.state.app.displayControl
        },
        set (val) {
          this.$store.commit('setDisplayControl', val)
        }
      }
    },
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
      //查询角色
      findUserRoles() {
        this.$api.role.getUserRolesByUserId().then(res => {
          let arr = res.data.map(item=>item.name)
          this.rolesList = arr;
          this.roles = arr.join(',');
        });
      },
      //查询用户信息
      findUserInfo() {
        this.$api.user.findCurrentUser().then(res => {
          if (res.code == 200) {
            this.userInfo = res.data;
            console.log('this.userInfo',this.userInfo)
            this.userInfo.mobile = res.data.mobile
            this.userInfo.email = res.data.email
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
      //打开个人中心
      openPersonaCenterlDialog() {
        if (this.$refs["dataForm"] !== undefined) {
          this.$refs["dataForm"].resetFields();
        }
        this.editPersonaCenterVisible = true;
      },
      // 退出登录
      handleLogout: function() {
        this.$confirm("确认退出吗?", "提示", {
          type: "warning"
        })
          .then(() => {
            //退出登录
            this.logout();
          })
          .catch(() => {});
      },
      // 删除cookie
      deleteCookie: function(name) {
        Cookies.remove(name);
      },
      userInfoSubmitForm: function() {
        this.$refs.dataForm.validate((valid) => {
        	if (valid) {
            this.$api.user.updateUserInfo(this.userInfo).then(res => {
              if (res.code == 200) {
                this.$message.success("操作成功");
              } else {
                this.$message.error("操作失败");
              }
              this.editPersonaCenterVisible = false;
              this.findUserInfo();
            });
          } else {

          }
        })
      },
      submitForm: function() {
        this.$refs.dataFormPassword.validate(valid => {
          if (valid) {
            //    this.$confirm("确认提交吗？", "提示", {}).then(() => {
            //  });
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
                    // this.param.password = encryptPassword;
                    // this.param.newPassword = Encrypt.encryptRSA(
                    //   this.param.newPassword
                    // );
                    this.$api.user.updatePassword(param).then(res => {
                      this.submitLoading = false;
                      if (res.code == 200) {
                        this.param = {};
                        this.$message({
                          message: "密码修改成功,请重新登录",
                          type: "success"
                        });
                        this.logout();
                        // this.$confirm("Tip:密码修改成功,请重新登录!", "提示", {
                        //   type: "warning"
                        // })
                        //   .then(() => {
                        //     this.logout();
                        //   })
                        //   .catch(() => {
                        //     // this.logout();
                        //   });
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
      logout: function() {
        this.$api.login
          .logout()
          .then(res => {
            localStorage.clear();
            this.deleteCookie("centerAdminToken");
            this.$router.push("/login");
            return
          })
          .catch(function(res) {});
      }
    },
    created() {
      this.findUserRoles();
      this.findUserInfo()
    },
  };
</script>

<style scoped>
  .mzindex {
    z-index: 1000 !important;
  }
  .personal-panel {
    font-size: 14px;
    width: 280px;
    text-align: center;
    border-color: rgba(180, 190, 190, 0.2);
    border-width: 1px;
    border-style: solid;
    background: rgba(182, 172, 172, 0.1);
    margin: -14px;
  }
  .personal-desc {
    padding: 15px;
    color: #fff;
  }
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 90px;
  }
  .name-role {
    font-size: 16px;
    padding: 5px;
  }
  .personal-relation {
    font-size: 16px;
    padding: 12px;
    margin-right: 1px;
    background: rgba(200, 209, 204, 0.3);
  }
  .relation-item {
    padding: 12px;
  }
  .relation-item:hover {
    cursor: pointer;
    color: rgb(19, 138, 156);
  }
  .main-operation {
    padding: 8px;
    margin-right: 1px;
    /* background: rgba(175, 182, 179, 0.3); */
    border-color: rgba(201, 206, 206, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
  }
  .main-operation-item {
    margin: 15px;
  }
  .other-operation {
    padding: 15px;
    margin-right: 1px;
    text-align: left;
    border-color: rgba(180, 190, 190, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
  }
  .other-operation-item {
    padding: 12px;
  }
  .other-operation-item:hover {
    cursor: pointer;
    background: #9e94941e;
    color: rgb(19, 138, 156);
  }
  .personal-footer {
    margin-right: 1px;
    font-size: 14px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-color: rgba(180, 190, 190, 0.2);
    border-top-width: 1px;
    border-top-style: solid;
  }
  .personal-footer:hover {
    cursor: pointer;
    color: rgb(19, 138, 156);
    background: #b1a6a61e;
  }
</style>
