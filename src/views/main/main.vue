<template>
  <div :class="'main' + (isCollapse?' main-collapse':'')">
    <div class="menu">
      <left-menu :is-collapse="isCollapse" :menus="menus"></left-menu>
    </div>
    <div class="content">
      <div class="content-bg">
        <div class="clearfix">
          <div class="fl">
            <el-tooltip effect="dark" :content="menuToggle.tip" placement="bottom">
              <i :class="'collapse-btn no-mg mg-right-sm ' + menuToggle.class" @click="menuClick"></i>
            </el-tooltip>

            <div class="system-title">{{systemParam.softName}}</div>
          </div>
          <div class="fr clearfix">
            <el-button type="text" class="fl" @click="viewAbout">关于</el-button>
            <img class="avatar" src="../../assets/images/main/avatar.png" alt="user" />
            <el-dropdown class="logout fl">
              <span class="el-dropdown-link">
                {{ user.umUsername }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="logout" :disabled="logoutDisable">退出登录</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="changePassword">修改密码</span>
                </el-dropdown-item>
                <!-- <el-dropdown-item>
                  <span @click="viewAbout">关于</span>
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div v-if="$store.state.showMenus" class="content-body">
        <c-tags></c-tags>
        <keep-alive :include="tagsList">
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </div>
    </div>

    <div class="content-footer">
      Copyright© {{systemParam.copyRight}}
    </div>

    <!--修改密码弹出框-->
    <change-password :options="passWordModel"></change-password>

    <!--关于弹出框-->
    <about :options="aboutOption"></about>
  </div>
</template>

<style lang="less">
@import url("main.less");
</style>

<script type="text/javascript">
import { leftMenu, cTags } from "@/components";
import changePassword from "./change_password/change_password";
import about from "./about/about";
import param from "./meta_json";
import { filterMenu } from "./util";
const { getSs, rmSs, messageTips } = window.$app;

export default {
  components: {
    leftMenu,
    cTags,
    changePassword,
    about
  },
  data() {
    return {
      menus: [],
      isCollapse: false,
      menuToggle: {
        class: "el-icon-s-fold",
        tip: ""
      },
      logoutDisable: false,
      tagsList: [],
      systemParam: {
        softName: "",
        copyRight: ""
      },
      passWordModel: {
        visible: false
      },
      aboutOption: {
        visible: false
      },
      count: 0
    };
  },
  methods: {
    setInit() {
      const meta = param();
      const { menus } = filterMenu(this.menusKey, meta.menus);
      this.menuToggle.tip = this.$t("main").menuClose;

      meta.menus = menus;
      Object.assign(this.$data, meta);
      this.$store.state.showMenus = !!menus.length;
    },
    menuClick() {
      this.isCollapse = !this.isCollapse;
      if (!this.isCollapse) {
        this.menuToggle.tip = this.$t("main").menuClose;
        this.menuToggle.class = "el-icon-s-fold";
      } else {
        this.menuToggle.tip = this.$t("main").menuOpen;
        this.menuToggle.class = "el-icon-s-unfold";
      }
    },
    logout() {
      if (this.logoutDisable) {
        return;
      }
      this.logoutDisable = true;

      this.$api.common
        .logout()
        .then(res => {
          this.logoutDisable = false;
          if (res.resCode == "200") {
            this.toLogin();
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {
          this.logoutDisable = false;
        });
    },
    toLogin() {
      this.$router.replace({
        name: "login"
      });
      rmSs("menus");
      rmSs("user");
    },
    setBreadcrumbLink(k) {
      const [key] = this.getMenuName;
      const [router] = this.$router.options.routes[2].children.filter(
        v => v.name === key
      );
      if (router.path === k) {
        return {
          name: router.name
        };
      } else if (router.children) {
        const [child = {}] = router.children.filter(v => v.path === k);
        return {
          parent: router.name,
          name: child.name
        };
      }
    },
    breadcrumbLabel(k) {
      const [key] = this.getMenuName;
      return this.$t("routers")[key][k];
    },
    toRouter(k) {
      const { name, parent } = this.setBreadcrumbLink(k);
      if (!parent || name === this.$route.name || !name) {
        return;
      }
      this.$router.push({ name: name, query: this.$route.query });
    },
    getIndexSystemParam() {
      this.$api.systemSettings.systemParam
        .getIndexSystemParam()
        .then(res => {
          if (res.resCode == "200") {
            this.systemParam.softName = res.baseData.softName;
            this.systemParam.copyRight = res.baseData.copyRight;
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    },
    changePassword() {
      this.passWordModel.visible = true;
    },
    viewAbout() {
      this.aboutOption.visible = true;
    },
    clearTimer () {
      clearInterval(window.myTimer)
      window.myTimer = null
    },
    setTimer () {
      this.count = 0
      if (!window.myTimer) {
        window.myTimer = window.setInterval(this.cookieTimeout, 1000)
      }
    },
    cookieTimeout () {
      //判断用户无操作就自动登出
      const logoutTimes = getSs("user").logoutTimes;
      this.count++;
      if (this.count === logoutTimes) {
        // messageTips("error", '系统无操作，将在十秒后退出登录，如不想退出系统，请任意操作鼠标键盘...');
        // setTimeout(this.logoutTime, 10000);
        this.logoutTime()
      }
    },
    logoutTime(){
      this.$api.common
        .logout()
        .then(() => {
          this.toLogin();
        })
        .catch(() => {});
    }
  },
  computed: {
    getMenuName() {
      return this.$route.name.split(".");
    },
    breadcrumbs() {
      const keys = this.getMenuName;
      const [key] = keys;
      const items = keys.filter(k => this.$t("routers")[key][k]);
      return items;
    }
  },
  created() {
    this.user = getSs("user") || {};
    this.menusKey = getSs("menus") || [];

    if (!Object.keys(this.user).length || !this.menusKey.length) {
      this.$api.common.logout().finally(this.toLogin);
      return;
    }
    this.setInit();
    this.getIndexSystemParam();

    this.$root.Bus.$on("params", () => {
      this.getIndexSystemParam();
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    this.$root.Bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
  mounted () {
    // 监听鼠标
    document.onmousemove = (event) => {
      let x1 = event.clientX
      let y1 = event.clientY
      if (this.x !== x1 || this.y !== y1) {
        this.count = 0
      }
      this.x = x1
      this.y = y1
    }
    // 监听键盘
    document.onkeydown = () => {
      this.count = 0
    }
    // 监听Scroll
    document.onscroll = () => {
      this.count = 0
    }
    this.setTimer()
  },
  beforeDestroy () {
    this.clearTimer()
  },
};
</script>
