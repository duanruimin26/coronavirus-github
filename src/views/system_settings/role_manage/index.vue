<template>
  <div class="role-manage">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="operate-btns">
        <el-button type="danger" @click="batchDelete">删除</el-button>
        <el-button icon="el-icon-plus" @click="newRole">添加角色</el-button>
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
            width="50"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="名称"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="roleDes"
            label="描述"
            min-width="130"
          ></el-table-column>
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">
              <span :class="scope.row.enableStatus == '1' ? 'green' : 'red'">{{
                scope.row.enableStatus == "1" ? "使用中" : "已禁用"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加时间" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.createTime | date }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button
                class="table-operate-btns"
                type="primary"
                @click="editRole(scope.row)"
                >编辑</el-button
              >
              <el-button
                class="table-operate-btns green-blue-btn"
                type="primary"
                @click="authorizeRole(scope.row)"
                >授权</el-button
              >
              <!-- <el-button
                :class="
                  'table-operate-btns ' +
                    (scope.row.enableStatus == '1' ? 'orange-btn' : 'green-btn')
                "
                type="primary"
                @click="toggleRole(scope.row)"
                >{{
                  scope.row.enableStatus == "1" ? "禁用" : "启用"
                }}</el-button
              > -->
              <el-button
                class="table-operate-btns"
                type="danger"
                @click="deleteRole(scope.row)"
                >删除</el-button
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

    <!-- 新增/编辑角色 -->
    <role-edit :options="rowOption"></role-edit>

    <!-- 角色授权 -->
    <authorize-edit :options="authorizeOption"></authorize-edit>

    <!-- 提示框 -->
    <c-tip-model :options="tipModel"></c-tip-model>
  </div>
</template>

<script>
import { cTipModel } from "@/components";
import roleEdit from "./role_edit/role_edit";
import authorizeEdit from "./authorize_edit/authorize_edit";
const { toArray, toObj, messageTips } = window.$app;

export default {
  components: {
    cTipModel,
    roleEdit,
    authorizeEdit
  },
  data() {
    return {
      params: {
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      totalCount: 0,
      rowOption: {
        currentRow: {},
        visible: false
      },
      authorizeOption: {
        currentRow: {},
        visible: false
      },
      searchDisable: false,
      deleteRoleList: [],
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
          currentPage: this.params.currentPage
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(data);
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
    //表格选择
    handleSelectionChange(val) {
      this.deleteRoleList = val.map(v => v.roleId);
    },
    //批量删除
    batchDelete() {
      if(this.deleteRoleList.length == 0){
        messageTips("error", "请选择要删除的角色！");
        return;
      }

      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteRole({
              roleIds: this.deleteRoleList.join(",")
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
          messageTips("info", "取消删除！");
        });
    },
    //添加角色
    newRole() {
      this.rowOption.visible = true;
      this.rowOption.type = "add";
    },
    //编辑角色
    editRole(row) {
      this.rowOption.currentRow = row;
      this.rowOption.visible = true;
      this.rowOption.type = "edit";
    },
    //授权
    authorizeRole(row) {
      this.authorizeOption.currentRow = row;
      this.authorizeOption.visible = true;
    },
    deleteRole(row) {
      this.$confirm("此操作将永久删除角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteRole({
              roleIds: row.roleId
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
          messageTips("info", "取消删除！");
        });
    },
    toggleRole(row) {
      this.api
        .toggleRole({
          roleId: row.roleId,
          enableStatus: row.enableStatus == "1" ? "0" : "1"
        })
        .then(res => {
          if (res.resCode == "200") {
            const text = row.enableStatus == "1" ? "禁用成功！" : "启用成功！";
            messageTips("success", text);
            this.getList();
          } else {
            messageTips("error", res.resMsg);
            this.getList();
          }
        });
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.roleManage;
    this.getList();
  }
};
</script>