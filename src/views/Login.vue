<template>
	<div class="loginBg">
		<div class="loginInputBg">
			<el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px"
				class=" itemInputCodeTextItem loginText demo-ruleForm login-container">
				<!-- 		<theme-picker style="float:right; opacity: 0; z-index:-10000" class="theme-picker" :default="themeColor"
					@onThemeChange="onThemeChange"></theme-picker> -->
				<div style="font-size:1.4vw;margin-bottom:1vw;display: flex; justify-content: center;">
					<span class="" style="font-weight:550;">欢迎使用</span>
				</div>
				<el-form-item prop="" class="" style="margin-bottom:0px;position: relative;top:10px;text-align: left;">
					<span style="font-size:1vw;color: #25282F;font-weight:550;">登录</span>
					<span style="font-size: 1vw;color: #00A2FF;font-weight:550; margin-left:3px">Login</span>
				</el-form-item>

				<div class="" style="display: flex; align-items: center;">
					<img src="../assets/img/usernameNew.png" alt="" class="leftIcon" style="width:1.4vw;height:1.4vw">
					<el-form-item prop="account" class="itemInput" style="margin-bottom:0px;flex: 1;">
						<div class="" style="border:1px solid #CCCCCC;display:flex;align-items:center;height:2vw;flex: 1;">

							<el-input type="text" @keyup.enter.native="doLogin" v-model="loginForm.account" auto-complete="off"
								placeholder="请输入账号" class="userName"></el-input>
						</div>
					</el-form-item>
				</div>
				<div class="" style="display: flex; align-items: center;">
					<img class="leftIcon" src="../assets/img/passwordNew.png" alt="" style="width:1.4vw;height:1.4vw">
					<el-form-item prop="password" class="itemInput" style="margin-bottom:0px;flex: 1;">
						<div class="" style="border:1px solid #CCCCCC;display:flex;align-items:center;height:2vw;flex: 1;">
							<el-input type="password" @keyup.enter.native="doLogin" v-model="loginForm.password" auto-complete="off"
								placeholder="请输入密码" class="passWord"></el-input>
						</div>
					</el-form-item>
				</div>

				<div class="codeIcon-box">
					<div class="input-box">
						<img src="../assets/img/codeIconNew.png" alt="" class="input-icon">
						<el-form-item prop="captcha" class="itemInput" style="margin-bottom: 0px;">
							<div style="border:1px solid #CCCCCC;display:flex;align-items:center;height:2vw;">
								<el-input type="text" v-model="loginForm.captcha" @keyup.enter.native="doLogin" auto-complete="off"
									placeholder="验证码, 单击图片刷新" class="userName"></el-input>
							</div>
						</el-form-item>
					</div>
					<img style="width: 100px; height:30px;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
				</div>

				<el-form-item style="width:100%;display: flex; justify-content: center;">
					<el-button class="submit-button" @click.native.prevent="login" :loading="loading">登 录</el-button>

				</el-form-item>

			</el-form>
		</div>
	</div>
</template>

<script>
import {
	mapState
} from 'vuex'
import Cookies from "js-cookie"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
import Encrypt from "@/utils/encrypt"
export default {
	name: 'Login',
	components: {
		ThemePicker,
		LangSelector
	},
	data() {
		return {
			loading: false,
			loginForm: {
				account: '',
				password: '',
				captcha: '',
				src: '',
			},
			fieldRules: {
				account: [{
					required: true,
					message: '请输入账号',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}],
				captcha: [{
					required: true,
					message: '请输入验证码',
					trigger: 'blur'
				}],

			},
			checked: true,
			userId: null,
			captcheTimer: null,
			showCode: false,
			countdown: 0
		}
	},
	methods: {
		doLogin() {
			this.login()
		},
		login() {
			this.$refs['loginForm'].validate((valid) => {
				if (valid) {
					this.loading = true
					let loginPassword = Encrypt.encryptRSA(this.loginForm.password);
					var userInfo = {
						account: Encrypt.encryptRSA(this.loginForm.account),
						password: loginPassword,
						captcha: this.loginForm.captcha,
					}
					if (!this.checkRequire(this.loginForm)) { //校验必填项
						this.loading = false
						return
					}
					this.$api.login.login(userInfo).then((res) => {
						if (res.code == 500) {
							this.refreshCaptcha();
						}

						if (res.msg != null) {
							this.$message({
								message: res.msg,
								type: 'error'
							})
						} else {
							Cookies.remove('centerAdminToken');
							Cookies.set('centerAdminToken', res.data.token) // 放置token到Cookie
							this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
							this.$api.user.findCurrentUser().then(res => {
								localStorage.setItem('centerUserInfo', JSON.stringify(res.data)) // 保存用户到本地会话
								this.$router.push('/')  // 登录成功，跳转到主页
							});
						}
						this.loading = false
					}).catch((res) => {
						this.$message({
							message: res.message,
							type: 'error'
						})
					});


				} else {
					return false;
				}
			});
		},
		refreshCaptcha: function () {
			this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
		},
		reset() {
			this.$refs.loginForm.resetFields()
		},
		// 切换主题
		onThemeChange: function (themeColor) {
			this.$store.commit('setThemeColor', themeColor)
		},
		// 校验必填项
		checkRequire: function (userInfo) {
			if (userInfo.account == "") {
				this.$message({
					message: "请输入账号",
					type: 'error'
				})
				return false;
			}
			if (userInfo.password == "") {
				this.$message({
					message: "请输入密码",
					type: 'error'
				})
				return false;
			}
			if (userInfo.captcha == "") {
				this.$message({
					message: "请输入验证码",
					type: 'error'
				})
				this.refreshCaptcha();
				return false;
			}
			return true;
		}
	},
	mounted() {
		this.refreshCaptcha();
		let ele = document.getElementById('1.99654.234');
		if (ele) {
			document.body.removeChild(ele);
		}
	},
	computed: {
		...mapState({
			themeColor: state => state.app.themeColor
		})
	}
}
</script>

