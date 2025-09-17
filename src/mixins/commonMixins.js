export const mixin  =  {
	data() {
		return {
			tableHeight: 0, // 响应式的表格高度
			resizeHandler: null // 存储resize事件处理器
		}
	},
	mounted() {
		// 初始化表格高度
		this.updateTableHeight();
		// 添加窗口大小变化监听
		this.addResizeListener();
	},
	beforeDestroy() {
		// 移除窗口大小变化监听
		this.removeResizeListener();
	},
	methods:{
    // 是否展开通用方法
    lengthOverFlow(id) {
      return false;
      try{
        const div = document.querySelector(`#${id}`);
        const children = div.querySelectorAll('.el-form-item');
        let allWidth = 0 ;
        let widthArr = [] ;
        children.forEach(child => {
          allWidth += child.offsetWidth + 10;
          widthArr.push(child.offsetWidth)
        });
        const minWidth = Math.min(...widthArr)
        const operationWidth = document.getElementsByTagName('header')[0].offsetWidth;
        return (allWidth > operationWidth - 10)
      }catch(e){
        return false
      }
    },
    lengthOverFlowTwo(id) {
      try{
        const div = document.querySelector(`#${id}`);
        const children = div.querySelectorAll('.el-form-item');
        let allWidth = 0 ;
        let widthArr = [] ;
        children.forEach(child => {
          allWidth += child.offsetWidth + 10;
          widthArr.push(child.offsetWidth)
        });
        const minWidth = Math.min(...widthArr)
        const operationWidth = document.getElementsByTagName('header')[0].offsetWidth;
        return (allWidth > (operationWidth - 10)*2)
      }catch(e){
        return false
      }
    },
    // 更新表格高度（响应式）
    updateTableHeight() {
      this.$nextTick(() => {
        const operationHeight = this.getOperationHeight();
        const height = this.calculateTableHeight(operationHeight);
        this.tableHeight = height;
      });
    },
    
    // 获取操作栏高度
    getOperationHeight() {
      try {
        const headerElement = document.getElementsByTagName('header')[0];
        return headerElement ? headerElement.offsetHeight : 98;
      } catch (e) {
        return 98; // 默认值
      }
    },
    
    // 计算表格高度
    calculateTableHeight(operationHeight = 98) {
      return (window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight) - 50 - 41 - 37 - operationHeight - 8 - 42;
    },
    
    // 添加窗口大小变化监听
    addResizeListener() {
      // 创建防抖函数
      let timeout;
      const debouncedUpdate = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.updateTableHeight();
        }, 100);
      };
      
      this.resizeHandler = debouncedUpdate;
      window.addEventListener('resize', this.resizeHandler);
    },
    
    // 移除窗口大小变化监听
    removeResizeListener() {
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = null;
      }
    },

    // table的固定高度
    //   计算当前表格的高度
    getTableHeight(callback) {
      // 50为顶部栏 41为菜单栏 37为路由标签 98为操作栏 8 为 操作栏和列表距离 42为底部菜单
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      
      // 如果提供了回调函数，使用异步方式
      if (callback && typeof callback === 'function') {
        this.$nextTick(() => {
          const operationWidth = document.getElementsByTagName('header')[0].offsetHeight;
          const height =
            (window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight) - 50 - 41 - 37 - operationWidth - 8 - 42;
          callback(height);
        });
      } else {
        // 同步方式，但可能不准确
        let operationHeight = 98; // 默认值
        try {
          const headerElement = document.getElementsByTagName('header')[0];
          if (headerElement) {
            operationHeight = headerElement.offsetHeight;
          }
        } catch (e) {
          // 使用默认值
        }
        
        const height = (window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - 50 - 41 - 37 - operationHeight - 8 - 42;
        
        return height;
      }
    },
    getTableHeightIframe() {
      // 50为顶部栏 41为菜单栏 37为路由标签 98为操作栏 8 为 操作栏和列表距离 42为底部菜单
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      let height;
      height =
        (window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight) - 98 - 8 - 42 - 37;
      return height;
    },
    // 获得当前页面的层级
    getCurrentPageLevel() {
      try{
        let url = window.location.href.split('#')[1];
        let navTree = this.$store.state.menu.navTree;
        let namelist = this.getparentlist(url, navTree);
        return namelist.map(res=>res.name)
      }catch(e){
        // console.log(e)
        //TODO handle the exception
      }

    },
    // 获取树状结构某节点所有的父节点
    getparentlist(url, tree) {
    	let arr = [] //要返回的数组
    	for (let i = 0; i < tree.length; i++) {
    		let item = tree[i]
    		arr = []
    		arr.push({
          name: item.name,
          url: item.url
        }) //保存当前节点id
    		if (item.url) { //判断当前id是否是默认id
          if (url.replaceAll('/', '') == item.url.replaceAll('/', '')) {
            return arr //是则退出循环、返回数据
          }
    		} else { //否则进入下面判断，判断当前节点是否有子节点数据
    			if (item.children && item.children.length > 0) {
            //合并子节点返回的数据
    				arr = arr.concat(this.getparentlist(url, item.children))
            let tip = arr.some(res=> {
              if (res) {
                if (res.url) {
                  if (res.url.replaceAll('/', '')  ==  url.replaceAll('/', '')) {
                    return true
                  }
                }
              }
            })
            if (tip) {
              return arr
            }
    			}
    		}
    	}
    },
    // 定义全局的查询项选择框clear函数
    selectClear(obj, param) {
      this.$set(obj, param, null)
    },
    // 查看格式化
    formateNumberViewSafe(cellVal) {
      return this.formateNumberSafe({}, {}, cellVal)
    },
    // 全局混入的格式化号码方法
    formateNumberSafe(row, col, cellVal) {
      const displayControl = this.$store.state.app.displayControl;


      if (!cellVal) return ;

      if (displayControl == 'whole') {
        return cellVal
      }


      // 计算需要遮蔽的起始位置
      const start = Math.floor((cellVal.length - 4) / 2);
      // 如果字符串长度小于等于4，直接返回原字符串
      if (start < 1) {

          if (cellVal.length <= 2) return cellVal;


          let asteriskNum = cellVal.length - 2;

          return cellVal[0] + '****'.slice(0,asteriskNum) + cellVal[cellVal.length - 1];
      } else {
          // 使用切片和字符串连接操作将中间四位替换为 *
          return cellVal.slice(0, start) + '****' + cellVal.slice(start + 4);
      }


      // if (cellVal.length <= 3) {
      //   return cellVal
      // };

      // if (cellVal.length > 3 && cellVal.length <= 7) {
      //   let sign = '****'
      //   return cellVal.substring(0,3) + sign.substring(0, cellVal.length - 3)
      // };

      // if (cellVal.length > 7) {
      //   let regular=/(\d{3})\d*(\d{4})/;
      //   return cellVal.replace(regular,'$1****$2')
      // }
    },
    formateInfoSafe(cellVal) {
      const displayControl = this.$store.state.app.displayControl;


      if (!cellVal) return ;

      if (displayControl == 'whole') {
        return cellVal
      }


      if (cellVal.length < 4) {
        return cellVal[0] + '****'.slice(0, cellVal.length - 1)
      } else {
        return cellVal.slice(0, 2) + "****"
      }
    },
    fallbackCopyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const success = document.execCommand('copy');
        if (success) {
          this.$message({
            message: "复制成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "复制失败",
            type: "error"
          });
        }
      } catch (err) {
        this.$message({
          message: "复制失败",
          type: "error"
        });
      }

      document.body.removeChild(textarea);
    },
	}
}
