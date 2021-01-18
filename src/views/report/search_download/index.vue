<template>
  <div class="search-download">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="label">目录</span>
          <el-input
            type="text"
            placeholder="目录"
            class="width1"
            v-model="params.sequenceList"
            clearable
          ></el-input>
          <!-- <span class="label">创建人</span>
          <el-input type="text" placeholder="创建人" class="width1" v-model="params.nameDes" clearable></el-input> -->
          <!-- <el-button icon="el-icon-delete" @click="reset()">清空搜索条件</el-button>
          <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button> -->
        </div>
        <div class="params-row">
          <span class="label">创建日期</span>
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
            :picker-options="pickerOptions"
          ></el-date-picker>
          <el-button icon="el-icon-delete" @click="reset()"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search()"
            >搜索</el-button
          >
        </div>
      </div>
      <div class="table-data">
        <el-table :data="tableData" border style="width: 100%" v-loading="searchDisable">
          <el-table-column prop="sequenceList" label="测序数据目录" min-width="180"></el-table-column>
          <el-table-column prop="creator" label="创建人" min-width="90"></el-table-column>
          <el-table-column label="创建时间" min-width="156">
            <template slot-scope="scope">{{scope.row.createTime | date}}</template>
          </el-table-column>
          <el-table-column label="分析状态" min-width="90">
            <template slot-scope="scope">{{scope.row.anayStatus | analysisStatus}}</template>
          </el-table-column>
          <!-- <el-table-column label="样本质控" min-width="90">
            <template slot-scope="scope">{{scope.row.sampleQualityControl | sampleQualityControl}}</template>
          </el-table-column> -->
          <el-table-column label="审核状态" min-width="90">
            <template slot-scope="scope">{{scope.row.verifyStatus | verifyStatus}}</template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button class="table-operate-btns" type="primary" @click="viewRow(scope.row)">详情</el-button>
              <el-button class="table-operate-btns export-btn" @click="exportRow(scope.row)">打包下载</el-button>
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
  </div>
</template>

<script>
const { toArray, toObj, messageTips, tagsToTime } = window.$app;

export default {
  data() {
    return {
      params: {
        sequenceList: null,
        // nameDes: null,
        createTime: "",
        createTimeTags: "",
        pageSize: 50,
        currentPage: 1
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
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

      let [createTimeStart, createTimeEnd] = this.params.createTimeTags
        ? tagsToTime(this.params.createTimeTags)
        : this.params.createTime
        ? this.params.createTime
        : [null, null];

      this.api
        .getList({
          sequenceList: this.params.sequenceList || null,
          // nameDes: this.params.nameDes || null,
          createTimeStart,
          createTimeEnd,
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
    },
    viewRow(row) {
      this.$router.push({
        name: "report.searchDownload.searchDownloadDetail",
        query: {
          id: row.id,
          sequenceList: row.sequenceList,
          seqId: row.seqId
        }
      });
    },
    exportRow(row) {
      this.api.batchdownLoadReport({
        seqId: row.seqId
      })
    }
  },
  mounted() {
    this.api = this.$api.report.searchDownload;
    this.getList();
  }
};
</script>