<style lang="scss" scoped>
.loginBg {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-image: url(../assets/img/loginBgNew.png);
	background-size: 100% 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.loginInputBg {
	background-image: url(../assets/img/loginInputBgNew.png);
	position: absolute;
	background-size: 100% 100%;
	width: 58vw;
	height: 31vw;

}

.loginText {
	width: 20.5vw;
	height: 22vw;
	position: absolute;
	top: 3vw;
	// margin 17 auto;
	right: 4.5vw;
	background: none !important;
	border: none;
	box-shadow: none;

}

.userName>>>.el-input__inner {
	border: none;
	background: none;
	border-radius: 0px;
	;
}

.passWord>>>.el-input__inner {
	border: none;
	background: none;
	border-radius: 0px;
	;

}

.itemInput>>>.el-form-item__content {
	// border:1px solid #CCCCCC;
	display: flex;
	align-items: center;
	margin-top: 1vw;
	margin-bottom: 8px;
	height: 2vw;

}

.itemInput>>>.el-form-item {
	margin-bottom: 10px !important;
}

.itemInputCode>>>.el-form-item__content {
	display: flex;
	align-items: center;
	margin-top: 0.5vw;
	margin-bottom: 1vw;
	justify-content: space-between;
}

.itemInputCode>>>.el-input__inner {
	border: none;
	background: none;

	.itemInputCodeTextItem>>>.el-input__inner {

		// border-bottom:1px solid #999999 !important;
		&::placeholder {
			font-size: 11px;
		}

		&::-webkit-input-placeholder {
			/* WebKit browsers 适配谷歌 */
			font-size: 11px;
		}

		&:-moz-placeholder {
			/* Mozilla Firefox 4 to 18 适配火狐 */
			font-size: 11px;
		}

		&::-moz-placeholder {
			/* Mozilla Firefox 19+ 适配火狐 */
			font-size: 11px;
		}

		&:-ms-input-placeholder {
			/* Internet Explorer 10+  适配ie*/
			font-size: 11px;
		}

	}
}

//同理一些css也是
.itemInputCodeTextItem>>>.el-input__inner {
	&::placeholder {
		font-size: 11px;
	}

	&::-webkit-input-placeholder {
		/* WebKit browsers 适配谷歌 */
		font-size: 11px;
	}

	&:-moz-placeholder {
		/* Mozilla Firefox 4 to 18 适配火狐 */
		font-size: 11px;
	}

	&::-moz-placeholder {
		/* Mozilla Firefox 19+ 适配火狐 */
		font-size: 11px;
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10+  适配ie*/
		font-size: 11px;
	}
}

.leftIcon {
	margin-right: 10px;
	padding-top: 6px;
}

.leftIconBottom {
	padding: 0;
	position: relative;
	top: -5px;
}

/deep/.el-input__inner {
	font-weight: 500;
}


// 验证码盒子
.codeIcon-box {
	display: flex;
	align-items: center;
	column-gap: 10px;
}

// 输入盒子
.input-box {
	display: flex;
	align-items: center;
	flex: 1;
}

// 输入框图标
.input-icon {
	width: 1.4vw;
	height: 1.4vw;
	margin-right: 10px;
}

.submit-button {
	width: 20vw;
	margin-top: 2vw;
	background: linear-gradient(-90deg, #3498FF, #8DD9D6);
	color: white !important;
	border: none !important;
}

.auth-code {
	font-size: 12px;
	line-height: 2vw;
	height: 2vw;
	background-color: #00A2FF;
	color: #fff;
	margin-top: calc((1vw - 8px) / 2);
	text-align: center;
	word-wrap: break-word;
}

.pointer {
	cursor: pointer;
}
</style>
