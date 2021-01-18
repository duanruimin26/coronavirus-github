<template>
  <div class="data-analysis-detail">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="sub-title"
            >测序目录 {{ $route.query.sequenceList }}</span
          >
        </div>
        <!-- <div class="params-row">
          <span class="sub-title" style="font-size: 14px;"
            >BC文库编码 {{ $route.query.bcLibraryId }}</span
          >
        </div> -->
        <div class="params-row">
          <span class="label">样本编号</span>
          <el-input
            type="text"
            placeholder="样本编号"
            class="width1"
            v-model="params.sampleNum"
            clearable
          ></el-input>
          <span class="label">文库编码</span>
          <el-input
            type="text"
            placeholder="文库编码"
            class="width1"
            v-model="params.libraryId"
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
          <el-button icon="el-icon-delete" @click="reset()"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search()"
            >搜索</el-button
          >
        </div>
      </div>

      <div class="operate-btns">
        <el-button v-if="$route.query.type == 'audit'" type="primary" @click="batchJudge('01')">通过</el-button>
        <el-button v-if="$route.query.type == 'audit'" type="danger" @click="batchJudge('02')">不通过</el-button>
      </div>

      <div class="table-data">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="searchDisable"
          ref="table"
          class="main-table"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="children" type="expand" width="1">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.children"
                :span-method="objectSpanMethod"
                class="more-info-table"
              >
                <el-table-column
                  prop="chineseName"
                  label="中文名"
                ></el-table-column>
                <el-table-column prop="analyzeNineUnit" label="阴阳性">
                  <template slot-scope="slot">
                    <span :class="{ red: slot.row.analyzeNineUnit == '+' }">{{
                      slot.row.analyzeNineUnit == "+" ? "阳性" : "阴性"
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="mValueUnit"
                  label="R值"
                ></el-table-column>
                <el-table-column
                  prop="Rrange"
                  label="R值参考范围"
                  min-width="110"
                ></el-table-column>
                <el-table-column
                  prop="connetHeadSeven"
                  label="接头i7"
                ></el-table-column>
                <el-table-column
                  prop="connetHeadFive"
                  v-if="isFiveView"
                  label="接头i5"
                ></el-table-column>
                <el-table-column
                  prop="judgeName"
                  label="检验人"
                ></el-table-column>
                <el-table-column
                  prop="seqCheckDateStr"
                  label="测序日期"
                ></el-table-column>
                <el-table-column
                  prop="bcLibraryId"
                  label="BC文库编码"
                ></el-table-column>
                <el-table-column label="审核结果">
                  <template slot-scope="scope">{{
                    scope.row.resultJudge | resultJudge
                  }}</template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            v-if="$route.query.type == 'audit'"
            type="selection"
            :selectable="selectDisable"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.anayStatus != '03'"
                type="text"
                class="arrow-btn"
                @click="viewAllInfo(scope.row)"
                :icon="
                  scope.row.expand
                    ? 'el-icon-arrow-down'
                    : 'el-icon-arrow-right'
                "
              ></el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleNum"
            label="样本编号"
            min-width="146"
          ></el-table-column>
          <el-table-column
            prop="libraryId"
            label="文库编码"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="checkedName"
            label="受检者姓名"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="drawPotency"
            label="提取浓度(ng/μL)"
            min-width="140"
          ></el-table-column>
          <!-- <el-table-column
            prop="connetHeadFive"
            label="接头i5"
          ></el-table-column> -->
          <el-table-column prop="createLibPotency" min-width="150">
            <template slot="header">
              <el-tooltip
                class="item"
                effect="light"
                content="建库浓度 ≥ 1ng/μL"
                placement="top"
              >
                <div>
                  <span>建库浓度(ng/μL)</span>
                  <i class="el-icon-info"></i>
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :class="scope.row.createLibPotency < 1 ? 'red' : ''">{{
                scope.row.createLibPotency
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oldReads" min-width="140">
            <template slot="header">
              <el-tooltip
                class="item"
                effect="light"
                content="原始数据量 ≥ 4M"
                placement="top"
              >
                <div>
                  <span>原始数据量(M)</span>
                  <i class="el-icon-info"></i>
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :class="scope.row.oldReads < 4 ? 'red' : ''">{{
                scope.row.oldReads
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="createLibPotency"
            label="建库浓度"
          ></el-table-column>
          <el-table-column
            prop="drawPotency"
            label="提取浓度"
          ></el-table-column> -->
          <el-table-column prop="qThirty" label="HQ(%)" min-width="100">
            <template slot="header">
              <el-tooltip
                class="item"
                effect="light"
                content="HQ ≥ 50%"
                placement="top"
              >
                <div>
                  <span>HQ(%)</span>
                  <i class="el-icon-info"></i>
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :class="scope.row.qThirty < 50 ? 'red' : ''">{{
                scope.row.qThirty
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="innerParam" min-width="100">
            <template slot="header">
              <el-tooltip
                class="item"
                effect="light"
                content="内参 > 0"
                placement="top"
              >
                <div>
                  <span>内参</span>
                  <i class="el-icon-info"></i>
                </div>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span :class="scope.row.innerParam <= 0 ? 'red' : ''">{{
                scope.row.innerParam
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="分析状态">
            <template slot-scope="scope">
              <span
                v-if="scope.row.anayStatus == '04'"
                class="red"
                :title="scope.row.errmsg"
                >{{ scope.row.anayStatus | analysisStatus }}</span
              >
              <span v-else>{{ scope.row.anayStatus | analysisStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核结果">
            <template slot-scope="scope">{{
              scope.row.resultJudge | resultJudge
            }}</template>
          </el-table-column> -->
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button
                v-if="$route.query.type == 'audit'"
                :disabled="
                  scope.row.resultJudge == '01' ||
                    scope.row.resultJudge == '02' 
                "
                type="primary"
                class="table-operate-btns"
                @click="doJudge(scope.row, '01')"
                >通过</el-button
              >
              <el-button
                v-if="$route.query.type == 'audit'"
                :disabled="
                  scope.row.resultJudge == '01' ||
                    scope.row.resultJudge == '02'
                "
                type="danger"
                class="table-operate-btns"
                @click="doJudge(scope.row, '02')"
                >不通过</el-button
              >
              <el-button
                :disabled="scope.row.anayStatus != '03'"
                type="primary"
                class="table-operate-btns"
                @click="viewAllInfo(scope.row)"
                >详情</el-button
              >
              <el-button
                class="table-operate-btns export-btn"
                @click="exportBySampleNum(scope.row)"
                v-if="
                  scope.row.resultJudge == '01' || scope.row.resultJudge == '02'
                "
                >导出</el-button
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
  </div>
</template>

<style lang="less">
.data-analysis-detail {
  // .el-table__expand-icon {
  //   pointer-events: none;
  // }
  .main-table {
    .el-table__expand-column {
      overflow: hidden;
    }

    .arrow-btn {
      padding: 0 5px;
      color: #04b9b4;
    }

    .arrow-btn.is-disabled {
      color: #c0c4cc;
    }
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
const { toArray, toObj, messageTips } = window.$app;

export default {
  data() {
    return {
      params: {
        sampleNum: null,
        checkedName: null,
        libraryId: null,
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      isFiveView: false,
      totalCount: 0,
      searchDisable: false,
      pathogensTypes: [
        "单纯疱疹病毒I型",
        "水痘带状疱疹病毒",
        "EB病毒",
        "人巨细胞病毒",
        "大肠埃希氏菌",
        "金黄色葡萄球菌",
        "肺炎克雷伯菌",
        "肺炎链球菌",
        "新型隐球菌"
      ],
      Rranges:[
        "R≥1.4",
        "R≥2.0",
        "R≥1.9",
        "R≥1.5",
        "R≥1.5",
        "R≥1.5",
        "R≥1.3",
        "R≥2.1",
        "R≥1.2"
      ],
      chooseSampSeqId: []
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
          libraryId: this.params.libraryId || null,
          checkedName: this.params.checkedName || null,
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage,
          seqId: this.$route.query.seqId,
          bcId: this.$route.query.bcId
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(data);
            this.tableData.forEach(item => {
              item.sampleQualityControl = this.$route.query.sampleQualityControl;
              item.children = [];
              item.expand = false;

              this.pathogensTypes.forEach((v,index) => {
                item.children.push({
                  chineseName: v,
                  Rrange: this.Rranges[index]
                });
              });
            });
            this.totalCount = totalCount;

            this.isFiveView = res.fiveView == "Y";
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
      this.chooseSampSeqId = val.map(v => {
        return {
          bcId: v.bcId,
          sampSeqId: v.sampSeqId,
          sampleNum: v.sampleNum
        };
      });
    },
    exportBySampleNum(row) {
      this.api.exportBySampleNum({
        sampSeqId: row.sampSeqId
      });
    },
    viewAllInfo(row) {
      row.expand = !row.expand;
      if (row.expand) {
        this.api
          .getAllInfo({
            sampSeqId: row.sampSeqId
          })
          .then(res => {
            if (res.resCode == "200") {
              row.children.forEach((v, i) => {
                Object.assign(v, res);
                v.analyzeNineUnit = res.analyzeNine[i];
                v.mValueUnit = res.mValue.split(",")[i];
              });

              this.$refs.table.toggleRowExpansion(row);
            } else {
              row.expand = !row.expand;
              messageTips("error", res.resMsg);
            }
          })
          .catch(() => {});
      } else {
        this.$refs.table.toggleRowExpansion(row, false);
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column && columnIndex >= 4 && columnIndex <= 9) {
        if (row && rowIndex === 0) {
          return {
            rowspan: 9,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    doJudge(row, resultJudge) {
      this.$confirm("确认提交审核结果?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .updateResultJudge({
              verifyList: [
                {
                  resultJudge,
                  bcId: row.bcId,
                  sampSeqId: row.sampSeqId,
                  sequenceList: this.$route.query.sequenceList,
                  sampleNum: row.sampleNum
                }
              ]
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", "审核成功");
                this.getList();
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消审核！");
        });
    },
    batchJudge(resultJudge) {
      if (this.chooseSampSeqId.length == 0) {
        messageTips("error", "请选择要审核的数据！");
        return;
      }
      this.chooseSampSeqId.forEach(v => {
        v.resultJudge = resultJudge;
        v.sequenceList = this.$route.query.sequenceList;
      });
      this.$confirm("确认提交审核结果?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .updateResultJudge({
              verifyList: this.chooseSampSeqId
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", "审核成功");
                this.getList();
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消审核！");
        });
    },
    selectDisable(row) {
      if (
        // row.sampleQualityControl == "01" &&
        row.resultJudge != "01" &&
        row.resultJudge != "02"
      ) {
        return true;
      }
    }
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
    this.getList();
  }
};
</script>
