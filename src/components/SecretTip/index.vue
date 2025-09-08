<template>
  <div>
    <el-row>
      <el-col :span="24">
        <span class="secret-tip" v-if="type == 'login'">
          注：本平台为互联网非涉密平台，严禁处理、传输国家秘密。
        </span>
        <span class="secret-tip upload-type" v-if="type == 'upload'">
          注：严禁在本互联网非涉密平台处理、传输国家秘密，请确认文件资料不涉及国家秘密。
        </span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SecretTip',
  props: {
    type: {
      type: String,
      default: 'upload'
    }
  }
}
</script>

<style scoped lang="scss">
.secret-tip {
  font-size: 12px;
  color: red;
}

.upload-type {
  word-break: keep-all;
}
</style>
