<template>
  <div class="search-download-detail">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row" style="margin-bottom: 20px;">
          <span class="sub-title"
            >测序目录 {{ $route.query.sequenceList }}</span
          >
        </div>
        <div class="params-row">
          <span class="label">样本编号</span>
          <el-input
            type="text"
            placeholder="样本编号"
            class="width1"
            v-model="params.sampleNum"
            clearable
          ></el-input>
          <span class="label">受检者姓名</span>
          <el-input
            type="text"
            placeholder="受检者姓名"
            class="width1"
            v-model="params.checkedName"
            clearable
          ></el-input>
          <span class="label">送检医院</span>
          <el-input
            type="text"
            placeholder="送检医院"
            class="width1"
            v-model="params.sendCheckHospital"
            clearable
          ></el-input>
        </div>
        <div class="params-row">
          <span class="label">文库编码</span>
          <el-input
            type="text"
            placeholder="文库编码"
            class="width1"
            v-model="params.libraryId"
            clearable
          ></el-input>
          <el-button icon="el-icon-delete" @click="reset()"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search()"
            >搜索</el-button
          >
        </div>
      </div>

      <div class="operate-btns">
        <el-button type="primary" class="export-btn" @click="batchExport">打包下载</el-button>
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
            :selectable="selectDisable"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="sampleNum"
            label="样本编号"
            min-width="140"
          ></el-table-column>
          <el-table-column
            prop="libraryId"
            label="文库编码"
            min-width="140"
          ></el-table-column>
          <el-table-column
            prop="checkedName"
            label="受检者姓名"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="sendCheckHospital"
            label="送检医院"
            min-width="156"
          ></el-table-column>
          <el-table-column
            prop="judgeName"
            label="检验人"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="verifyUserName"
            label="审核人"
            min-width="90"
          ></el-table-column>
          <el-table-column label="审核结果" min-width="90">
            <template slot-scope="scope">{{
              scope.row.resultJudge | resultJudge
            }}</template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button
                class="table-operate-btns export-btn"
                @click="exportByFileName(scope.row)"
                :disabled="scope.row.resultJudge != '01'"
                >报告下载</el-button
              >
              <el-button
                class="table-operate-btns"
                type="primary"
                @click="reportPreview(scope.row)"
                :disabled="scope.row.resultJudge != '01'"
                >报告预览</el-button
              >
              <el-button
                class="table-operate-btns green-blue-btn"
                type="primary"
                @click="downloadRecords(scope.row)"
                :disabled="scope.row.resultJudge != '01'"
                >下载记录</el-button
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

    <!-- pdf预览 -->
    <report-preview :options="previewOption"></report-preview>

    <!-- 下载记录 -->
    <download-records :options="recordsOption"></download-records>
  </div>
</template>

<style lang="less">
.search-download-detail {
  .el-table__expand-icon {
    pointer-events: none;
  }
  .table-expand {
    .el-form-item {
      margin-bottom: 10px !important;
    }
    .el-form-item__label {
      font-size: 14px !important;
      color: #99a9bf;
    }
  }
}
</style>

<script>
import reportPreview from "./reportPreview";
import downloadRecords from "./downloadRecords";
const { toArray, toObj, messageTips } = window.$app;

export default {
  components: {
    reportPreview,
    downloadRecords
  },
  data() {
    return {
      params: {
        sampleNum: null,
        checkedName: null,
        sendCheckHospital: null,
        libraryId: null,
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      totalCount: 0,
      searchDisable: false,
      previewOption: {
        pdfUrl: "",
        visible: false
      },
      recordsOption: {
        currentRow: {},
        visible: false
      },
      chooseListId: []
    };
  },
  methods: {
    getList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      this.api
        .getDataCatalogDetail({
          sampleNum: this.params.sampleNum || null,
          checkedName: this.params.checkedName || null,
          sendCheckHospital: this.params.sendCheckHospital || null,
          libraryId: this.params.libraryId || null,
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage,
          sequenceList: this.$route.query.sequenceList,
          seqId: this.$route.query.seqId
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
    reset() {
      this.params = this.$options.data().params;
      // this.getList();
    },
    //表格选择
    handleSelectionChange(val) {
      this.chooseListId = val.map(v => v.fileName);
    },
    exportByFileName(row) {
      this.api.exportByFileName({
        fileName: row.fileName
      });
    },
    reportPreview(row) {
      this.previewOption.visible = true;
      this.previewOption.pdfUrl = window.origin + row.pdfPath;
    },
    downloadRecords(row){
      this.recordsOption.currentRow = row;
      this.recordsOption.visible = true;
    },
    //打包下载
    batchExport(){
      if(this.chooseListId.length == 0){
        messageTips("error","请选择数据！");
        return
      }

      this.api.batchExportByFileName({
        fileNameStr: this.chooseListId.join(',')
      });
    },
    selectDisable(row) {
      if (row.resultJudge == '01') {
        return true;
      }
    }
  },
  mounted() {
    this.api = this.$api.report.searchDownload;
    this.getList();
  }
};
</script>
