<template>
  <div>
    <!-- 授权 -->
    <el-dialog
      title="授权"
      :visible.sync="options.visible"
      width="720px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="edit-role"
    >
      <div class="dialog-content">
        <div class="role-authority-select-box">
          <el-tree
            :data="roleMenus"
            show-checkbox
            node-key="menuId"
            :default-expanded-keys="expandedArr"
            :default-checked-keys="checkedArr"
            :props="defaultProps"
            ref="tree"
          ></el-tree>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="beforeClose">取消</el-button>
          <el-button type="primary" :disabled="submitDisable" @click="submit"
            >提交</el-button
          >
        </div>
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

    .el-tree-node {
      .el-tree-node__children {
        .el-tree-node__children {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }

    .el-checkbox__inner:hover {
      border-color: #04b9b4;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #04b9b4;
      border-color: #04b9b4;
    }
  }

  .el-input__suffix {
    top: 2px !important;
  }

  .dialog-footer {
    margin-top: 40px;
    text-align: center;
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
      roleMenus: [],
      expandedArr: [],
      checkedArr: [],
      defaultProps: {
        children: "childrenMenu",
        label: "menuNameChn"
      },
      submitDisable: false //提交按钮
    };
  },
  methods: {
    getTreeExpandedKeys(arr) {
      if (arr && arr.length !== 0) {
        this.expandedArr.push(arr[0].menuId);
        if (arr[0].childrenMenu) {
          arr[0].childrenMenu.forEach(item => {
            this.expandedArr.push(item.menuId);

            if (item.childrenMenu) {
              this.getTreeCheckedKeys(item.childrenMenu);
            }
          });
        }
      }
    },
    getTreeCheckedKeys(arr) {
      if (arr && arr.length !== 0) {
        arr.forEach(item => {
          if (item.selected) {
            this.checkedArr.push(item.menuId);
          }

          if (item.childrenMenu) {
            this.getTreeCheckedKeys(item.childrenMenu);
          }
        });
      }
    },
    getRoleMenuList() {
      this.api
        .getRoleMenuList({
          roleId: this.options.currentRow.roleId
        })
        .then(res => {
          this.expandedArr = [];
          this.checkedArr = [];
          this.roleMenus = res.data;
          this.getTreeExpandedKeys(this.roleMenus);
          this.getTreeCheckedKeys(this.roleMenus);
        });
    },
    beforeClose() {
      this.options.visible = false;
    },
    submit() {

      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();

      if (checkedKeys.length == 0) {
        messageTips("error", "请选择菜单！");
        return;
      }

      if (this.submitDisable) {
        return;
      }
      this.submitDisable = true;

      this.menuIds = checkedKeys.concat(halfCheckedKeys).join(",");

      this.api
        .saveRoleMenu({
            roleId: this.options.currentRow.roleId,
            menuIds: this.menuIds
        })
        .then((res) => {
          if(res.resCode == "200"){
            messageTips("success", "保存成功！");
            this.options.visible = false;
            this.$parent.getList();
          }else{
            messageTips("error", res.resMsg);
          }
          
          this.submitDisable = false;
        })
        .catch(() => {
          this.submitDisable = false;
        });
    }
  },
  watch: {
    "options.visible"(val) {
      if (val) {
        this.getRoleMenuList();
      }
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.roleManage;
  }
};
</script>
