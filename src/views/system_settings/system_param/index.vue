<template>
  <div class="system-param">
    <!-- 表单部分 -->
    <div class="main-content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="ruleForm system-param-form"
      >
        <div class="system-param-items">
          <div class="items-content">
            <el-form-item label="生信服务器IP：" prop="conectIp">
              <el-input
                v-model="ruleForm.conectIp"
                placeholder="请输入生信服务IP"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="生信服务器端口：" prop="conectPort">
              <el-input
                v-model="ruleForm.conectPort"
                placeholder="请输入生信服务器端口"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="system-param-items" style="display: none">
          <div class="items-content">
            <el-form-item label="logo 图片：">
              <el-upload
                class="upload-component"
                action
                :on-change="handleChange"
                :auto-upload="false"
                :show-file-list="false"
                name="file"
                accept=".png"
                :disabled="isDisableEdit"
              >
                <div class="picture-show">
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    width="103"
                    height="22"
                  />
                </div>
                <div class="upload-btn"></div>
              </el-upload>
              <div class="tips">上传图片的名称必须为logo.png</div>
            </el-form-item>
            <el-form-item label="Copyright：" prop="copyRight">
              <el-input
                v-model="ruleForm.copyRight"
                clearable
                :disabled="isDisableEdit"
              ></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" prop="companyName">
              <el-input
                v-model="ruleForm.companyName"
                clearable
                :disabled="isDisableEdit"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="items-content" style="display: none">
          <el-form-item label="医疗器械注册证编号：" prop="registerNum">
            <el-input
              v-model="ruleForm.registerNum"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="软件名称：" prop="softName">
            <el-input
              v-model="ruleForm.softName"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="软件型号：" prop="softType">
            <el-input
              v-model="ruleForm.softType"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="软件版本：" prop="softVersion">
            <el-input
              v-model="ruleForm.softVersion"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="服务电话：" prop="serverTel">
            <el-input
              v-model="ruleForm.serverTel"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司地址：" prop="companyAddr">
            <el-input
              v-model="ruleForm.companyAddr"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              clearable
              :disabled="isDisableEdit"
            ></el-input>
          </el-form-item>
        </div>

        <div class="form-btns" style="text-align: center">
          <el-button
            :loading="submitLoading"
            type="primary"
            @click="submitForm()"
            >保存</el-button
          >
          <el-button @click="resetForm()" v-if="!isDisableEdit">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less">
.system-param {
  .system-param-form {
    padding: 20px 30px !important;
  }
  .system-param-items {
    margin-bottom: 12px;
    // border-bottom: 1px solid #e7e7e7;
  }

  .items-content {
    width: 620px;

    .el-form-item {
      margin-bottom: 12px !important;
    }
  }

  .upload-component {
    display: inline-block;
  }

  .picture-show {
    display: inline-block;
    width: 123px;
    height: 32px;
    padding: 5px 10px;
    margin-right: 12px;
    box-sizing: border-box;
    background: #002322;
    // background: center center no-repeat url("../../../assets/images/components/left_menu/system_logo_icon.png") #002322;
    // background-size: 103px 22px;
    vertical-align: top;

    img {
      vertical-align: top;
    }
  }

  // img.picture-show{
  //   vertical-align: top;
  // }

  .upload-btn {
    display: inline-block;
    width: 32px;
    height: 32px;
    background: center center no-repeat
      url("../../../assets/images/main/upload-img-btn.png");
  }

  .tips {
    display: inline-block;
    line-height: 32px;
    margin-left: 10px;
    vertical-align: top;
    font-size: 12px;
  }

  .form-btns {
    margin-top: 30px;
    // padding-left: 20px;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  data() {
    return {
      ruleForm: {
        conectIp: "",
        conectPort: "",
        copyRight: "",
        companyName: "",
        registerNum: "",
        softName: "",
        softType: "",
        softVersion: "",
        serverTel: "",
        companyAddr: "",
        remark: "",
        fileData: "",
        logoUrl: "logo.png",
      },
      conectIp: "",
      conectPort: "",
      imageUrl: "",
      rules: {},
      submitLoading: false,
      isDisableEdit: true,
    };
  },
  methods: {
    getSystemParam() {
      this.api
        .getSystemParam()
        .then((res) => {
          if (res.resCode == "200") {
            Object.entries(res.baseData).forEach(([key, value]) => {
              this.ruleForm[key] = value;
            });
            this.conectIp = this.ruleForm.conectIp;
            this.conectPort = this.ruleForm.conectPort;

            this.isDisableEdit = res.isEdit == "N";
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    },
    getLogo() {
      this.$api.common
        .getLogo("fileName=logo.png")
        .then((res) => {
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
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          this.$confirm("参数设置将影响启动分析功能，是否要继续操作?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              if (this.submitLoading) {
                return;
              }
              this.submitLoading = true;

              if (!this.ruleForm.fileData) {
                this.ruleForm.fileData = null;
              }

              this.api
                .saveSystemParam({ ...this.ruleForm })
                .then((res) => {
                  this.submitLoading = false;
                  if (res.resCode == "200") {
                    messageTips("success", "保存成功！");
                    this.$router.push({
                      name: "dashboard",
                    });

                    this.$root.Bus.$emit("params", this.ruleForm);
                    this.$root.Bus.$emit("logos");
                  } else {
                    messageTips("error", res.resMsg);
                  }
                })
                .catch(() => {
                  this.submitLoading = false;
                });
            })
            .catch(() => {
              messageTips("info", "取消操作！");
              this.ruleForm.conectIp = this.conectIp;
              this.ruleForm.conectPort = this.conectPort;
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.ruleForm.fileData = file.raw;
    },
  },
  mounted() {
    this.api = this.$api.systemSettings.systemParam;
    this.getSystemParam();
    this.getLogo();
  },
};
</script>
