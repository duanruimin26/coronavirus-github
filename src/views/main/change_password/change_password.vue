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
        <div class="tips">
          密码设置提示：8-14位，必须由英文、数字、特殊字符组成，且不能包含空格
        </div>
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="85px"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              type="text"
              :disabled="true"
              v-model="ruleForm.username"
              placeholder="请输入账号"
            ></el-input>
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
          <el-form-item label="确认新密码" prop="checkNewPass">
            <el-input
              type="password"
              v-model="ruleForm.checkNewPass"
              autocomplete="off"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 0">
            <el-button @click="close">取消</el-button>
            <el-button :loading="confirmDisable" type="primary" @click="confirm"
              >确定修改</el-button
            >
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
const { getSs, messageTips } = window.$app;
export default {
  name: "changePassword",
  data() {
    const validateNewPass = (rule, value, callback) => {
      const pwdRegex = new RegExp(
        "^(?![A-Za-z0-9]+$)(?![A-Za-z\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]+$)(?![0-9\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]+$)[a-zA-Z0-9\\!\\#\\$\\%\\(\\,\\)\\*\\+\\-\\.\\=\\?\\@\\[\\]\\^\\`\\{\\|\\}\\~]{8,14}$"
      );
      if (value === "") {
        callback(new Error("新密码不能为空！"));
      }else if (value == this.ruleForm.oldPass) {
        callback(new Error("新密码不能和旧密码一样！"));
      } else if(!pwdRegex.test(value)){
        callback(new Error("不符合要求,特殊字符仅限!#$%(,)*+-.=?@[]^`{|}~"));
      }else{
        callback();
      }
    };

    const validateCheckNewPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("确认新密码不能为空！"));
      }else if (value !== this.ruleForm.newPass) {
        callback(new Error("新密码与确认新密码输入不一致，请重新输入！"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        oldPass: "",
        newPass: "",
        checkNewPass: "",
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空！", trigger: "blur" },
        ],
        newPass: [
          { required: true, validator: validateNewPass, trigger: "blur" },
        ],
        checkNewPass: [
          { required: true, validator: validateCheckNewPass, trigger: "blur" },

        ],
      },
      confirmDisable: false,
      user: {},
    };
  },
  props: {
    options: Object,
  },
  methods: {
    confirm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.ruleForm.newPass.indexOf(" ") > -1) {
            messageTips("error", "新密码不能包含空格，请重新输入！");
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
              confirmedNewPassword: this.ruleForm.newPass,
            })
            .then((data) => {
              messageTips("success", data.msg);
              if (data.resCode == "200") {
                messageTips("success", "密码修改成功！");
                this.close();
              } else {
                messageTips("error", data.resMsg);
                this.confirmDisable = false;
              }
            })
            .catch(() => {
              this.confirmDisable = false;
            });
        } else {
          return false;
        }
      });
    },
    close() {
      this.options.visible = false;
      this.confirmDisable = false;
      this.ruleForm.oldPass = "";
      this.ruleForm.newPass = "";
      this.ruleForm.checkNewPass = "";
    },
  },
  created() {
    const user = getSs("user") || {};
    this.ruleForm.username = user.umUsername;
  },
};
</script>
