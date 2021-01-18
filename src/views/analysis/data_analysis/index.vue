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
          <span class="label">创建人</span>
          <el-input
            type="text"
            placeholder="创建人"
            class="width0"
            v-model="params.creator"
            clearable
          ></el-input>
          <span class="label">分析状态</span>
          <el-select
            v-model="params.anayStatus"
            clearable
            placeholder="请选择"
            class="width1"
          >
            <el-option
              v-for="item in anayStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <span class="label">样本质控</span>
          <el-select
            v-model="params.sampleQualityControl"
            clearable
            placeholder="请选择"
            class="width1"
          >
            <el-option
              v-for="item in sampleQualityControlList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <span class="label">审核状态</span>
          <el-select
            v-model="params.verifyStatus"
            clearable
            placeholder="请选择"
            class="width1"
          >
            <el-option
              v-for="item in verifyStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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

      <div class="operate-btns">
        <!-- <el-button type="danger" @click="batchDelete">删除</el-button> -->
        <!-- <el-button icon="el-icon-plus" @click="newAnalysis">分析配置</el-button> -->
        <!-- <el-button @click="doCancel">作废</el-button> -->
        <el-button icon="el-icon-download" @click="downloadTemplate"
          >下载模板</el-button
        >
        <el-button icon="el-icon-upload2" @click="uploadToggle"
          >批量导入</el-button
        >
      </div>

      <div class="table-data">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          v-loading="searchDisable"
          :span-method="objectSpanMethod"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column
            type="selection"
            align="center"
            width="50"
          ></el-table-column> -->
          <el-table-column
            prop="sequenceList"
            label="测序目录"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="creator"
            label="创建人"
            min-width="86"
          ></el-table-column>
          <el-table-column label="创建时间" width="156">
            <template slot-scope="scope">{{
              scope.row.createTime | date
            }}</template>
          </el-table-column>
          <el-table-column label="分析状态" min-width="96">
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
          <el-table-column label="样本质控" min-width="96">
            <template slot-scope="scope">{{
              scope.row.sampleQualityControl | sampleQualityControl
            }}</template>
          </el-table-column>
          <el-table-column label="审核状态" min-width="96">
            <template slot-scope="scope">{{
              scope.row.verifyStatus | verifyStatus
            }}</template>
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
          <!-- <el-table-column> -->
          <!-- <el-table-column width="160">
              <template slot-scope="scope">
                <el-button
                  class="table-operate-btns"
                  type="primary"
                  @click="viewBcRow(scope.row)"
                  >详情</el-button
                >
                <el-button
                  class="table-operate-btns export-btn"
                  v-if="scope.row.anayStatus == '03'"
                  @click="exportByDataDir(scope.row)"
                  >导出</el-button
                >
              </template>
            </el-table-column> -->
          <el-table-column width="280" label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                  class="table-operate-btns"
                  type="primary"
                  @click="viewRow(scope.row)"
                  >详情</el-button
                > -->
              <el-button
                class="table-operate-btns"
                type="danger"
                :disabled="scope.row.anayStatus == '03'"
                @click="deleteRow(scope.row)"
                >删除</el-button
              >
              <el-button
                class="table-operate-btns export-btn"
                @click="analysisRow(scope.row)"
                :loading="scope.row.analysisLoading"
                :disabled="scope.row.analysisDisable || scope.row.anayStatus != '01'"
                >分析</el-button
              >
              <el-button
                class="table-operate-btns"
                type="primary"
                :disabled="scope.row.isDelete == 'C' || scope.row.anayStatus != '03' || (scope.row.anayStatus == '03' && scope.row.partVerify == 'Y')"
                @click="cancelRow(scope.row)"
                >作废</el-button
              >
              <!-- <el-button
                class="table-operate-btns export-btn"
                v-if="scope.row.anayStatus == '03'"
                @click="exportByDataDir(scope.row)"
                >导出</el-button
              > -->
            </template>
          </el-table-column>
          <!-- </el-table-column> -->
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

    <!-- 上传弹框 -->
    <c-upload-model :options="uploadOptions"></c-upload-model>

    <upload-fail
      :options="uploadOptions"
      :visible="uploadFailVisible"
      :errMessage="errMessage"
      @close="closeUploadFail"
    ></upload-fail>
  </div>
