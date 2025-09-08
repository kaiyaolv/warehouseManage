<template>
  <el-upload :action="serviceBaseUrl" :filePath="filePath" :headers="headers" :on-preview="handlePreview"
    :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :on-success="handleSuccess"
    :on-error="handleError" :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
  import Cookies from "js-cookie";
  import global from "global"

  export default {
    props: {
      filePath: Array,
    },
    data() {
      return {
        fileList: [],
        serviceBaseUrl: this.global.baseUrl + "/file/uploadFile",
        headers: {
          token: Cookies.get('centerAdminToken')
        },
      };
    },
    watch: {
      filePath: function() {
        if(this.filePath.length == 0){
          this.fileList = []
        }
      }
    },
    methods: {
      //移除上传列表中的文件时触发
      handleRemove(file, fileList) {
        let tmpPath = file.response.msg
        this.filePath.splice(this.filePath.indexOf(tmpPath), 1)
      },
      //点击上传列表中的文件时触发
      handlePreview(file) {
      },
      //上传文件的校验
      handleExceed(files, fileList) {},
      //移除上传文件列表前的触发
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }?`);
      },
      //文件上传成功后触发
      handleSuccess(res, file, fileList) {
        if (res.code == 200) {
          this.filePath.push(res.msg)
        }else{
          console.error(res.msg)
        }
      },
      //文件上传失败触发
      handleError(err, file, fileList) {

      }
    },
  }
</script>
<style scoped>

</style>
