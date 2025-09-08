<template>
  <div>
    <el-dialog title="自动化配置" width="486px" :visible.sync="editDialogVisible" :modal="true" v-if="editDialogVisible"
      :close-on-click-modal="false" append-to-body>
    	<el-form :model="dataForm" label-width="110px" :rules="dataFormRules" ref="dataForm" :size="size"
    		style="position:relative;left:10px">
        <el-form-item label="平台客户简称" prop="customerId">
          <el-select v-model="dataForm.customerId" filterable clearable
            @change="customerChange"
            placeholder="平台客户简称" class="selectItem">
            <el-option v-for="item in customerSimpleName" :label="item.customerShortName"
              :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台小号模式" prop="customerAbilityId">
          <el-select v-model="dataForm.customerAbilityId" filterable clearable
            @change="abilityChange"
            placeholder="平台小号模式" class="selectItem">
            <el-option v-for="item in customerAbilityList" :label="item.platformAbilityMode"
              :value="item.customerAbilityId" :key="item.customerAbilityId" />
          </el-select>
        </el-form-item>

        <el-form-item label="平台商品简称" prop="commodityId">
          <el-select v-model="dataForm.commodityId" filterable clearable
            placeholder="平台商品简称" class="selectItem">
            <el-option v-for="(item, index) in commodityList" :label="item.commodityShortName" :value="item.id"
            :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支撑节点" prop="supportNodeId">
          <el-select filterable v-model="dataForm.supportNodeId" placeholder="支撑节点" class="selectItem">
            <el-option v-for="(item,index) in supportNodeList" :key="index" :label="item.nodeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

    	</el-form>
    	<div class="footItem">
    		<el-button type="info" :size="size" @click.native="editDialogVisible = false">{{
          $t("action.cancel")
        }}</el-button>
    		<el-button :size="size" type="primary" @click.native="submitForm">{{ $t("action.submit") }}</el-button>
    	</div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        size: 'mini',
        customerSimpleName: [],
        customerAbilityList: [],
        supportNodeList: [], //支撑节点
        commodityList: [],
        editDialogVisible: false,
        dataForm: {
          customerId: null, // 客户
          customerAbilityId: null, //小号
          commodityId: null,
          supportNodeId: null
        },
        dataFormRules: {
          customerId: [{
            required: true,
            trigger: 'change',
            message: '请选择平台客户简称'
          }],
          customerAbilityId: [{
            required: true,
            trigger: 'change',
            message: '请选择平台小号模式'
          }],
          commodityId: [{
            required: true,
            trigger: 'change',
            message: '请选择平台商品简称'
          }],
          supportNodeId: [{
            required: true,
            trigger: 'change',
            message: '请选择支撑节点'
          }]
        }
      }
    },
    methods: {
      // 获取客户简称
      getCoustMerShortName() {
        this.$api.NumberPreempted.findAll().then((res) => {
          if (res.code == 200) {
            this.customerSimpleName = res.data
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      },
      getSupport() {
        // 获取支撑节点列表
        this.$api.CustomerAppManage.findAllSupportNode().then((res) => {
          if (res.code == 200) {
            this.supportNodeList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        });
      },
      // 选择客户
      customerChange(e) {
        this.$set(this.dataForm, 'customerAbilityId', null);
        this.$set(this.dataForm, 'commodityId', null);
        this.$api.NumberPreempted.findByCustomerId({customerId: e}).then(res=>{
          if (res.code == 200) {
            this.customerAbilityList = res.data.map(item=>{
              return {
                customerAbilityId: item.id,
                platformAbilityMode: item. abilityMode
              }
            });
          }
        })
      },
      // 选择小号模式
      abilityChange(e) {
        this.$set(this.dataForm, 'commodityId', null);
        let abilityMode = this.customerAbilityList.filter(item=> item.customerAbilityId == e)[0].platformAbilityMode;
        let modeObj = {
          abilityMode
        };
        this.$api.CommodityManagement.findCommodityByAbilityMode(modeObj).then(
          res => {
            if (res.code == 200) {
              this.commodityList = res.data;
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          }
        );
      },
      parentHandle(row) {
        let {
          id,
          order,
          flowId,
          workOrderCustomerId,
          customerCode,
          businessNumber,
          productId,
          productName,
          abilityMode,
          developerStaffId,
          developerName,
          developerPhone,
          openWorkOrderId,
          closeWorkOrderId,
          delFlag,
          createBy,
          createTime,
          lastUpdateBy,
          lastUpdateTime,
          customerId,
          customerAbilityId,
          commodityId,
          supportNodeId
        } = row;
        this.dataForm = {
          id,
          order,
          flowId,
          workOrderCustomerId,
          customerCode,
          businessNumber,
          productId,
          productName,
          abilityMode,
          developerStaffId,
          developerName,
          developerPhone,
          openWorkOrderId,
          closeWorkOrderId,
          delFlag,
          createBy,
          createTime,
          lastUpdateBy,
          lastUpdateTime,
          customerId,
          customerAbilityId,
          commodityId,
          supportNodeId
        };

        if (this.dataForm.customerId) {
          this.$api.NumberPreempted.findByCustomerId({customerId: this.dataForm.customerId}).then(res=>{
            if (res.code == 200) {
              this.customerAbilityList = res.data.map(item=>{
                return {
                  customerAbilityId: item.id,
                  platformAbilityMode: item. abilityMode
                }
              });
            }
          })
        };

        if(this.dataForm.customerAbilityId) {
          this.$api.CommodityManagement.findCommodityByAbilityMode({abilityMode:row.platformAbilityMode}).then(
            res => {
              if (res.code == 200) {
                this.commodityList = res.data;
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            }
          );
        }

        this.customerSimpleName = [],
        this.customerAbilityList = [],
        this.supportNodeList = [], //支撑节点
        this.commodityList = [],
        this.editDialogVisible = true;
        this.getCoustMerShortName();
        this.getSupport();
      },
      submitForm() {
        this.$refs.dataForm.validate(async (valid) => {
        	if (!valid) return;
          let res = await this.$confirm("确定提交吗？", "提示", {type: "warning"}).catch(()=>{})
          if (!res) return;
          let value = await this.$api.CustomerAppManage.autoConfig(this.dataForm)
          if (value.code == 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('findPage')
            this.editDialogVisible = false;
          } else {
            this.$message({
              message: value.msg,
              type: 'error'
            })
          }
        })
      },
    }
  }
</script>

<style>
</style>
