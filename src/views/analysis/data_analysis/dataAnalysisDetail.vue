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
        <div class="params-row" v-if="$route.query.libraryId">
          <span class="sub-title"
            >BC文库编码 {{ $route.query.libraryId }}</span
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
          <el-button icon="el-icon-delete" @click="reset()"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search()"
            >搜索</el-button
          >
        </div>
      </div>

      <div class="table-data">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="searchDisable"
          ref="table"
          class="main-table"
        >
          <el-table-column prop="children" type="expand"  width="1">
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
                  prop="reads"
                  label="原始数据量"
                ></el-table-column>
                <el-table-column prop="qThirty" label="HQ%"></el-table-column>
                <el-table-column prop="sampleQualityControl" label="样本质控">
                  <template slot-scope="slot">{{
                    slot.row.sampleQualityControl | sampleQualityControl
                  }}</template>
                </el-table-column>
                <el-table-column label="内参">
                  <!-- <template>
                    <el-button
                      v-if="
                        scope.row.resultJudge != '01' &&
                          scope.row.resultJudge != '02'
                      "
                      type="primary"
                      class="table-operate-btns"
                      @click="doJudge(scope.row.sampleNum, '01')"
                      >合格</el-button
                    >
                    <el-button
                      v-if="
                        scope.row.resultJudge != '01' &&
                          scope.row.resultJudge != '02'
                      "
                      type="danger"
                      class="table-operate-btns"
                      @click="doJudge(scope.row.sampleNum, '02')"
                      >不合格</el-button
                    >
                  </template> -->
                </el-table-column>
                <el-table-column prop="qThirty" label="提取浓度(ng/μL)"></el-table-column>
                <el-table-column prop="qThirty" label="建库浓度(ng/μL)"></el-table-column>
                <el-table-column prop="qThirty" label="文库编码"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-button
                :disabled="scope.row.anayStatus != '03'"
                type="text"
                class="arrow-btn"
                @click="viewAllInfo(scope.row)"
                :icon="scope.row.expand?'el-icon-arrow-down':'el-icon-arrow-right'"
                ></el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleNum"
            label="样本编号"
            min-width="146"
          ></el-table-column>
          <el-table-column
            prop="checkedName"
            label="受检者姓名"
            min-width="96"
          ></el-table-column>
          <el-table-column
            prop="connetHeadSeven"
            label="接头i7"
          ></el-table-column>
          <!-- <el-table-column
            prop="connetHeadFive"
            label="接头i5"
          ></el-table-column> -->
          <el-table-column
            prop="connetHeadFive"
            label="检查者"
          ></el-table-column>
          <el-table-column
            prop="connetHeadFive"
            label="测序日期"
          ></el-table-column>
          <!-- <el-table-column
            prop="createLibPotency"
            label="建库浓度"
          ></el-table-column>
          <el-table-column
            prop="drawPotency"
            label="提取浓度"
          ></el-table-column> -->
          <el-table-column
            prop="libraryId"
            label="BC文库编码"
            min-width="180"
          ></el-table-column>
          <el-table-column label="分析状态">
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
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                class="table-operate-btns export-btn"
                @click="exportBySampleNum(scope.row)"
                >导出</el-button
              >
              <el-button
                :disabled="scope.row.anayStatus != '03'"
                type="text"
                class="table-operate-btns all-info-btn"
                @click="viewAllInfo(scope.row)"
                >全部信息</el-button
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
  .main-table{
    .el-table__expand-column{
      overflow: hidden;
    }

    .arrow-btn{
      padding: 0 5px;
      color: #04B9B4;
    }

    .arrow-btn.is-disabled{
      color: #C0C4CC;
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
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
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
      ]
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
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage,
          sequenceList: this.$route.query.sequenceList
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(data);
            this.tableData.forEach(item => {
              item.children = [];
              item.expand = false;

              this.pathogensTypes.forEach(v => {
                item.children.push({
                  chineseName: v
                });
              });
            });
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
    exportBySampleNum(row) {
      this.api.exportBySampleNum({
        sampleNum: row.sampleNum
      });
    },
    viewAllInfo(row) {
      row.expand = !row.expand;
      if (row.expand) {
        this.api
          .getAllInfo({
            sampleNum: row.sampleNum,
            sequenceList: this.$route.query.sequenceList
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
      if (column && columnIndex >= 3 && columnIndex <= 9) {
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
    doJudge(sampleNum, resultJudge) {
      this.$confirm("确认提交审核结果?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .updateResultJudge({
              sequenceList: this.$route.query.sequenceList,
              sampleNum,
              resultJudge
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
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
    this.getList();
  }
};
</script>
