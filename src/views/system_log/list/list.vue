<template>
  <div class="system-log-list">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="label">操作账号</span>
          <el-input
            type="text"
            placeholder="操作账号"
            class="width1"
            v-model="params.creator"
            clearable
          ></el-input>
        </div>
        <div class="params-row">
          <span class="label">操作时间</span>
          <el-radio-group
            @change="createTimeTagsChange"
            v-model="params.createTimeTags"
            size="small"
            class="timeRang"
          >
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="2">昨天</el-radio-button>
            <el-radio-button label="3">近7天</el-radio-button>
            <el-radio-button label="4">近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="params.createTime"
            @change="createTimeChange"
            class="width2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-button icon="el-icon-delete" @click="reset()">清空搜索条件</el-button>
          <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="tableData" border style="width: 100%" v-loading="searchDisable">
          <el-table-column prop="creator" label="操作账号" width="120"></el-table-column>
          <el-table-column prop="requestFunction" label="操作功能" min-width="140"></el-table-column>
          <el-table-column prop="requestData" label="请求数据" min-width="360"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" width="180"></el-table-column>
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
  </div>
</template>

<script>
const { tagsToTime, toArray, toObj, messageTips } = window.$app;

export default {
  data() {
    return {
      params: {
        creator: null,
        createTime: "",
        createTimeTags: "",
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      totalCount: 0,
      searchDisable: false
    };
  },
  methods: {
    createTimeTagsChange() {
      this.params.createTime = "";
    },
    createTimeChange() {
      this.params.createTimeTags = "";
    },
    search() {
      this.params.currentPage = 1;
      this.getList();
    },
    getList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      let [dateStart, dateEnd] = this.params.createTimeTags
        ? tagsToTime(this.params.createTimeTags)
        : (this.params.createTime
        ? this.params.createTime
        : [null, null]);

      this.api
        .getList({
          creator: this.params.creator || null,
          dateStart,
          dateEnd,
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
    reset() {
      this.params = this.$options.data().params;
      // this.getList();
    }
  },
  mounted() {
    this.api = this.$api.systemLog.list;
    this.getList();
  }
};
</script>
