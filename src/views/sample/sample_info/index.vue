<template>
  <div class="sample-info">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
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
          <span class="label">送检日期</span>
          <el-radio-group
            @change="sendCheckTagsChange"
            v-model="params.sendCheckDateTags"
            size="small"
            class="timeRang"
          >
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="2">昨天</el-radio-button>
            <el-radio-button label="3">近7天</el-radio-button>
            <el-radio-button label="4">近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="params.sendCheckDate"
            @change="sendCheckDateChange"
            class="width2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <el-button icon="el-icon-delete" @click="reset"
            >清空搜索条件</el-button
          >
          <el-button type="primary" icon="el-icon-search" @click="search"
            >搜索</el-button
          >
        </div>
        <!-- <div class="params-row"> -->
          <!-- <span class="label">测序日期</span>
          <el-radio-group
            @change="seqCheckTagsChange"
            v-model="params.seqCheckDateTags"
            size="small"
            class="timeRang"
          >
            <el-radio-button label="1">今天</el-radio-button>
            <el-radio-button label="2">昨天</el-radio-button>
            <el-radio-button label="3">近7天</el-radio-button>
            <el-radio-button label="4">近30天</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="params.seqCheckDate"
            @change="seqCheckDateChange"
            class="width2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker> -->
        <!-- </div> -->
      </div>

      <div class="operate-btns">
        <el-button type="danger" @click="batchDelete">删除</el-button>
        <el-button icon="el-icon-plus" @click="newSample">添加样本</el-button>
        <el-button icon="el-icon-download" @click="downloadTemplate"
          >下载模板</el-button
        >
        <el-button icon="el-icon-upload2" @click="uploadToggle"
          >批量导入</el-button
        >
        <el-button class="fr" @click="adjustColumn">更多</el-button>
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
            fixed
            min-width="162"
          ></el-table-column>
          <el-table-column
            prop="checkedName"
            label="受检者姓名"
            min-width="92"
          ></el-table-column>
          <el-table-column
            prop="sendCheckDate"
            label="送检日期"
            sortable
            min-width="102"
          ></el-table-column>
          <el-table-column
            prop="sendCheckHospital"
            label="送检医院"
            min-width="160"
          ></el-table-column>
          <el-table-column
            v-for="column in columnList"
            :prop="column.value"
            :label="column.label"
            min-width="120"
            :key="column.value"
          >
            <!-- <template slot-scope="scope">
              <span v-if="column.label == 'ageType'">{{scope.row.ageType | ageType}}</span>
              <span v-else>{{scope.row[column.label]}}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                class="table-operate-btns"
                type="primary"
                :disabled="scope.row.useStatus === 'used'"
                @click="editInfo(scope.row)"
                >编辑</el-button
              >
              <el-button
                class="table-operate-btns"
                type="danger"
                :disabled="scope.row.useStatus === 'used'"
                @click="deleteInfo(scope.row)"
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

    <!-- 上传弹框 -->
    <c-upload-model :options="uploadOptions"></c-upload-model>

    <!-- 样本显示字段调整 -->
    <adjust-column :options="adjustColumnOption"></adjust-column>
  </div>
</template>

<script>
import { cUploadModel } from "@/components";
import { mixinUpload } from "@/mixins";
import adjustColumn from "./adjust_column/adjust_column";
const {
  tagsToTime,
  setLs,
  toArray,
  toObj,
  messageTips,
  uploadChange,
  uploadError
} = window.$app;

