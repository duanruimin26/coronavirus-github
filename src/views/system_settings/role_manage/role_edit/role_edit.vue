<template>
  <div>
    <!-- 添加角色和编辑角色 -->
    <el-dialog
      :title="options.type == 'add' ? '添加角色' : '编辑角色'"
      :visible.sync="options.visible"
      width="520px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="edit-role"
    >
      <div class="dialog-content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              v-model="ruleForm.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDes">
            <el-input
              v-model="ruleForm.roleDes"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary" @click="beforeClose">取消</el-button>
            <el-button @click="submit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.edit-role {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 20px 40px 20px 20px;
    
    .form-btns{
      margin-top: 60px;
    }

  }

  .el-input__suffix {
    top: 2px !important;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  name: "roleEdit",
  props: {
    options: Object
  },
  data() {
    return {
      submitDisable: false, //提交按钮
      ruleForm: {
        roleName: "",
        roleDes: "",
      },
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.submitDisable) {
            return;
          }
          this.submitDisable = true;

          if (this.options.type == "edit") {
            this.api
              .editRole(`roleName=${this.ruleForm.roleName}&roleDes=${this.ruleForm.roleDes}&roleId=${this.options.currentRow.roleId}`)
              .then(res => {
                if (res.resCode == "200") {
                  this.options.visible = false;
                  messageTips("success", "编辑角色成功");

                  this.$parent.getList();
                } else {
                  messageTips("error", res.resMsg);
                }
                this.submitDisable = false;
              })
              .catch(() => {
                this.submitDisable = false;
              });
          } else {
            this.api
              .addRole(`roleName=${this.ruleForm.roleName}&roleDes=${this.ruleForm.roleDes}`)
              .then(res => {
                if (res.resCode == "200") {
                  this.options.visible = false;
                  messageTips("success", "新增角色成功");
                  this.$parent.getList();
                } else {
                  messageTips("error", res.resMsg);
                }
                this.submitDisable = false;
              })
              .catch(() => {
                this.submitDisable = false;
              });
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    "options.visible"(val) {
      if (!val) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {};
        return;
      }

      if (this.options.type == "edit") {
        this.ruleForm = { ...this.options.currentRow };
      }
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.roleManage;
  }
};
</script>