</template>

<script>
import { cUploadModel } from "@/components";
import { mixinUpload } from "@/mixins";
import uploadFail from "./uploadFail.vue";
const {
  tagsToTime,
  toArray,
  toObj,
  messageTips,
  uploadChange,
  uploadError
} = window.$app;

export default {
  components: {
    cUploadModel,
    uploadFail
  },
  mixins: [mixinUpload],
  data() {
    return {
      params: {
        sequenceList: "",
        creator: "",
        anayStatus: "",
        // sampleQualityControl: "",
        verifyStatus: "",
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
      anayStatusList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "01",
          label: "未分析"
        },
        {
          value: "02",
          label: "分析中"
        },
        {
          value: "03",
          label: "已分析"
        }
      ],
      // sampleQualityControlList: [
      //   {
      //     value: "",
      //     label: "所有状态"
      //   },
      //   {
      //     value: "00",
      //     label: "- -"
      //   },
      //   {
      //     value: "01",
      //     label: "通过"
      //   },
      //   {
      //     value: "02",
      //     label: "不通过"
      //   }
      // ],
      verifyStatusList: [
        {
          value: "",
          label: "所有状态"
        },
        {
          value: "00",
          label: "- -"
        },
        {
          value: "01",
          label: "未审核"
        },
        {
          value: "02",
          label: "已审核"
        }
      ],
      tableData: [],
      totalCount: 0,
      searchDisable: false,
      chooseSequenceId: [],
      uploadOptions: {
        visible: false,
        value: "",
        accept: ".xls,.xlsx",
        disable: false,
        percentage: 0,
        reg: /(.xls|.xlsx)$/
      },
      uploadFailVisible: false,
      errMessage: ""
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
          createTimeStart,
          createTimeEnd,
          sequenceList: this.params.sequenceList || null,
          creator: this.params.creator || null,
          anayStatus: this.params.anayStatus || null,
          // sampleQualityControl: this.params.sampleQualityControl || null,
          verifyStatus: this.params.verifyStatus || null,
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            const tableList = toArray(data);

            this.tableData = [];
            tableList.forEach(v => {
              v.nadaaDataDirBcList.forEach(item => {
                this.tableData.push(
                  Object.assign(
                    { ...v },
                    {
                      sampleQualityControl: item.sampleQualityControl,
                      verifyStatus: item.verifyStatus,
                      judgeName: item.judgeName,
                      bcLibraryId: item.bcLibraryId
                    }
                  )
                );
              });
            });

            this.tableData.forEach(item => {
              this.$set(item, "analysisLoading", false);
              this.$set(item, "analysisDisable", false);
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
    //表格选择
    handleSelectionChange(val) {
      this.chooseSequenceId = val.map(v => v.seqId);
    },
    //批量删除
    batchDelete() {
      if (this.chooseSequenceId.length == 0) {
        messageTips("error", "请选择要删除的数据目录！");
        return;
      }

      this.$confirm("此操作将永久删除数据目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteAnalysis({
              seqIdList: this.chooseSequenceId
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
    doCancel() {},
    newAnalysis() {
      this.$router.push({
        name: "analysis.dataAnalysis.addAnalysis"
      });
    },
    //下载模版
    downloadTemplate() {
      this.api.downloadTemplate();
    },
    //批量导入
    uploadToggle() {
      this.uploadOptions.visible = !this.uploadOptions.visible;
      this.uploadOptions.title = "文件导入";
      this.uploadOptions.tips = "上传文件仅支持Excel文件！";
      this.uploadOptions.value = "";
      this.uploadOptions.percentage = 0;
    },
    //上传取消
    uploadCancel() {
      if (
        this.uploadOptions.percentage > 0 &&
        this.$store.state.axiosPromiseCancel.length
      ) {
        this.$store.state.axiosPromiseCancel.forEach(c => {
          c && c();
        });
        this.uploadOptions.disable = false;
        messageTips("success", "取消文件上传成功");
      }
      this.uploadOptions.visible = false;
      this.uploadOptions.value = "";
    },
    //上传确认
    uploadConfirm() {
      if (!this.uploadOptions.value) {
        messageTips("error", "请选择excel格式的文件");
        return;
      }
      if (this.uploadOptions.disable) {
        return;
      }
      this.uploadOptions.disable = true;

      this.uploadOptions.percentage = 1;
      this.fileParams = {
        files: [
          {
            name: "file",
            file: this.uploadOptions.file
          },
          {
            name: "type",
            value: "0"
          }
        ],
        progress: this.uploadProgress(this.uploadOptions)
      };

      this.api
        .upload(this.fileParams)
        .then(res => {
          if (res.resCode == "200") {
            this.uploadOptions.percentage = 100;
            setTimeout(() => {
              messageTips(
                "success",
                this.$t("upload").success.replace(
                  "{name}",
                  this.uploadOptions.file.name
                )
              );
              this.uploadOptions.visible = false;
              this.uploadOptions.value = "";
              this.uploadOptions.disable = false;
              this.search();
            }, 1000);
          } else if (res.resCode == "300") {
            this.uploadOptions.disable = false;
            this.uploadFailVisible = true;
            this.errMessage = res.resMsg;
          } else {
            messageTips("error", res.resMsg);
            this.uploadOptions.percentage = 0;
            this.uploadOptions.value = "";
            this.uploadOptions.disable = false;
          }
        })
        .catch(e => {
          if (!e.msg.includes("没有权限")) {
            this.uploadOptions.percentage = 0;
            uploadError(e);
            this.uploadOptions.disable = false;
          }
        });
    },
    closeUploadFail(val) {
      this.uploadFailVisible = val;
    },
    viewBcRow(row) {
      this.$router.push({
        name: "analysis.dataAnalysis.dataAnalysisDetail",
        query: {
          id: row.id,
          sequenceList: row.sequenceList,
          bcLibraryId: row.bcLibraryId
        }
      });
    },
    viewRow(row) {
      this.$router.push({
        name: "analysis.dataAnalysis.dataAnalysisDetail",
        query: {
          id: row.id,
          sequenceList: row.sequenceList
        }
      });
    },
    deleteRow(row) {
      this.$confirm("此操作将永久删除数据目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteAnalysis({
              seqIdList: [row.seqId]
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
    cancelRow(row) {
      this.$confirm("此操作将作废该数据目录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .cancelAnalysis({
              seqId: row.seqId
            })
            .then(res => {
              if (res.resCode == "200") {
                messageTips("success", "作废成功");
                this.search();
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          messageTips("info", "取消作废！");
        });
    },
    exportByDataDir(row) {
      this.api.exportByDataDir({
        sequenceList: row.sequenceList
      });
    },
    analysisRow(row) {
      if (row.analysisLoading) {
        return;
      }
      this.$set(row, "analysisLoading", true);
      this.$set(row, "analysisDisable", true);

      this.api
        .doAnalysis({
          seqId: row.seqId,
          sequenceList: row.sequenceList
        })
        .then(res => {
          if (res.resCode == "200") {
            messageTips("success", res.resMsg);
            this.search();
          } else {
            messageTips("error", res.resMsg);
          }
          row.analysisLoading = false;
        })
        .catch(() => {
          row.analysisLoading = false;
        });
    },
    headFirst({ row, column, rowIndex }) {
      if (row && column && rowIndex === 1) {
        return { display: "none" };
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let sequenceListNum = 0;
      if (
        (column && columnIndex >= 0 && columnIndex <= 3) ||
        columnIndex == 8
      ) {
        for (var i = 0; i < this.tableData.length; i++) {
          if (
            row.sequenceList == this.tableData[i].sequenceList
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
              this.tableData[rowIndex - 1].sequenceList &&
            this.tableData[rowIndex].seqId == this.tableData[rowIndex - 1].seqId
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

    // 上传
    this.uploadOptions.change = uploadChange(
      this.uploadOptions.reg, // /(.xls|.xlsx)$/
      this.$t("fileSelectTips").xls // 请选择excel格式的文件
    )(this.uploadOptions);
    this.uploadOptions.cancel = this.uploadCancel;
    this.uploadOptions.confirm = this.uploadConfirm;
  }
};
</script>
