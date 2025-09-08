<template>
  <!-- 新增 -->
  <el-dialog  :visible.sync="editDialogVisible" :close-on-click-modal="false"
    v-if="editDialogVisible"
    fullscreen
    :modal="false"
    class="dialog-fullscreen"
    :class=" collapse?'dialog-fullscreen-width-collapse':'dialog-fullscreen-width'"
  >
    <div class="pathBox">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in pagePath" :key="index">
        	<span v-if="index != pagePath.length - 1">{{item}}</span>
        	<span @click="editDialogVisible = false" class="last-page-tag" v-else>{{item}}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="isChild">号码明细</el-breadcrumb-item>
        <el-breadcrumb-item>权限配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main-box">
    	<i class="el-icon-close second-page-close" @click="editDialogVisible = false"></i>
      <el-form :model="formData" label-width="130px" :rules="dataFormRules" ref="dataForm" :size="size">
        <div class="second-title-box">
          <div class="second-title">客户资料</div>
        </div>
        <el-row class="rowItem">
          <el-col :span="12" class="">
          	<el-form-item label="语音呼入鉴权" prop="callinAuth">
          		<el-select v-model="formData.callinAuth" placeholder="语音呼入鉴权" class="selectItem"
          			@change="getCallinAuthStrategyId(...arguments,true)">
          			<el-option label="不生效" :value="0"></el-option>
          			<el-option label="黑名单策略" :value="1"></el-option>
          			<el-option label="白名单策略" :value="2"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12">
          	<el-form-item label="语音呼入鉴权策略" :required='this.isShowCallinAuthStrategyId' prop="callinAuthStrategyId">
          		<el-select v-model="formData.callinAuthStrategyId" placeholder="语音呼入鉴权策略" filterable
          			class="selectItem">
          			<el-option :label="item.strategyShortName" :value="item.id"
          				v-for="(item,index) in CallinAuthStrategyList" :key="index"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12" class="">
          	<el-form-item label="语音呼出鉴权" prop="calloutAuth">
          		<el-select v-model="formData.calloutAuth" placeholder="语音呼出鉴权" class="selectItem"
          			@change="getCalloutAuthStrategyId(...arguments,true)">
          			<el-option label="不生效" :value="0"></el-option>
          			<el-option label="黑名单策略" :value="1"></el-option>
          			<el-option label="白名单策略" :value="2"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12">
          	<el-form-item label="语音呼出鉴权策略" :required='this.isShowCalloutAuthStrategyId' prop="calloutAuthStrategyId">
          		<el-select v-model="formData.calloutAuthStrategyId" placeholder="语音呼出鉴权策略" filterable
          			class="selectItem">
          			<el-option :label="item.strategyShortName" :value="item.id"
          				v-for="(item,index) in CalloutAuthStrategyList" :key="index"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12" class="">
          	<el-form-item label="短信呼入鉴权" prop="smsinAuth">
          		<el-select v-model="formData.smsinAuth" placeholder="短信呼入鉴权" class="selectItem"
          			@change="getSmsinAuthStrategyId(...arguments,true)">
          			<el-option label="不生效" :value="0"></el-option>
          			<el-option label="黑名单策略" :value="1"></el-option>
          			<el-option label="白名单策略" :value="2"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12">
          	<el-form-item label="短信呼入鉴权策略" :required='this.isShowSmsinAuthStrategyId' prop="smsinAuthStrategyId">
          		<el-select v-model="formData.smsinAuthStrategyId" placeholder="短信呼入鉴权策略" class="selectItem" filterable>
          			<el-option :label="item.strategyShortName" :value="item.id"
          				v-for="(item,index) in smsinAuthStrategyList" :key="index"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12" class="">
          	<el-form-item label="短信呼出鉴权" prop="smsoutAuth">
          		<el-select v-model="formData.smsoutAuth" placeholder="短信呼出鉴权" class="selectItem"
          			@change="getSmsoutAuthStrategyId(...arguments,true)">
          			<el-option label="不生效" :value="0"></el-option>
          			<el-option label="黑名单策略" :value="1"></el-option>
          			<el-option label="白名单策略" :value="2"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
          <el-col :span="12">
          	<el-form-item label="短信呼出鉴权策略" :required='this.isShowSmsoutAuthStrategyId' prop="smsoutAuthStrategyId">
          		<el-select v-model="formData.smsoutAuthStrategyId" placeholder="短信呼出鉴权策略" filterable
          			class="selectItem">
          			<el-option :label="item.strategyShortName" :value="item.id"
          				v-for="(item,index) in smsoutAuthStrategyList" :key="index"></el-option>
          		</el-select>
          	</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footButtonItem">
      <el-button :size="size" @click.native="editDialogVisible = false" type="primary">{{
        $t("action.cancel")
      }}</el-button>
      <el-button :size="size" type="primary" @click.native="submitForm">{{
        $t("action.submit")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default{
    name: "auth",
    props: {
      pagePath: {
        type: Array,
        default: []
      },
      collapse: {
        type: Boolean,
        default: false
      },
    },
    data() {
      var checkCallinAuthStrategyId = (rule, value, callback) => {
        if (this.isShowCallinAuthStrategyId) {
          if (value == '' || value == null) {
            callback(new Error('请选择语音呼入鉴权策略'))
          } else {
            callback();
          }
        } else{
          this.$refs['dataForm'].clearValidate('callinAuthStrategyId');
          callback();
        }
      }
      var checkCalloutAuthStrategyId = (rule, value, callback) => {
        if (this.isShowCalloutAuthStrategyId) {
          if (value == '' || value == null) {
            callback(new Error('请选择语音呼出鉴权策略'))
          } else {
            callback();
          }
        } else{
          this.$refs['dataForm'].clearValidate('calloutAuthStrategyId');
          callback();
        }
      }
      var checkSmsinAuthStrategyId = (rule, value, callback) => {
        if (this.isShowSmsinAuthStrategyId) {
          if (value == '' || value == null) {
            callback(new Error('请选择短信呼入鉴权策略'))
          } else {
            callback();
          }
        } else{
          this.$refs['dataForm'].clearValidate('smsinAuthStrategyId');
          callback();
        }
      }
      var checkSmsoutAuthStrategyId = (rule, value, callback) => {
        if (this.isShowSmsoutAuthStrategyId) {
          if (value == '' || value == null) {
            callback(new Error('请选择短信呼出鉴权策略'))
          } else {
            callback();
          }
        } else{
          this.$refs['dataForm'].clearValidate('smsoutAuthStrategyId');
          callback();
        }
      }
      return {
        editLoading: false,
        formData: {
          "callinAuth": null, // 呼入鉴权  0不生效 1黑名单策略 2白名单策略,必填
          "callinAuthStrategyId": null, // 呼入鉴权策略id
          "calloutAuth": null, // 呼出鉴权  0不生效 1黑名单策略 2白名单策略,必填
          "calloutAuthStrategyId": null, // 呼出鉴权策略id
          "smsinAuth": null, // 短信呼入鉴权  0不生效 1黑名单策略 2白名单策略,必填
          "smsinAuthStrategyId": null, // 短信呼入鉴权策略id
          "smsoutAuth": null, // 短信呼出鉴权  0不生效 1黑名单策略 2白名单策略,必填
          "smsoutAuthStrategyId": null // 短信呼出鉴权策略id
        },
        dataFormRules: {
          callinAuth: [{
          	required: true,
          	message: "请选择语音呼入鉴权",
          	trigger: "change",
          }, ],
          // 请选择语音呼入鉴权策略
          callinAuthStrategyId: [{
            validator:  checkCallinAuthStrategyId,
          	trigger: "change",
          } ],
          calloutAuth: [{
          	required: true,
          	message: "请选择语音呼出鉴权",
          	trigger: "change",
          }, ],
          // 请选择语音呼出鉴权策略
          calloutAuthStrategyId: [{
          	validator:  checkCalloutAuthStrategyId,
          	trigger: "change",
          }, ],
          smsinAuth: [{
          	required: true,
          	message: "请选择短信呼入鉴权",
          	trigger: "change",
          }, ],
          smsinAuthStrategyId: [{
          	validator:  checkSmsinAuthStrategyId,
          	trigger: "change",
          }, ],
          smsoutAuth: [{
          	required: true,
          	message: "请选择短信呼出鉴权",
          	trigger: "change",
          }, ],
          smsoutAuthStrategyId: [{
          	validator:  checkSmsoutAuthStrategyId,
          	trigger: "change",
          }, ],
        },
        editDialogVisible: false,
        size: "mini",
        isShowCallinAuthStrategyId: false, // 语音呼入鉴权策略动态显示必填费必填
        isShowCalloutAuthStrategyId: false, // 语音呼出鉴权策略动态显示必填费必填
        isShowSmsinAuthStrategyId: false, // 短信呼入鉴权策略动态显示必填费必填
        isShowSmsoutAuthStrategyId: false, // 短信呼出鉴权策略动态显示必填费必填
        CallinAuthStrategyList: [],
        CalloutAuthStrategyList: [],
        smsinAuthStrategyList: [],
        smsoutAuthStrategyList: [],
        isChild: false
      }
    },
    methods: {
      submitForm() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            this.$api.CustomerFiles.authSave(this.formData).then(res=>{
              this.editLoading = false;
              if (res.code == 200) {
                this.$message({
                	message: "操作成功",
                	type: "success",
                });
                this.editDialogVisible = false;
              } else {
                this.$message({
                	message: res.msg,
                	type: "error",
                });
              }
            })
          }
        })
      },
      // 获取语音呼入鉴权策略
      getCallinAuthStrategyId(e, select) {
      	if (select) {
      		this.formData.callinAuthStrategyId = null
      	}
      	let paramsObj = {
      		"strategyShortName": null, // 策略简称
      		"strategyPurpose": 1, // 策略用途（  1语音     2短信）
      		"strategyType": e //  策略类型 （1 黑名单     2白名单  ）
      	}
      	this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
      		if (res.code == 200) {
      			this.CallinAuthStrategyList = res.data
            if(this.CallinAuthStrategyList.length == 0) {
             this.formData.callinAuthStrategyId = null
            }
      			if(this.isGetItemId){
      			this.AuthStrategylist.callin = this.getAuth('callin', this.detailData.callinAuthStrategyId)
      			}
      		} else {
      			this.$message({
      				message: res.msg,
      				type: 'erroe'
      			})
      		}
      	})
        this.isShowCallinAuthStrategyId = false
        this.$nextTick(() => {
            if(e != 0) {
            this.isShowCallinAuthStrategyId = true
            } else {
            this.$refs['dataForm'].clearValidate('callinAuthStrategyId');
            }
        })
      },
      //
      // 获取语音呼出鉴权策略
      getCalloutAuthStrategyId(e, select) {
      	if (select) {
      		this.formData.calloutAuthStrategyId = null
      	}
      	let paramsObj = {
      		"strategyShortName": null, // 策略简称
      		"strategyPurpose": 1, // 策略用途（  1语音     2短信）
      		"strategyType": e //  策略类型 （1 黑名单     2白名单  ）
      	}
      	this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
      		if (res.code == 200) {
      			this.CalloutAuthStrategyList = res.data
             if(this.CalloutAuthStrategyList.length == 0) {
             this.formData.calloutAuthStrategyId = null
            }
      				if(this.isGetItemId){

      			this.AuthStrategylist.callout = this.getAuth('callout', this.detailData
      				.calloutAuthStrategyId)
      				}
      		} else {
      			this.$message({
      				message: res.msg,
      				type: 'erroe'
      			})
      		}
      	})
        this.isShowCalloutAuthStrategyId = false
        this.$nextTick(() => {
            if(e != 0) {
            this.isShowCalloutAuthStrategyId = true
            } else {
            this.$refs['dataForm'].clearValidate('calloutAuthStrategyId');
            }
        })
      },
      // 获取短信呼入鉴权策略
      getSmsinAuthStrategyId(e, select) {
      	if (select) {
      		this.formData.smsinAuthStrategyId = null
      	}
      	let paramsObj = {
      		"strategyShortName": null, // 策略简称
      		"strategyPurpose": 2, // 策略用途（  1语音     2短信）
      		"strategyType": e //  策略类型 （1 黑名单     2白名单  ）
      	}
      	this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
      		if (res.code == 200) {
      			this.smsinAuthStrategyList = res.data
            if(this.smsinAuthStrategyList.length == 0) {
             this.formData.smsinAuthStrategyId = null
            }
      				if(this.isGetItemId){

      			this.AuthStrategylist.smsin = this.getAuth('smsin', this.detailData.smsinAuthStrategyId)
      				}
      		} else {
      			this.$message({
      				message: res.msg,
      				type: 'erroe'
      			})
      		}
      	})
        this.isShowSmsinAuthStrategyId = false
        this.$nextTick(() => {
            if(e != 0) {
            this.isShowSmsinAuthStrategyId = true
            } else {
            this.$refs['dataForm'].clearValidate('smsinAuthStrategyId');
            }
        })
      },
      //  获取短信呼出鉴权策略
      getSmsoutAuthStrategyId(e, select) {
      	if (select) {
      		this.formData.smsoutAuthStrategyId = null
      	}
      	let paramsObj = {
      		"strategyShortName": null, // 策略简称
      		"strategyPurpose": 2, // 策略用途（  1语音     2短信）
      		"strategyType": e //  策略类型 （1 黑名单     2白名单  ）
      	}
      	this.$api.InteractionMode.getStrategyAuth(paramsObj).then(res => {
      		if (res.code == 200) {
      			this.smsoutAuthStrategyList = res.data
            if(this.smsoutAuthStrategyList.length == 0) {
             this.formData.smsoutAuthStrategyId = null
            }
      				if(this.isGetItemId){

      			this.AuthStrategylist.smsout = this.getAuth('smsout', this.detailData.smsoutAuthStrategyId)
      				}
      		} else {
      			this.$message({
      				message: res.msg,
      				type: 'erroe'
      			})
      		}
      	})
        this.isShowSmsoutAuthStrategyId = false
        this.$nextTick(() => {
            if(e != 0) {
            this.isShowSmsoutAuthStrategyId = true
            } else {
            this.$refs['dataForm'].clearValidate('smsoutAuthStrategyId');
            }
        })
      },
      parentHandleNumber(row, customerId) {
        this.formData = {"customerId": customerId,
                          "numberId": row.numberId,
                          "telX": row.telX,
                          "callinAuth": null,
                          "callinAuthStrategyId": null,
                          "calloutAuth": null,
                          "calloutAuthStrategyId": null,
                          "smsinAuth": null,
                          "smsinAuthStrategyId": null,
                          "smsoutAuth": null,
                          "smsoutAuthStrategyId": null, }
        this.editDialogVisible = true;
        this.isChild = true;
        let data = {
          "numberId": row.numberId,
          "customerId": customerId,
        };
        this.$api.CustomerFiles.findByCustomerIdNumberId(data).then(res=>{
          if (res.code == 200) {
            this.formData = res.data || this.formData;
            this.getAuthList()
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        });
      },
      parentHandle(row) {
        this.editDialogVisible = true;
        this.isChild = false;
        this.formData = {"customerId": row.id,
                          "callinAuth": null,
                          "callinAuthStrategyId": null,
                          "calloutAuth": null,
                          "calloutAuthStrategyId": null,
                          "smsinAuth": null,
                          "smsinAuthStrategyId": null,
                          "smsoutAuth": null,
                          "smsoutAuthStrategyId": null, }
        let data = {
          "customerId": row.id,
        };
        this.$api.CustomerFiles.findByCustomerIdNumberId(data).then(res=>{
          if (res.code == 200) {
            this.formData = res.data || this.formData
            this.getAuthList();
          } else {
            this.$message({
              type: "error",
              message: res.msg
            })
          }
        });
      },
      getAuthList() {
        this.isShowCallinAuthStrategyId = false; // 语音呼入鉴权策略动态显示必填费必填
        this.isShowCalloutAuthStrategyId = false; // 语音呼出鉴权策略动态显示必填费必填
        this.isShowSmsinAuthStrategyId = false; // 短信呼入鉴权策略动态显示必填费必填
        this.isShowSmsoutAuthStrategyId = false; // 短信呼出鉴权策略动态显示必填费必填
        if (this.formData.callinAuth) {
          this.getCallinAuthStrategyId(this.formData.callinAuth,false)
        };
        if (this.formData.calloutAuth) {
          this.getCalloutAuthStrategyId(this.formData.calloutAuth, false)
        };
        if (this.formData.smsinAuth) {
          this.getSmsinAuthStrategyId(this.formData.smsinAuth, false)
        };
        if (this.formData.smsoutAuth) {
          this.getSmsoutAuthStrategyId(this.formData.smsoutAuth, false)
        };
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rowItem {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 calc((100% - 420px * 2 - 100px) / 2);
  }
</style>
