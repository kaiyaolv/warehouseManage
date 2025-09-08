<template>
  <div id="app" v-show='isShow'>
    <router-view/>
  </div>
</template>

<script>
  import {switchUrl} from "global";
  import axios from 'axios'
export default {
  name: 'App',
  data() {
    return {
      isShow: true,
    }
  },
  created() {
    // axios.get(
    // 	switchUrl,
    // ).then(res=>{
    // 	this.isShow = true;
    // 	if (res.status == 200) {
    // 		if (res.data == true) {
    // 			document.querySelector('html').style.filter = 'grayscale(100%)'
    // 		} else {
    // 			document.querySelector('html').style.filter = 'unset'
    // 		}
    // 	} else {
    // 		document.querySelector('html').style.filter = 'unset'
    // 	}
    // }).catch(e=>{
    //   this.isShow = true;
    // 	document.querySelector('html').style.filter = 'unset'
    // })
  }
}
</script>

<style lang="scss">
.el-button [class*=el-icon-]+span{
  margin-left:0 !important;
}
.menu-bar-container .menu-bar-width {
  overflow-x: auto;
}
// 时间去除清除按钮
.el-picker-panel__footer>.el-picker-panel__link-btn.el-button--text {
  display: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #484a4d;
  /* background:  #b6bbbb21; */
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
 ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 10px;
    opacity: 0.6;
    background-color: #f8f5f5;
  }

  ::-webkit-scrollbar-thumb {

    border-radius: 10px;
    background: rgba(178, 179, 180, 0.2);
  }

  .el-upload-list__item-thumbnail {
    /* 图片在方框内显示长边 */
    object-fit: contain;
  }

.el-message-box__btns{
  height:65px;
  // background-color: #F0F2F5;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  padding-right:20px !important;
}
// .el-message-box__btns >button:nth-child(1){
//   background-color: #ffffff !important;
//   color:#25282F !important;
//   border: 1px solid  #25282F !important;
// }
.el-dialog__header,.el-message-box__header{
	    height: 44px !important;
	    background-color: #eee!important;
	    text-align: left !important;
	    padding: 14px 0 0 17px !important;
	    box-sizing: border-box !important;
	    font-size: 16px !important;
      color: #303133 !important;
      font-weight: bold !important;
}
.el-message-box{
	border: none !important;
	padding-bottom: 0 !important;
	width: 466px !important;
}
.el-dialog__title ,.el-message-box__title{
  color: #303133 !important;
  font-weight: bold !important;
}
.el-icon-close:before{
	    font-size: 16px !important;
	    /* color: #FFFFFF !important; */
		/* position: relative !important; */
		/* top:-3px !important; */
}
.el-dialog__body{
	    padding: 15px 0px 0 0px !important;
}
.el-form-item__content{
	text-align: left !important;
}
.el-button--info{
	background-color: #ffffff !important;
	border: 1px solid #25282F !important;
	color:#25282F !important;
	/* font-size:14px */
}
.el-button--warning{
	background-color: #409EFF !important;
	border: 1px solid #409EFF !important;
	/* font-size:14px */
}
.el-button--sumit{
	background-color: #009686 !important;
	color:#ffffff !important;
	font-size:14px !important ;
}
.el-button--success {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}

.el-button--warning {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}
.el-button--danger {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}
.el-button--primary {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}
.el-button--info {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}
.el-button--default {
  background-color: #ffffff !important;
  color: #fd7222 !important;
  border: 1px solid #fd7222 !important;
}

.el-upload-list__item .is-success{
	position: relative !important;
	top:-10px !important;
}

.footItem{
  height:65px !important;
  background-color: #F0F2F5 !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  padding-right:20px !important;
}
.inputItem{
  width:302px !important;
  margin-left:6px !important;
}
.selectItem{
  width:302px !important;
  margin-left:6px !important;
}
.selectTool, .inputTool{
  width:170px !important;
}
/* .el-table th>.cell{
  background-color: #25282F !important;
  height:44px;
  padding-top:15px;
  font-weight: 400 !important;
  box-sizing: border-box;
  color: #ffffff;
}
.el-table th, .el-table tr{
  height:40px;
} */

