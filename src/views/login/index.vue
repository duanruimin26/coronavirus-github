<template>
  <div id="login">
    <div class="system-logo">
      <!-- <img v-if="imageUrl" :src="imageUrl" height="30" /> -->
    </div>
    <div class="login-body-form">
      <!-- <div class="login-logo"></div> -->
      <div class="login-body-form-title">{{ systemParam.softName }}</div>
      <el-form class="login-form-items">
        <el-form-item>
          <el-input
            prefix-icon="el-icon-user"
            placeholder="账号"
            v-model="userName"
            name="username"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="密码"
            v-model="password"
            show-password
            name="password"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="login-body-form-button">
        <!-- <div class="clearfix" style="margin-top: 88px;">
          <a class="fl" href="javascript:;" @click="forgetPassword">{{ i18n.tip }}</a>
          <span class="fl split-line">/</span>
          <a class="fl" href="javascript:;" @click="changePassword">{{ i18n.changePassword }}</a>
          <el-checkbox class="fr" v-model="checked">{{ i18n.checked }}</el-checkbox>
        </div> -->
        <el-button
          class="login-btn"
          :disabled="submitDisable"
          type="primary"
          @click="submit"
          >{{ $t("button").login }}</el-button
        >
        <!-- <p v-if="isIE" class="ie-tips">
          系统暂不支持IE浏览器，为了更好的体验，请使用其他浏览器。
        </p>-->
      </div>
    </div>
    <div class="login-footer">
      <p class="footer-line">
        <span>地址：{{ systemParam.companyAddr }}</span>
        <span>咨询电话：{{ systemParam.serverTel }}</span>
        <!-- <span>邮箱：{{systemParam.remark}}</span> -->
      </p>
      <p class="footer-line">
        {{ systemParam.companyName }}
      </p>
    </div>

    <!--修改密码弹出框-->
    <change-password :options="passWordModel"></change-password>
  </div>
</template>

<style lang="less">
@import url("index.less");
</style>

<script>
import changePassword from "./components/change_password";

const {
  isDef,
  setSs,
  getSs,
  rmSs,
  getLs,
  setLs,
  rmLs,
  messageTips,
  messageBox,
  toArray
} = window.$app;

export default {
  components: {
    changePassword
  },
  data() {
    return {
      // isIE:false,
      userName: "",
      password: "",
      checked: false,
      submitDisable: false,
      passWordModel: {
        visible: false
      },
      imageUrl: "",
      systemParam: {
        softName: "",
        companyAddr: "",
        serverTel: "",
        companyName: "",
        remark: ""
      }
    };
  },
  methods: {
    setInit() {
      this.i18n = this.$t("login");
      const userName = getLs("userName", this.userName);

      if (isDef(userName)) {
        this.checked = true;
        this.userName = userName;
      }

      window.document.onkeydown = this.keydown;

      // //判断是否是IE浏览器
      // let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      // this.isIE = (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) || (userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1) ;
    },
    getLogo() {
      this.$api.common
        .getLogo("fileName=logo.png")
        .then(res => {
          if (res.resCode == "200") {
            this.imageUrl = res.fileData
              ? "data:image/png;base64," + res.fileData
              : "";
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    },
    keydown(e) {
      if (e.keyCode === 13) {
        this.submit();
      }
    },
    getMenu() {
      const user = getSs("user");
      this.$api.common
        .getMenu({
          userId: user.userId
        })
        .then(res => {
          this.submitDisable = false;
          if (res.resCode == "200") {
            setSs("menus", toArray(res.menus));
            this.$router.push({ name: "dashboard" });
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {
          this.submitDisable = false;
          rmSs("menus");
          rmSs("user");
        });
    },
    submit() {
      if (!isDef(this.userName)) {
        messageTips("error", this.i18n.tips.UM);
        return;
      }

      if (!isDef(this.password)) {
        messageTips("error", this.i18n.tips.password);
        return;
      }

      if (this.submitDisable) {
        return;
      }
      this.submitDisable = true;

      this.$api.common
        .login(
          `umUsername=${this.userName}&umPassword=${encodeURIComponent(
            this.password
          )}`
        )
        .then(data => {
          if (this.checked) {
            setLs("userName", this.userName);
          } else {
            rmLs("userName");
          }
          this.submitDisable = false;
          if (data.resCode == "200") {
            setSs("user", data);
            this.getMenu();
          } else {
            messageTips("error", data.resMsg);
            rmSs("menus");
            rmSs("user");
          }
        })
        .catch(() => {
          rmSs("menus");
          rmSs("user");
          this.submitDisable = false;
        });
    },
    forgetPassword() {
      messageBox({
        title: window.$app.$t("common").tip,
        message: `<p class="title">${this.i18n.tip}</p><p class="content">${this.i18n.tipDetail}</p>`,
        type: "warning",
        className: "forget-password",
        confirm: {
          text: window.$app.$t("button").gotIt
        },
        cancel: {
          show: false
        }
      });
    },
    changePassword() {
      this.passWordModel.visible = true;
    },
    getSystemParam() {
      this.$api.systemSettings.systemParam
        .getSystemParam()
        .then(res => {
          if (res.resCode == "200") {
            this.systemParam.softName = res.baseData.softName;
            this.systemParam.companyAddr = res.baseData.companyAddr;
            this.systemParam.serverTel = res.baseData.serverTel;
            this.systemParam.companyName = res.baseData.companyName;
            this.systemParam.remark = res.baseData.remark;
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    }
  },
  created() {
    this.setInit();
    // this.getLogo();
    this.getSystemParam();
  },
  destroyed() {
    window.document.onkeydown = null;
  }
};
</script>
