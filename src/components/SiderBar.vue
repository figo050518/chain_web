<template>
  <div class="sider-bar">
    <div class="main-bar" :class="!sidebar.opened?'side-transform':''">
      <a-menu mode="inline"
              :inline-collapsed="!sidebar.opened"
              :open-keys="openKeys"
              v-model:selectedKeys="selectedKeys"
              @openChange="onOpenChange">
        <template v-for="(menu,i) in menus">
          <a-menu-item v-if="hasSigleChild(menu)"
                       :key="menu.path+'/'+menu.children[0].path"
                       @click="handleDrop('main',menu)"
                       :title="menu.meta.title"
                       :style="!sidebar.opened?'padding-left:32px !important;':'padding-left:24px !important;'">
            <span class="iconfont"
                  :class="menu.meta.icon"></span>
            <span v-if="sidebar.opened">{{menu.meta.title}}</span>
          </a-menu-item>
          <a-sub-menu v-else
                      :key="menu.path">
            <template #title>
              <span>
                <span class="iconfont"
                      :class="menu.meta.icon"></span>
                <span v-if="sidebar.opened">{{menu.meta.title}}</span>
              </span>
            </template>
            <a-menu-item v-for="(submenu,j) in menu.children"
                         :key="menu.path+'/'+menu.children[j].path"
                         @click="handleDrop('sub',menu,j)"
                         style="padding-left:48px !important;">
              {{submenu.title}}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </div>
    <div class="expand"
      @click="toggleCollapsed"
      :style="!sidebar.opened?'left:79px':'left:206px'"
      :title="!sidebar.opened?'展开':'收起'"
    >
      <span class="iconfont icon-xianghou" v-if="!sidebar.opened" ></span>
      <span class="iconfont icon-xiangqian" v-else ></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      rootSubmenuKeys: [],
      openKeys: [],
      menus: [],
      selectedKeys:[],
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // selectedKeys () {
    //   let key = []
    //   if (this.$route.path.indexOf('trace') > -1) {
    //     key = ["/trace/index"]
    //   } else {
    //     key = [this.$route.path];
    //   }
    //   return key;
    // }
  },
  created () {
    this.selectedKeys = [this.$route.path];
    let routes = this.$router.options.routes;
    routes.map(e => {
      if (!e.hidden) {
        this.menus.push(e)
      }
      if (e.children.length > 1) {
        this.rootSubmenuKeys.push(e.path)
      }
    })
  },
  methods: {
    toggleCollapsed: function () {
      this.$store.dispatch('ToggleSideBar')
    },
    hasSigleChild (menu) {
      let sum = Number(menu.children.length);
      menu.children.map(e => {
        if (e.hidden) {
          sum -= 1;
        }
      })
      if (menu.children.length == 1 || sum <= 1) {
        return true;
      } else {

        return false;
      }
    },
    handleDrop (flag, menu, j) {
      this.msgBox ? this.$message.destroy() : null;
      let status = this.$store.getters.status;
      let msg = status == 0 ? '请先完成企业信息认证' :
        status == 1 ? '认证信息审核中，请等待' :
          status == 3 ? '认证未通过，请联系管理员或者再次认证' : '';
      if (status != 2) {
        this.msgBox = this.$message.warning(msg);
        return;
      }
      let path = '';
      if (flag == 'main') {
        path = menu.path + '/' + menu.children[0].path
      } else {
        path = menu.path + '/' + menu.children[j].path
      }
      this.$emit('handleCrumd', { menu: menu, index: j });
      this.$router.push({
        path: path
      })
    },
    onOpenChange (openKeys) {
      if (this.openKeys.length == 0) {
        this.openKeys = openKeys;
      } else {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys;
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.sider-bar {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  min-height: calc(100vh - 48px);
}
.main-bar {
  background: #fff;
  position: fixed;
  left: 0;
  top: 48px;
  z-index: 10000;
  width: 207px;
  color: #fff;
  height: 100%;
  min-height: calc(100vh - 48px);
  border-right: 1px solid #e8e8e8;
}
.expand {
  height: 66px;
  position: fixed;
  left: 206px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  border-top: 8px solid rgba(0, 0, 0, 0);
  border-left: 15px solid #fff;
  border-bottom: 8px solid rgba(0, 0, 0, 0);
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
  cursor: pointer;
  span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -15px;
    font-size: 12px;
    font-weight: 600;
    color: #c1c1c1;
  }
}
.side-transform {
  animation: transit 0.3s cubic-bezier(0.2, 0, 0, 1) forwards;
}
@keyframes transit {
  from {
    width: 207px;
  }
  to {
    width: 81px;
  }
}
</style>