.el-table thead {
  /* background-color: #25282f !important; */
  /* color: #ffffff !important; */
  /* height: 40px !important; */
  font-weight: 400 !important;
}
.el-table th {
  /* background-color: #25282f !important; */
  font-weight: 400 !important;
}
.el-table th>.cell{
  font-weight: bold;
  color: #333;
}
.el-table--fit{
  box-shadow: 0px -10px 50px 0px rgba(37, 40, 47, 0.1) !important;
}
.main-container{
	background-color: #F0F2F5 !important;
}
.toolbar{
	padding-left:0 !important;
	padding-top:0 !important
}
.el-button--mini>i{
  /* opacity: 0 !important; */
  display: none !important;
}
.edit-button>i{
  display: inline-block !important;
}
.el-table td,
.el-table th {
  padding: 2px 0 !important;
}
.el-table th,
.el-table tr thead {
  background-color: #f4f4f4 !important;
}
.el-table .el-loading-mask {
  z-index: 1800 !important;
}
.el-button--mini,
.el-button--mini.is-round {
  padding: 4px 8px !important;
}
.pathBox {
  width: 100% !important;
  padding: 10px 0 10px 0 !important;
}
.el-breadcrumb {
  font-size: 16px !important;
}
.topbar {
  float: left;
  padding: 20px 0px 0px 0px;
  width: 100%;
  background-color: #FFFFFF;
  margin-bottom: 20px;
  border-left:1px solid #d2d2d2 !important;
  border-right:1px solid #d2d2d2 !important;
  border-top: 1px solid #d2d2d2 !important;
}
.topbarInput {
  display: flex;
  text-align: left;
  padding-left: 8px;
}
/* 顶部搜索操作区域样式 */
header {
  padding-top: 20px;
  background-color: #FFFFFF;
  margin-bottom: 8px;
  text-align: left;
  padding-left: 8px;
  box-sizing: border-box;
  position: absolute;
  z-index: 1000;
  width: 900px;
  border: 1px solid #E6E8EB;
  box-shadow: 0px 4px 8px 0px rgba(161,161,161,0.2);
}
header .el-form {
  height: 46px;
  /* 由于form使用的是inline-block 所以元素之间默认有间距 父元素设置font-size为
      0可以去掉间隙*/
  font-size: 0px;
  overflow: hidden;
  position: relative;
}
header .operationExpand {
  height: auto !important;
}
/* 操作栏的筛选项字号12px */
header .el-input--mini {
  font-size: 12px !important;
}
header .el-form-item__label {
  font-size: 12px !important;
}

