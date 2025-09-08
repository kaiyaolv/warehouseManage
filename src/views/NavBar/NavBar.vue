<template>
	<div class="menu-bar-container">
    <!-- logo -->
    <div class="logo" :style="{'background-color':'rgb(175,17,30)'}" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
      @click="$router.push('/')">
        <img v-if="collapse" src="@/assets/logo.png"/> <div class="nameSize">{{collapse?'':appName}}</div>
    </div>
    <!-- 导航菜单 -->
    <el-menu ref="navmenu" default-active="1" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
      :collapse="collapse" :collapse-transition="false" :unique-opened="true  "
      @open="handleopen" @close="handleclose" @select="handleselect">
      <!-- 导航菜单树组件，动态加载菜单 -->
      <menu-tree v-for="item in realNavTree" :key="item.id" :menu="item"></menu-tree>
    </el-menu>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import MenuTree from "@/components/MenuTree"
export default {
  components:{
        MenuTree
  },
  computed: {
    ...mapState({
      appName: state=>state.app.appName,
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse,
      navTree: state=>state.menu.navTree,
      realNavTree: state=>state.menu.realNavTree
    }),
    mainTabs: {
      get () { return this.$store.state.tab.mainTabs },
      set (val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.tab.mainTabsActiveName },
      set (val) { this.$store.commit('updateMainTabsActiveName', val) }
    }
  },
  watch: {
    $route: 'handleRoute'
  },
  created () {
    this.handleRoute(this.$route)
  },
  methods: {
    handleopen() {

    },
    handleclose() {

    },
    handleselect(a, b) {

    },
    // 路由操作处理
    handleRoute (route) {
      // tab标签页选中, 如果不存在则先添加
      var tab = this.mainTabs.filter(item => item.name === route.meta.name)[0]
      if (!tab) {
        tab = {
          name: route.meta.name,
          title: route.meta.name,
          icon: route.meta.icon,
          path: route.fullPath
        }
        this.mainTabs = this.mainTabs.concat(tab)
      }
      this.mainTabsActiveName = tab.name
      // 切换标签页时同步更新高亮菜单
      if(this.$refs.navmenu != null) {
        this.$refs.navmenu.activeIndex = '' + route.meta.index
        this.$refs.navmenu.initOpenedMenu()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-bar-container {
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  z-index: 1020;
  .el-menu {
    position:absolute;
    top: 50px;
    bottom: 0px;
    text-align: left;
    background-color: #2F313A ;
  }
  .logo {
    position:absolute;
    top: 0px;
    height: 50px;
    line-height: 50px;
    background: #545c64;
    cursor:pointer;
    img {
        width: 40px;
        height: 40px;
        border-radius: 0px;
        margin: 10px 10px 10px 10px;
        float: left;
    }
    div {
      font-size: 25px;
      color: white;
      text-align: left;
      padding-left: 20px;
    }
  }
  .menu-bar-width {
    width: 200px;
  }
  .menu-bar-collapse-width {
    width: 65px;
  }
}
.nameSize{
	font-size: 20px !important;
}

.el-menu>>>.el-menu-item:focus {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF;
  }
  .el-menu>>>.el-menu-item:hover {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF;
  }
  .el-menu>>> .is-active {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF !important;
  }
  .el-menu>>>.el-submenu__title {
    color: rgba(179, 181, 183, 1);
  }
  .el-menu>>>.el-submenu__title:hover {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF;
  }
  .el-menu>>>.el-submenu__title:focus {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF;
  }
  .el-menu>>> .is-active {
    .el-submenu__title {
      color: #FFFFFF !important;
    }
  }
  .el-menu>>> .is-active {
    background-color: rgba($color: #FFFFFF, $alpha: 0.2);
    color: #FFFFFF !important;
  }
  .el-menu>>>.el-menu--inline {
    background-color: #24262D ;
    .el-menu-item:hover {
      background-color: black;
      color: #FFFFFF;
    }
    .el-menu-item:focus {
      background-color: black;
      color: #FFFFFF;
    }
    .is-active {
      background-color: black;
      color: #FFFFFF !important;
    }
    .el-menu-item {
      font-size: 12px;
    }
  }
  .el-menu>>>.is-opened{
    .el-submenu__title i {
      color:#FFFFFF;
    }
  }
  .el-menu>>>.el-menu-item {
    color: rgba(179, 181, 183, 1);
  }
</style>
