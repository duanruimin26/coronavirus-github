<template>
  <div class="user-manage">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="label">账号</span>
          <el-input
            type="text"
            placeholder="请输入账号"
            class="width1"
            v-model="params.userName"
            clearable
          ></el-input>
          <span class="label">联系手机</span>
          <el-input
            type="text"
            placeholder="请输入联系手机"
            class="width1"
            v-model="params.telNo"
            clearable
          ></el-input>
          <span class="label">电子邮箱</span>
          <el-input
            type="text"
            placeholder="请输入电子邮箱"
            class="width1"
            v-model="params.email"
            clearable
          ></el-input>
          <el-button icon="el-icon-delete" @click="reset"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
      </div>

      <div class="operate-btns">
        <el-button type="danger" @click="batchDelete">删除</el-button>
        <el-button icon="el-icon-plus" @click="newUser">添加用户</el-button>
      </div>

      <div class="table-data">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="searchDisable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            :selectable="selectDisable"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="userName"
            label="账号"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="userNameDesc"
            label="用户名称"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="telNo"
            label="手机号"
            min-width="110"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="电子邮箱"
            min-width="190"
          ></el-table-column>
          <el-table-column
            prop="deptName"
            label="部门"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="lastLoginTime"
            label="最后登录"
            min-width="156"
          ></el-table-column>
          <el-table-column label="状态" min-width="70">
            <template slot-scope="scope">
              <span :class="scope.row.enableStatus == '1' ? 'green' : 'red'">{{
                scope.row.enableStatus == "1" ? "使用中" : "已禁用"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button
                class="table-operate-btns"
                type="primary"
                @click="editUser(scope.row)"
                >编辑</el-button
              >
              <el-button
                :class="
                  'table-operate-btns ' +
                    (scope.row.enableStatus == '1' ? 'orange-btn' : 'green-btn')
                "
                type="primary"
                @click="toggleUser(scope.row)"
                >{{
                  scope.row.enableStatus == "1" ? "禁用" : "启用"
                }}</el-button
              >
              <el-button
                class="table-operate-btns"
                type="danger"
                @click="deleteUser(scope.row)"
                >删除</el-button
              >
              <el-button
                class="table-operate-btns"
                type="primary"
                @click="resetPassword(scope.row)"
                >重置密码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="table-pagination"
        @size-change="search"
        @current-change="getList"
        background
        :current-page.sync="params.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 新增/编辑用户 -->
    <user-edit :options="rowOption"></user-edit>

    <!-- 提示框 -->
    <c-tip-model :options="tipModel"></c-tip-model>
  </div>
</template>

<style lang="less">
.user-manage {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>

<script>
import { cTipModel } from "@/components";
import userEdit from "./user_edit/user_edit";
const { toArray, toObj, messageTips } = window.$app;

export default {
  components: {
    cTipModel,
    userEdit
  },
  data() {
    return {
      params: {
        userName: null,
        telNo: null,
        email: null,
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      totalCount: 0,
      rowOption: {
        currentRow: {},
        visible: false
      },
      searchDisable: false,
      deleteUserList: [],
      tipModel: {
        visible: false,
        disable: false,
        cancelShow: false
      }
    };
  },
  methods: {
    getList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      this.api
        .getList({
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage,
          userName: this.params.userName || null,
          telNo: this.params.telNo || null,
          email: this.params.email || null
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { dataList = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(dataList);
            this.totalCount = totalCount;
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {
          this.searchDisable = false;
        });
    },
    search() {
      this.params.currentPage = 1;
      this.getList();
    },
    reset() {
      this.params = this.$options.data().params;
      // this.getList();
    },
    //表格选择
    handleSelectionChange(val) {
      this.deleteUserList = val.map(v => v.userId);
    },
    //批量删除
    batchDelete() {
      if(this.deleteUserList.length == 0){
        messageTips("error", "请选择要删除的用户！");
        return;
      }

      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteUser({
              userIds: this.deleteUserList.join(",")
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", "删除成功");
                this.search();
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消删除！")
        });
    },
    //添加用户
    newUser() {
      this.rowOption.visible = true;
      this.rowOption.type = "add";
    },
    //编辑用户
    editUser(row) {
      this.rowOption.currentRow = row;
      this.rowOption.visible = true;
      this.rowOption.type = "edit";
    },
    deleteUser(row) {
      if (row.userName == "admin") {
        messageTips("error", "admin用户不能删除！");
        return;
      }

      this.$confirm("此操作将永久删除用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteUser({
              userIds: row.userId
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", "删除成功");
                this.search();
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消删除！")
        });
    },
    toggleUser(row) {
      const text = row.enableStatus == "1" ? "禁用" : "启用";
      this.$confirm(`此操作将${text}该用户, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .toggleUser({
              userId: row.userId
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", `${text}成功！`);
                this.getList();
              } else {
                messageTips("error", res.resMsg);
                this.getList();
              }
            });
        })
        .catch(() => {
          messageTips("info", `取消${text}！`)
        });
    },
    resetPassword(row) {
      this.$confirm("此操作将重置密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .resetPassword({
              userName: row.userName
            })
            .then(data => {
              this.$alert(
                `<div>${"用户 <xmp class='red b'>{name}</xmp> 密码重置成功!".replace(
                  "{name}",
                  row.userName
                )}</div><div>${"重置后的密码为：<xmp class='red b'>{name}</xmp>".replace(
                  "{name}",
                  data.initialPassword
                )}</div>`,
                "重置密码成功",
                {
                  confirmButtonText: "确认",
                  type: "success",
                  dangerouslyUseHTMLString: true,
                  center: true
                }
              );
              this.getList();
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消重置密码！")
        });
    },
    selectDisable(row) {
      if (row.userName !== "admin") {
        return true;
      }
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.userManage;
    this.getList();
  }
};
</script>
