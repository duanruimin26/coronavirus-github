<template>
  <div>
    <!--修改密码弹出框-->
    <el-dialog
      title="修改密码"
      :visible.sync="options.visible"
      width="420px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="change-password-dialog"
      top="10vh"
    >
      <div class="model-body mg-bottom-md">
        <div class="tips">密码设置提示：8-14位，必须由英文、数字、特殊字符(仅限于!#$%(,)*+-.=?@[]^`{|}~)组成，且不能包含空格</div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="76px">
          <el-form-item label="UM账号" prop="username">
            <el-input type="text" v-model="ruleForm.username" placeholder="请输入UM账号"></el-input>
          </el-form-item>
          <el-form-item label="原密码" prop="oldPass">
            <el-input
              type="password"
              v-model="ruleForm.oldPass"
              autocomplete="off"
              placeholder="请输入原密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              type="password"
              v-model="ruleForm.newPass"
              autocomplete="off"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkNewPass"
              autocomplete="off"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 0;">
            <el-button @click="close">取消</el-button>
            <el-button :loading="confirmDisable" type="primary" @click="confirm">确定修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
@import url("change_password.less");
</style>

<script>
const { messageTips } = window.$app;
export default {
  name: "changePassword",
  data() {
    return {
      ruleForm: {
        username: "",
        oldPass: "",
        newPass: "",
        checkNewPass: ""
      },
      confirmDisable: false
    };
  },
  props: {
    options: Object
  },
  methods: {
    confirm() {
      if (!this.ruleForm.username) {
        messageTips("error", "请输入账号！");
        return;
      }
      if (!this.ruleForm.oldPass) {
        messageTips("error", "请输入原密码！");
        return;
      }
      if (!this.ruleForm.newPass) {
        messageTips("error", "请输入新密码！");
        return;
      }
      if (!this.ruleForm.checkNewPass) {
        messageTips("error", "请输入确认新密码！");
        return;
      }
      if (this.ruleForm.newPass !== this.ruleForm.checkNewPass) {
        messageTips("error", "新密码与确认新密码输入不一致，请重新输入！");
        this.ruleForm.newPass = "";
        this.ruleForm.checkNewPass = "";
        return;
      }

      if (this.ruleForm.newPass.indexOf(" ") > -1) {
        messageTips("error", "新密码不能包含空格，请重新输入！");
        this.ruleForm.newPass = "";
        this.ruleForm.checkNewPass = "";
        return;
      }

      let pwdRegex = new RegExp(
        "^(?![A-Za-z0-9]+$)(?![A-Za-z\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]+$)(?![0-9\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]+$)[a-zA-Z0-9\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]{8,14}$"
      );

      if (!pwdRegex.test(this.ruleForm.newPass)) {
        messageTips("error", "新密码不符合设置要求，请重新设置！");
        this.ruleForm.newPass = "";
        this.ruleForm.checkNewPass = "";
        return;
      }

      if (this.confirmDisable) {
        return;
      }
      this.confirmDisable = true;

      this.$api.common
        .updatePassword({
          userName: this.ruleForm.username,
          oldPassword: this.ruleForm.oldPass,
          newPassword: this.ruleForm.newPass,
          confirmedNewPassword: this.ruleForm.newPass
        })
        .then(data => {
          messageTips("success", data.msg);
          if(data.resCode == "200"){
            messageTips("success", "密码修改成功！");
            this.close();
          }else{
            messageTips("error", data.resMsg);
            this.confirmDisable = false;
          }
        })
        .catch(() => {
          this.confirmDisable = false;
        });
    },
    close() {
      this.options.visible = false;
      this.confirmDisable = false;
      this.ruleForm.username = "";
      this.ruleForm.oldPass = "";
      this.ruleForm.newPass = "";
      this.ruleForm.checkNewPass = "";
    }
  },
  created() {}
};
</script>
