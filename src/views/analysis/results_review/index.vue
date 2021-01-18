<template>
  <div class="data-analysis">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="label">目录</span>
          <el-input
            type="text"
            placeholder="目录"
            class="width0"
            v-model="params.sequenceList"
            clearable
          ></el-input>
          <!-- <span class="label">创建人</span>
          <el-input type="text" placeholder="创建人" class="width0" v-model="params.creator" clearable></el-input>
          <el-button icon="el-icon-delete" @click="reset()">清空搜索条件</el-button>
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
        <el-table :data="tableData" border style="width: 100%" v-loading="searchDisable" :span-method="objectSpanMethod">
          <el-table-column prop="sequenceList" label="测序目录" min-width="160"></el-table-column>
          <el-table-column prop="creator" label="创建人" min-width="86"></el-table-column>
          <el-table-column label="创建时间" width="156">
            <template slot-scope="scope">{{
              scope.row.createTime | date
            }}</template>
          </el-table-column>
          <el-table-column label="分析状态" min-width="96">
            <template slot-scope="scope">
              <span v-if="scope.row.anayStatus=='04'" class="red" :title="scope.row.errmsg">{{scope.row.anayStatus | analysisStatus}}</span>
              <span v-else>{{scope.row.anayStatus | analysisStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column label="样本质控" min-width="96">
            <template slot-scope="scope">{{scope.row.sampleQualityControl | sampleQualityControl}}</template>
          </el-table-column>
          <el-table-column label="审核状态" min-width="96">
            <template slot-scope="scope">{{scope.row.verifyStatus | verifyStatus}}</template>
          </el-table-column>
          <el-table-column
            prop="judgeName"
            label="检验人"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="bcLibraryId"
            label="BC文库编码"
            min-width="180"
          ></el-table-column>
          <el-table-column label="操作" width="460">
            <template slot-scope="scope">
              <el-button class="table-operate-btns" type="danger" @click="auditRow(scope.row, 'audit')" :disabled="scope.row.verifyStatus == '02' || scope.row.sampleQualityControl != '01'">审核</el-button>
              <el-button class="table-operate-btns" type="primary" @click="viewQualityControl(scope.row)">样本质控结果</el-button>
              <el-button class="table-operate-btns" v-if="scope.row.verifyStatus == '02' || scope.row.sampleQualityControl != '01'" type="primary" @click="auditRow(scope.row,'view')">详情</el-button>
              <el-button
                class="table-operate-btns export-btn"
                @click="exportByDataDir(scope.row)"
                v-if="scope.row.verifyStatus == '02'"
              >导出</el-button>
              <!-- <el-button class="table-operate-btns" type="primary" @click="viewQualityControl(scope.row)">PC质控结果</el-button>
              <el-button class="table-operate-btns" type="primary" @click="viewQualityControl(scope.row)">NC质控结果</el-button> -->
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

    <!-- 质控结果 -->
    <quality-control-result :options="qualityControlOption"></quality-control-result>
  </div>
</template>

<script>
import qualityControlResult from "./qualityControlResult";
const { toArray, toObj, messageTips, tagsToTime } = window.$app;

export default {
  components: {
    qualityControlResult
  },
  data() {
    return {
      params: {
        sequenceList: "",
        // creator: "",
        createTime: "",
        createTimeTags: "",
        anayStatus: "03",
        sampleQualityControl: null,
        verifyStatus: null,
        isDelete: "N",
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
      searchDisable: false,
      qualityControlOption: {
        currentRow: {},
        visible: false
      }
    };
  },
  methods: {
    createTimeTagsChange() {
      this.params.createTime = "";
    },
    createTimeChange() {
      this.params.createTimeTags = "";
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
          // creator: this.params.creator || null,
          createTimeStart,
          createTimeEnd,
          anayStatus: this.params.anayStatus || null,
          sampleQualityControl: this.params.sampleQualityControl || null,
          verifyStatus: this.params.verifyStatus || null,
          isDelete: this.params.isDelete || null,
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            const tableList = toArray(data);
            this.tableData = [];
            tableList.forEach(v=>{
              v.nadaaDataDirBcList.forEach(item=>{
                this.tableData.push(Object.assign({...v},{
                  sampleQualityControl: item.sampleQualityControl,
                  verifyStatus: item.verifyStatus,
                  bcLibraryId: item.bcLibraryId,
                  judgeName: item.judgeName,
                  bcId: item.bcId
                }))
              })
            })
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
    auditRow(row,type) {
      this.$router.push({
        name: "analysis.resultsReview.resultsReviewDetail",
        query: {
          sequenceList: row.sequenceList,
          seqId: row.seqId,
          bcId: row.bcId,
          bcLibraryId: row.bcLibraryId,
          // sampleQualityControl: row.sampleQualityControl
          type
        }
      });
    },
    exportByDataDir (row) {
      this.api.exportByDataDir({
        seqId: row.seqId,
        bcId: row.bcId
      })
    },
    viewQualityControl(row){
      this.qualityControlOption.currentRow = row;
      this.qualityControlOption.visible = true;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let sequenceListNum = 0;
      if (column && columnIndex >= 0 && columnIndex <= 3) {
        for (var i = 0; i < this.tableData.length; i++) {
          if (row.sequenceList == this.tableData[i].sequenceList
          && row.seqId == this.tableData[i].seqId
          ) {
            sequenceListNum++;
          }
        }

        if (sequenceListNum == 1) {
          return {
            rowspan: sequenceListNum,
            colspan: 1
          };
        } else if (sequenceListNum > 1) {
          if (
            this.tableData[rowIndex - 1] &&
            this.tableData[rowIndex].sequenceList ==
              this.tableData[rowIndex - 1].sequenceList
            &&this.tableData[rowIndex].seqId == this.tableData[rowIndex - 1].seqId
          ) {
            return {
              rowspan: 0,
              colspan: 0
            };
          } else {
            return {
              rowspan: sequenceListNum,
              colspan: 1
            };
          }
        }
      }
    }
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
    this.getList();
  }
};
</script>
