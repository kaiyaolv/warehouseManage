<template>
  <div class="container">
      <!-- 导航菜单栏 -->
      <nav-bar></nav-bar>
      <!-- 头部区域 -->
      <head-bar></head-bar>
      <!-- 主内容区域 -->
      <main-content></main-content>
  </div>
</template>

<script>
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"
export default {
  components:{
        HeadBar,
        NavBar,
        MainContent
  },
  created() {
    var user = localStorage.getItem("centerUserInfo");
    // if (user) {
    //   this.setWatermark(JSON.parse(user).name)
    // }

  },
  methods: {
    // 页面添加水印效果
    setWatermark(str) {
      const id = '1.99654.234';
      if (document.getElementById(id) !== null) document.body.removeChild(document.getElementById(id));
      const can = document.createElement('canvas');
      can.width = 300;
      can.height = 200;
      const cans = can.getContext('2d');
      cans.rotate((-30 * Math.PI) / 180);
      cans.font = '30px SimSun';
      cans.fillStyle = 'rgba(200, 200, 200)';
      cans.textBaseline = 'Middle';
      cans.fillText(str, can.width / 10, can.height / 2);
      const div = document.createElement('div');
      div.id = id;
      div.style.pointerEvents = 'none';
      div.style.top = '50px';
      div.style.left = '200px';
      div.style.position = 'fixed';
      div.style.zIndex = '9999';
      div.style.width = `${document.documentElement.clientWidth}px`;
      div.style.height = `${document.documentElement.clientHeight}px`;
      div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`;
      document.body.appendChild(div);
      return id;
    },
  }
};
</script>

<style scoped lang="scss">
  .container {
    position:absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    // background: rgba(224, 234, 235, 0.1);
  }
</style>
