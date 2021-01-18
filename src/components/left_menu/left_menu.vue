<template>
  <div :class="'left-menu'+ (isCollapse?' left-menu-collapse':'')">
    <div class="system-item clearfix">
      <div v-if="isCollapse">HUGO</div>
      <div v-else class="system-icon fl ac b purple">
        <img v-if="imageUrl" :src="imageUrl" width="140" height="30" class="picture-show" />
      </div>
    </div>
    <div v-if="$store.state.showMenus">
      <el-menu
        :default-active="active"
        class="menu-item"
        text-color="#fff"
        active-text-color="#fff"
        @open="handleOpen"
        :unique-opened="false"
        :collapse="isCollapse"
        ref="menuVm"
      >
        <div v-for="menu in menus" :key="menu.name">
          <el-menu-item
            v-if="!menu.children"
            @click="handleOpen(menu.name)"
            :index="menu.name"
          >
            <i v-if="menu.iconClass" :class="menu.iconClass + ' icon'"></i>
            <span slot="title">{{setMenuLabel(menu)}}</span>
          </el-menu-item>
          <el-submenu v-else :index="menu.name">
            <template slot="title">
              <i v-if="menu.iconClass" :class="menu.iconClass + ' icon'"></i>
              <span slot="title">{{setMenuLabel(menu)}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="sub in menu.children"
                :key="sub.name"
                :index="sub.name"
                @click="handleOpen(sub.name)"
                class="menu-children"
              >
                <i class="icon"></i>
                <span slot="title">{{setMenuLabel(sub)}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div>
      </el-menu>
    </div>
  </div>
</template>

<style lang="less">
@import url("./left_menu.less");
</style>

<script>
const { toArray, isObj, messageTips } = window.$app;

export default {
  name: "leftMenu",
  props: {
    isCollapse: Boolean,
    menus: Array
  },
  data() {
    return {
      active: "",
      user: {},
      imageUrl: ""
    };
  },
  methods: {
    getLogo(){
      this.$api.common.getLogo(
        "fileName=logo.png"
      )
        .then(res => {
          if (res.resCode == "200") {
            this.imageUrl = res.fileData?("data:image/png;base64," + res.fileData):"";
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    },
    setInit() {
      this.active = this.frRouteKey;
      this.user = this.$root.getSs("user") || {};
    },
    setMenuLabel({ name }) {
      const keys = name.split(".");
      const [key, key1] = keys;
      const label = this.$t("routers")[key];
      return isObj(label)?label[key1 || key]:label;
    },
    handleOpen(name) {
      if (this.$route.name === name) {
        return;
      }

      const flag = this.menus.reduce((flag, v) => {
        if (v.name === name && v.redirect === this.$route.name) {
          flag = false;
        } else if (v.children) {
          v.children.forEach(c => {
            if (c.name === name && c.redirect === this.$route.name) {
              flag = false;
            }
          });
        }
        // if (flag && v.name !== name && v.children) {
        //   this.$refs.menuVm.close(v.name);
        // }
        return flag;
      }, true);

      if (flag && name.indexOf('.')>-1) {//name.indexOf('.')>-1控制点击一级菜单不跳转，二级菜单才跳转
        this.$router.push({ name });
      }
    }
  },
  computed: {
    frRouteKey() {
      const key = toArray(this.menus).reduce((str, v) => {
        if (v.children) {
          v.children.forEach(_v => {
            if (this.$route.name.indexOf(_v.name) > -1) {
              str = _v.name;
            }
          });
        } else if (this.$route.name.indexOf(v.name) > -1) {
          str = v.name;
        }
        return str;
      }, "");
      return key;
    }
  },
  watch: {
    "$route.name"() {
      this.active = this.frRouteKey;
    },
    menus: {
      handler() {
        this.setInit();
      }
    }
  },
  created() {
    this.getLogo();
    this.setInit();

    this.$root.Bus.$on("logos", () => {
      this.getLogo();
    });
  }
};
</script>