export default {
  components: {
    cUploadModel,
    adjustColumn
  },
  mixins: [mixinUpload],
  data() {
    return {
      params: {
        sampleNum: null,
        checkedName: null,
        sendCheckHospital: null,
        sendCheckDate: "",
        // seqCheckDate: "",
        sendCheckDateTags: "",
        // seqCheckDateTags: "",
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
      deleteSampleNumList: [],
      uploadOptions: {
        visible: false,
        value: "",
        accept: ".xls,.xlsx",
        disable: false,
        percentage: 0,
        reg: /(.xls|.xlsx)$/
      },
      adjustColumnOption: {
        currentRow: {},
        visible: false
      },
      columnList: [],
      allColumnList: [
        {
          value: "receiveDate",
          label: "接收日期"
        },
        {
          value: "sampleVolume",
          label: "样本体积(mL)"
        },
        {
          value: "remark",
          label: "备注"
        },
        {
          value: "checkedSex",
          label: "性别"
        },
        {
          value: "checkedAge",
          label: "年龄"
        },
        {
          value: "ageType",
          label: "年龄单位"
        },
        {
          value: "checkedTel",
          label: "手机号"
        },
        {
          value: "sendCheckDept",
          label: "送检科室"
        },
        {
          value: "sendCheckDoctor",
          label: "送检医生"
        },
        // {
        //   value: "cerebrospinalFluidRoutine",
        //   label: "脑脊液常规"
        // },
        // {
        //   value: "crp",
        //   label: "CRP"
        // },
        // {
        //   value: "pct",
        //   label: "PCT"
        // },
        // {
        //   value: "cultureResults",
        //   label: "培养结果"
        // },
        // {
        //   value: "identificationResults",
        //   label: "鉴定结果"
        // },
        // {
        //   value: "microscopicExaminationResults",
        //   label: "镜检结果"
        // },
        // {
        //   value: "clinicalFeature",
        //   label: "临床表现"
        // },
        {
          value: "outpatientNum",
          label: "门诊号"
        },
        {
          value: "hospitaledNum",
          label: "住院号"
        },{
          value: "bedNum",
          label: "床号"
        }
      ]
    };
  },
  methods: {
    sendCheckTagsChange() {
      this.params.sendCheckDate = "";
    },
    // seqCheckTagsChange() {
    //   this.params.seqCheckDate = "";
    // },
    sendCheckDateChange() {
      this.params.sendCheckDateTags = "";
    },
    // seqCheckDateChange() {
    //   this.params.seqCheckDateTags = "";
    // },
    getColumnInfo() {
      this.api
        .viewColumn({
          pageCode: "sample"
        })
        .then(res => {
          if(res.resCode == "200"){
            const inMoveAddArr = res.field.inMoveAdd.split(",");
            this.columnList = this.allColumnList.filter(v=>inMoveAddArr.includes(v.value));
            this.getList();
          }else{
            messageTips("error", res.resMsg);
          }
        }).catch(()=>{

        })
    },
    getList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      let [sendCheckDateStart, sendCheckDateEnd] = this.params.sendCheckDateTags
        ? tagsToTime(this.params.sendCheckDateTags)
        : this.params.sendCheckDate
        ? this.params.sendCheckDate
        : [null, null];

      // let [seqCheckDateStart, seqCheckDateEnd] = this.params.seqCheckDateTags
      //   ? tagsToTime(this.params.seqCheckDateTags)
      //   : this.params.seqCheckDate
      //   ? this.params.seqCheckDate
      //   : [null, null];

      this.api
        .getList({
          pageSize: this.params.pageSize,
          currentPage: this.params.currentPage,
          sampleNum: this.params.sampleNum || null,
          checkedName: this.params.checkedName || null,
          sendCheckHospital: this.params.sendCheckHospital || null,
          sendCheckDateStart,
          sendCheckDateEnd,
          // seqCheckDateStart,
          // seqCheckDateEnd
        })
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(data);
            this.tableData.forEach(v=>{
              v.ageType = v.ageType==="Y" ? "岁" : "个月" ;
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
    //表格选择
    handleSelectionChange(val) {
      this.deleteSampleNumList = val.map(v => v.sampleNum);
    },
    //批量删除
    batchDelete() {
      if(this.deleteSampleNumList.length == 0){
        messageTips("error", "请选择要删除的样本信息！");
        return;
      }

      this.$confirm("此操作将永久删除样本信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteSample({
              sampleNumList: this.deleteSampleNumList
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
    //添加样本
    newSample() {
      this.$router.push({
        name: "sample.sampleInfo.edit"
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
        files: {
          name: "file",
          file: this.uploadOptions.file
        },
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
    adjustColumn(row){
      this.adjustColumnOption.currentRow = row;
      this.adjustColumnOption.visible = true;
    },
    editInfo(row) {
      setLs("sampleInfo", row);
      this.$router.push({
        name: "sample.sampleInfo.edit",
        query: {
          sampId: row.sampId
        }
      });
    },
    deleteInfo(row) {
      this.$confirm("此操作将永久删除样本信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.api
            .deleteSample({
              sampleNumList: [row.sampleNum]
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
    selectDisable(row) {
      if (row.useStatus !== "used") {
        return true;
      }
    }
  },
  mounted() {
    this.api = this.$api.sample.sampleInfo;
    this.getColumnInfo();

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
