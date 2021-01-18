<template>
  <div>
    <!-- 质控结果 -->
    <el-dialog
      title="样本质控结果"
      :visible.sync="options.visible"
      width="1100px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="quality-control"
    >
      <div class="dialog-content">
        <div style="font-weight:bold;margin-bottom: 10px;">PC质控结果</div>
        <el-table
          :data="tableData1"
          :span-method="objectSpanMethod"
          class="more-info-table"
          v-loading="searchDisable"
          border
        >
          <el-table-column
            prop="chineseName"
            label="中文名"
            min-width="140"
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
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="Rrange"
            label="R值参考范围"
            min-width="110"
          ></el-table-column>
          <el-table-column
            prop="drawPotency"
            label="提取浓度(ng/μL)"
            min-width="136"
          ></el-table-column>
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
          <el-table-column prop="reads" min-width="140">
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
              <span :class="scope.row.reads < 4 ? 'red' : ''">{{
                scope.row.reads
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="qThirty" min-width="96">
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
          <!-- <el-table-column prop="sampleQualityControl" label="样本质控" min-width="80">
            <template slot-scope="slot">{{
              slot.row.sampleQualityControl | sampleQualityControl
            }}</template> -->
          <!-- </el-table-column> -->
          <el-table-column prop="innerParam" min-width="70">
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
          <el-table-column
            prop="libraryId"
            label="文库编码"
            min-width="80"
          ></el-table-column>
        </el-table>
        <div style="margin-top: 20px;font-weight: bold;margin-bottom: 10px;">
          NC质控结果
        </div>
        <el-table
          :data="tableData2"
          :span-method="objectSpanMethod"
          class="more-info-table"
          v-loading="searchDisable"
          border
        >
          <el-table-column
            prop="chineseName"
            label="中文名"
            min-width="140"
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
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="Rrange"
            label="R值参考范围"
            min-width="110"
          ></el-table-column>
          <el-table-column
            prop="drawPotency"
            label="提取浓度(ng/μL)"
            min-width="136"
          ></el-table-column>
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
          <el-table-column prop="reads" min-width="140">
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
              <span :class="scope.row.reads < 4 ? 'red' : ''">{{
                scope.row.reads
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="qThirty" min-width="96">
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
          <!-- <el-table-column prop="sampleQualityControl" label="样本质控" min-width="80">
            <template slot-scope="slot">{{
              slot.row.sampleQualityControl | sampleQualityControl
            }}</template> -->
          <!-- </el-table-column> -->
          <el-table-column prop="innerParam" min-width="70">
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
          <el-table-column
            prop="libraryId"
            label="文库编码"
            min-width="80"
          ></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="beforeClose">
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.quality-control {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
  }

  .more-info-table th.is-leaf {
    background: #f5f5f5;
  }

  .dialog-footer {
    margin-top: 20px;
    text-align: center;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  name: "qualityControlResult",
  props: {
    options: Object
  },
  data() {
    return {
      searchDisable: false,
      tableData1: [],
      tableData2: [],
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
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column && columnIndex >= 4 && columnIndex <= 10) {
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
    getAllInfo() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      this.api
        .getDetailPcAndNc({
          bcId: this.options.currentRow.bcId
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            this.pathogensTypes.forEach((v,index) => {
              this.tableData1.push({
                chineseName: v,
                Rrange: this.Rranges[index]
              });

              this.tableData2.push({
                chineseName: v,
                Rrange: this.Rranges[index]
              });
            });
            this.tableData1.forEach((v, i) => {
              Object.assign(v, res.dataList[0]);
              v.analyzeNineUnit = res.dataList[0].analyzeNine[i];
              v.mValueUnit = res.dataList[0].mValue.split(",")[i];
            });
            this.tableData2.forEach((v, i) => {
              Object.assign(v, res.dataList[1]);
              v.analyzeNineUnit = res.dataList[1].analyzeNine[i];
              v.mValueUnit = res.dataList[1].mValue.split(",")[i];
            });
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {
          this.searchDisable = false;
        });
    }
  },
  watch: {
    "options.visible"(val) {
      if (val) {
        this.getAllInfo();
      } else {
        this.tableData1 = [];
        this.tableData2 = [];
      }
    }
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
  }
};
</script>