/* 操作按钮栏 */
.btnSearch {
  display: flex;
  text-align: left;
  padding: 0 10px 10px 0 ;
  align-items: center;
}
.btnSearch .expandButton {
  font-size: 12px;
  color: #E97D30;
  display:flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
}
.expandButton span {
  cursor:pointer;
}
.expandButton i {
  margin-top: 1px;
  transform: rotate(90deg);
  /* transition: .38s; */
}
.el-icon-d-arrow-bottom {
  transform: rotate(-90deg) !important;
}
/* table */
.page-table {
  top: 108px;
}
/* 底部分页栏 */
.bottom-bar {
  height: 42px;
  display: flex;
  align-items: center;
  position: relative;
}
.page-bottom-bar {
  top: 105px;
}
.el-pagination {
  display: contents;
}
.el-pagination::before {
  display: flex;
  flex: 1;
  content: "";
}
.el-form-item__label {
    font-size: 12px !important;
}
.el-form-item--mini .el-form-item__error{
  padding-left: 8px !important;
}
/* 统一所有文本框的字体样式 */
.textarea > .el-textarea__inner {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 12px;
}
.number_flex_end{
  align-items: flex-end !important;
}
// 控制查看行距
.itemDetail{
  margin-bottom: 7px !important;
}
  /* 二级页面的分页栏 */
  .pagination-row {
  	height: 40px;
  	padding: 0px 16px;
  	box-sizing: border-box;
  	width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .el-tooltip__popper.is-dark {
    max-width: 500px;
  }

/* 查看行样式 */
.row{
  display: flex;
  padding: 0px 16px;
  box-sizing: border-box;
  padding-bottom: 8px;
  align-items: baseline;
}
.cell-label {
  flex: 0 0 20%;
  text-align: right;
}
.cell-content {
  flex: 0 0 30%;
  padding-right: 10px;
  text-align: left;
	display: flex;
	align-items: center;
}
.cell-content-fit {
  flex: 1;
  padding-right: 10px;
  text-align: left;
	display: flex;
	align-items: center;
}
/* 多列样式 */
.rowItem {

	padding: 0px 16px;
	display: flex;
	justify-content: space-between;
}
.el-button.is-disabled {
    color: #C0C4CC !important;
    cursor: not-allowed;
    background-image: none;
    background-color: #FFF !important;
    border-color: #EBEEF5 !important;
  }
.num-exception-tip {
  max-width: 500px;
}
</style>



<style lang="scss">
  /* 全屏的dialog */
  .dialog-fullscreen-width-collapse {
    width: calc(100% - 65px);
  }
  .dialog-fullscreen-width {
    width: calc(100% - 200px);
  }
  .dialog-fullscreen {
    height: calc(100% - 91px);
    right: 0px !important;
    bottom: 0px !important;
    left: auto !important;
    top: auto !important;
    z-index: 1900 !important;
    .el-dialog__header {
      display: none;
    }
    .is-fullscreen {
      background-color: #F0F2F5;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .el-dialog__body {
      padding: 0 !important;
      height: 100%;
      box-sizing: border-box;
    }
    // 二级列表页面关闭图标
    .close-second-form {
      font-size: 14px;
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 8px;
    }
    // 路径里上级标签 点击返回上一级
    .last-page-tag {
      cursor: pointer;
    }
    .last-page-tag:hover {
      border-bottom: 1px solid #E97D30;
      color: #E97D30;
    }
    .main-box {
      height: calc(100% - 37px - 42px);
      overflow: auto;
      background-color: #FFFFFF;
      width: 100%;
      padding: 0 26px;
      box-sizing: border-box;
			position: relative;
			text-align: right;

			.second-page-close {
				position: sticky;
				cursor:pointer;
				top: 26px;
				z-index: 1;
			}

      .second-title-box {
        font-size: 14px;
        padding: 10px 0 5px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #E97D30;
        margin-bottom: 20px;
        .second-title {
          position: relative;
          margin-left: 15px;
        }
        .second-title::before {
          content: '';
          position: absolute;
          left: -13px;
          top: 4px;
          width: 5px;
          height: 12px;
          background-color: #E97D30;
          margin-right: 10px;
        }
        i {
          cursor:pointer;
        }
      }
      .rowItem {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 calc((100% - 420px * 2 - 100px) / 2);
      }
    }
    // 底部按钮
    .footButtonItem {
      height: 42px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 20px;
      .el-button--primary:nth-child(1) {
        background-color: #FFFFFF !important;
        color: #131313  !important;
        border: 1px solid #E5E7EB !important;
      }
      .el-button--primary:nth-child(2) {
        background-color: #E97D30 !important;
        color: #FFFFFF !important;
        border: 1px solid #E97D30 !important;
      }
      .el-button--mini,
      .el-button--mini.is-round {
        padding: 7px 15px !important;
      }
    }
  }

  .el-dialog__wrapper.scrollbar .el-dialog .el-dialog__body {
    overflow: auto;
    overflow-x: hidden;
    max-height: 70vh;
    padding: 10px 20px 0 !important;
  }

  .dialog-fullscreen-iframe {
    height: 100%;
    left: 0 !important;
  }
</style>
