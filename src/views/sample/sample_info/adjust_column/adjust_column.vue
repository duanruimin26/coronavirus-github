<template>
  <div>
    <!-- 样本显示字段 -->
    <el-dialog
      title="样本显示字段"
      :visible.sync="options.visible"
      width="720px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="adjust-column"
    >
      <div class="dialog-content">
        <div class="column-select-box">
          <el-checkbox-group v-model="columnList">
            <div class="sub-title">样本信息</div>
            <el-checkbox
              v-for="sample in sampleColumns"
              :label="sample.value"
              :key="sample.value"
              :disabled="sample.disable"
              >{{ sample.label }}</el-checkbox
            >
            <div class="sub-title">受检者信息</div>
            <el-checkbox
              v-for="patient in patientColumns"
              :label="patient.value"
              :key="patient.value"
              :disabled="patient.disable"
              >{{ patient.label }}</el-checkbox
            >
            <div class="sub-title">临床检测信息</div>
            <el-checkbox
              v-for="clinical in clinicalColumns"
              :label="clinical.value"
              :key="clinical.value"
              :disabled="clinical.disable"
              >{{ clinical.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button @click="beforeClose">取消</el-button>
          <el-button type="primary" :disabled="submitDisable" @click="submit"
            >提交</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.adjust-column {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0 20px 20px;

    .sub-title {
      margin: 15px 0 10px;
      font-size: 14px;
      font-weight: bold;
    }

    .el-checkbox__inner:hover {
      border-color: #04b9b4;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #04b9b4;
      border-color: #04b9b4;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #f2f6fc;
      border-color: #dcdfe6;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #04b9b4;
    }

    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #c0c4cc;
    }
  }

  .dialog-footer {
    margin-top: 40px;
    text-align: center;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  name: "adjustColumn",
  props: {
    options: Object
  },
  data() {
    return {
      columnList: [],
      outFixArr: [],
      inMoveFixArr: [],
      sampleColumns: [
        {
          value: "sampleNum",
          label: "样本编号",
          disable: true
        },
        {
          value: "sampleVolume",
          label: "样本体积(mL)",
          disable: false
        },
        {
          value: "sendCheckDate",
          label: "送检日期",
          disable: true
        },
        {
          value: "receiveDate",
          label: "接收日期",
          disable: false
        },
        {
          value: "remark",
          label: "备注",
          disable: false
        }
      ],
      patientColumns: [
        {
          value: "checkedName",
          label: "姓名",
          disable: true
        },
        {
          value: "checkedSex",
          label: "性别",
          disable: false
        },
        {
          value: "checkedAge",
          label: "年龄",
          disable: false
        },
        {
          value: "ageType",
          label: "年龄单位",
          disable: false
        },
        {
          value: "checkedTel",
          label: "手机号",
          disable: false
        },
        
      ],
      clinicalColumns: [
        {
          value: "sendCheckHospital",
          label: "送检医院",
          disable: true
        },
        {
          value: "sendCheckDept",
          label: "送检科室",
          disable: false
        },
        {
          value: "sendCheckDoctor",
          label: "送检医生",
          disable: false
        },
        {
          value: "outpatientNum",
          label: "门诊号",
          disable: false
        },
        {
          value: "hospitaledNum",
          label: "住院号",
          disable: false
        },{
          value: "bedNum",
          label: "床号",
          disable: false
        }
        // {
        //   value: "cerebrospinalFluidRoutine",
        //   label: "脑脊液常规",
        //   disable: false
        // },
        // {
        //   value: "crp",
        //   label: "CRP",
        //   disable: false
        // },
        // {
        //   value: "pct",
        //   label: "PCT",
        //   disable: false
        // },
        // {
        //   value: "cultureResults",
        //   label: "培养结果",
        //   disable: false
        // },
        // {
        //   value: "identificationResults",
        //   label: "鉴定结果",
        //   disable: false
        // },
        // {
        //   value: "microscopicExaminationResults",
        //   label: "镜检结果",
        //   disable: false
        // },
        // {
        //   value: "clinicalFeature",
        //   label: "临床表现",
        //   disable: false
        // }
      ],
      submitDisable: false //提交按钮
    };
  },
  methods: {
    getColumnList() {
      this.api
        .viewColumn({
          pageCode: "sample"
        })
        .then(res => {
          if (res.resCode == "200") {
            this.outFixArr = res.field.outFix?res.field.outFix.split(","):[];
            this.inMoveFixArr = res.field.inMoveFix?res.field.inMoveFix.split(","):[];
            const inMoveAddArr = res.field.inMoveAdd?res.field.inMoveAdd.split(","):[];
            this.columnList = [...this.outFixArr, ...this.inMoveFixArr, ...inMoveAddArr];
          } else {
            messageTips("error", res.resMsg);
          }
        });
    },
    beforeClose() {
      this.options.visible = false;
    },
    submit() {
      if (this.submitDisable) {
        return;
      }
      this.submitDisable = true;

      const inMoveAddArr = this.columnList.filter(v=>{
        return !(this.outFixArr.includes(v) || this.inMoveFixArr.includes(v));
      })

      this.api
        .saveColumn({
          pageCode: "sample",
          inMoveAdd: inMoveAddArr.join(',')
        })
        .then(res => {
          if (res.resCode == "200") {
            messageTips("success", "保存成功！");
            this.options.visible = false;
            this.$parent.getColumnInfo();
          } else {
            messageTips("error", res.resMsg);
          }
          this.submitDisable = false;
        })
        .catch(() => {
          this.submitDisable = false;
        });
    }
  },
  watch: {
    "options.visible"(val) {
      if (val) {
        this.getColumnList();
      } else {
        this.columnList = [];
        this.outFixArr = [];
        this.inMoveFixArr = [];
      }
    }
  },
  mounted() {
    this.api = this.$api.sample.sampleInfo;
  }
};
</script>
