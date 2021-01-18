<template>
  <div class="sample-edit">
    <!-- 表单部分 -->
    <div class="main-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="sub-title">样本信息</div>
            <el-form-item label="样本编号" prop="sampleNum">
              <el-input v-model="ruleForm.sampleNum" placeholder="请输入样本编号" clearable :disabled="!!this.$route.query.sampId"></el-input>
            </el-form-item>
            <!-- <el-form-item label="原样本编号" prop="oldSampleNum">
              <el-input v-model="ruleForm.oldSampleNum" placeholder="请输入原样本编号" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="样本体积(mL)" prop="sampleVolume">
              <el-input v-model="ruleForm.sampleVolume" placeholder="请输入样本体积" clearable :disabled="isEditDisable"></el-input>
            </el-form-item>
            <el-form-item label="送检日期" prop="sendCheckDate">
              <el-date-picker
                v-model="ruleForm.sendCheckDate"
                type="date"
                placeholder="请输入送检日期"
                value-format="yyyy-MM-dd"
                :picker-options="sendCheckDatePickerOptions"
                :disabled="isEditDisable"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="接收日期" prop="receiveDate">
              <el-date-picker
                v-model="ruleForm.receiveDate"
                type="date"
                placeholder="请输入接收日期"
                value-format="yyyy-MM-dd"
                :picker-options="receiveDatePickerOptions"
                :disabled="isEditDisable"
              ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="测序日期" prop="seqCheckDate">
              <el-date-picker
                v-model="ruleForm.seqCheckDate"
                type="date"
                placeholder="请输入测序日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="备注" prop="remark" placeholder="请输入备注" clearable>
              <el-input v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="sub-title">受检者信息</div>
            <el-form-item label="姓名" prop="checkedName">
              <el-input v-model="ruleForm.checkedName" placeholder="请输入姓名" clearable :disabled="isEditDisable"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="checkedSex">
              <el-radio-group v-model="ruleForm.checkedSex" :disabled="isEditDisable">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄" prop="checkedAge" class="age-info">
              <el-input :disabled="isEditDisable" v-model="ruleForm.checkedAge" placeholder="请输入年龄" clearable class="age-value"></el-input>
              <el-select :disabled="isEditDisable" v-model="ruleForm.ageType" class="age-unit">
                <el-option label="岁" value="Y"></el-option>
                <el-option label="个月" value="M"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              
            </el-form-item>
            <el-form-item label="手机号" prop="checkedTel">
              <el-input :disabled="isEditDisable" v-model="ruleForm.checkedTel" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="sub-title">送检信息</div>
            <el-form-item label="送检医院" prop="sendCheckHospital">
              <el-input :disabled="isEditDisable" v-model="ruleForm.sendCheckHospital" placeholder="请输入送检医院" clearable></el-input>
            </el-form-item>
            <el-form-item label="送检科室" prop="sendCheckDept">
              <el-input :disabled="isEditDisable" v-model="ruleForm.sendCheckDept" placeholder="请输入送检科室" clearable></el-input>
            </el-form-item>
            <el-form-item label="送检医生" prop="sendCheckDoctor">
              <el-input :disabled="isEditDisable" v-model="ruleForm.sendCheckDoctor" placeholder="请输入送检医生" clearable></el-input>
            </el-form-item>
            <el-form-item label="门诊号" prop="outpatientNum">
              <el-input :disabled="isEditDisable" v-model="ruleForm.outpatientNum" placeholder="请输入门诊号" clearable></el-input>
            </el-form-item>
            <el-form-item label="住院号" prop="hospitaledNum">
              <el-input :disabled="isEditDisable" v-model="ruleForm.hospitaledNum" placeholder="请输入住院号" clearable></el-input>
            </el-form-item>
            <el-form-item label="床号" prop="bedNum">
              <el-input :disabled="isEditDisable" v-model="ruleForm.bedNum" placeholder="请输入床号" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="脑脊液常规" prop="cerebrospinalFluidRoutine">
              <el-input
                v-model="ruleForm.cerebrospinalFluidRoutine"
                placeholder="请输入脑脊液常规结果"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="CRP" prop="crp">
              <el-input v-model="ruleForm.crp" placeholder="请输入CRP结果" clearable></el-input>
            </el-form-item>
            <el-form-item label="PCT" prop="pct">
              <el-input v-model="ruleForm.pct" placeholder="请输入PCT结果" clearable></el-input>
            </el-form-item>
            <el-form-item label="培养结果" prop="cultureResults">
              <el-input v-model="ruleForm.cultureResults" placeholder="请输入培养结果" clearable></el-input>
            </el-form-item>
            <el-form-item label="鉴定结果" prop="identificationResults">
              <el-input v-model="ruleForm.identificationResults" placeholder="请输入鉴定结果" clearable></el-input>
            </el-form-item>
            <el-form-item label="镜检结果" prop="microscopicExaminationResults">
              <el-input
                v-model="ruleForm.microscopicExaminationResults"
                placeholder="请输入镜检结果"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="临床表现" prop="clinicalFeature">
              <el-input v-model="ruleForm.clinicalFeature" placeholder="请输入临床表现" clearable></el-input>
            </el-form-item> -->
          </el-col>
        </el-row>
        <div class="form-btns">
          <el-button :loading="submitLoading" type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less">
.sample-edit {
  .sub-title {
    margin-bottom: 16px;
    padding: 0 16px 16px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #e6e6e6;
  }
  .form-btns {
    margin-top: 20px;
    text-align: center;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #04b9b4;
    background: #04b9b4;
  }
  .el-radio__input.is-checked+.el-radio__label {
    color: #04b9b4;
  }

  .age-info{
    .el-form-item__content{
      display: flex;
        .age-value{
          width: 80%;
        }
        .age-unit{
          width: 20% !important;
        }
    }
  }
}
</style>

<script>
const { messageTips, getLs } = window.$app;

export default {
  data() {
    const validateSampleNum = (rule, value, callback) => {
      let sampleNumRegex = /[\u4E00-\u9FA5]/;
      if (value === "") {
        callback(new Error("样本编号不能为空!"));
      }else if (sampleNumRegex.test(value)) {
        callback(new Error("样本编号不能包含中文字符!"));
      } else {
        callback();
      }
    }

    const validateSampleVolume = (rule, value, callback) => {
      const sampleVolumeRegex = /^\d+(?=\.{0,1}\d+$|$)/;
      if (value === "") {
        callback(new Error("样本体积不能为空!"));
      }else if(!sampleVolumeRegex.test(value)){
        this.ruleForm.sampleVolume = "";
        callback(new Error("样本体积只能为数字!"));
      }else if (value < 0.2) {
        callback(new Error("样本体积不能小于0.2mL!"));
      }else if (value > 10) {
        callback(new Error("样本体积不能大于10mL!"));
      } else {
        callback();
      }
    }

    const validateSendCheckDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("送检日期不能为空!"));
      }else if ((this.ruleForm.receiveDate) && (value>this.ruleForm.receiveDate)) {
        callback(new Error("送检日期不能晚于接收日期!"));
      } else {
        callback();
      }
    }

    const validateReceiveDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("接收日期不能为空!"));
      }else if ((this.ruleForm.sendCheckDate) && (value<this.ruleForm.sendCheckDate)) {
        callback(new Error("接收日期不能早于送检日期!"));
      } else {
        callback();
      }
    }

    const validateCheckedName = (rule, value, callback) => {
      // let checkedNameRegex = /^[\u4E00-\u9FA5]+$/;
      if (value === "") {
        callback(new Error("姓名不能为空!"));
      // }else if (!checkedNameRegex.test(value)) {
      //   callback(new Error("姓名只能为中文字符!"));
      } else {
        callback();
      }
    }

    const validateCheckedTel = (rule, value, callback) => {
      let telNoRegex = /^1[3-9]\d{9}$/;
      if (value && (!telNoRegex.test(value))) {
        callback(new Error("手机号码格式错误!"));
      } else {
        callback();
      }
    }

    const validateCheckedAge = (rule, value, callback) => {
      const checkedAgeRegex = /^\d+(?=\.{0,1}\d+$|$)/;
      if(value && !checkedAgeRegex.test(value)){
        this.ruleForm.checkedAge = "";
        callback(new Error("年龄只能为数字!"));
      }else if (value && (this.ruleForm.ageType == "Y") && (value>200 || value<1)) {
        callback(new Error("单位为岁时，年龄范围为1-200！"));
      }else if (value && (this.ruleForm.ageType == "M") && (value>12 || value<0)) {
        callback(new Error("单位为个月时，年龄范围为0-12！"));
      } else {
        callback();
      }
    }

    // const that = this;

    return {
      sendCheckDatePickerOptions:{
        disabledDate(time) {
          // const date = new Date(that.ruleForm.receiveDate + " 00:00:00");
          // return that.ruleForm.receiveDate && (time.getTime() > date.getTime());
          return time.getTime() > Date.now();
        }
      },
      receiveDatePickerOptions:{
        disabledDate(time) {
          // const dates = new Date(that.ruleForm.sendCheckDate + " 00:00:00");
          // return that.ruleForm.sendCheckDate && (time.getTime() < dates.getTime()-1);
          return time.getTime() > Date.now();
        }
      },
      ruleForm: {
        sampleNum: "",
        // oldSampleNum: "",
        sampleVolume: "",
        sendCheckDate: "",
        // seqCheckDate: "",
        receiveDate: "",
        remark: "",
        checkedName: "",
        checkedSex: "",
        checkedAge: "",
        ageType: "Y",
        checkedTel: "",
        sendCheckHospital: "",
        sendCheckDept: "",
        sendCheckDoctor: "",
        outpatientNum: "",
        hospitaledNum: "",
        bedNum: "",
        // cerebrospinalFluidRoutine: "",
        // crp: "",
        // pct: "",
        // cultureResults: "",
        // identificationResults: "",
        // microscopicExaminationResults: "",
        // clinicalFeature: ""
      },
      rules: {
        sampleNum: [
          { required: true, validator: validateSampleNum, trigger: "blur" }
        ],
        sampleVolume: [
          { required: true, validator: validateSampleVolume, trigger: "blur" }
        ],
        sendCheckDate: [
          { required: true, validator: validateSendCheckDate,  trigger: "blur" }
        ],
        receiveDate: [
          { required: true, validator: validateReceiveDate,  trigger: "blur" }
        ],
        // seqCheckDate: [
        //   { required: true, message: "测序日期不能为空", trigger: "blur" }
        // ],
        checkedName: [
          {  required: true, validator: validateCheckedName, trigger: "blur" }
        ],
        checkedTel: [
          { validator: validateCheckedTel,  trigger: "blur" }
        ],
        checkedAge: [
          { validator: validateCheckedAge,  trigger: "blur" }
        ]
      },
      submitLoading: false
    };
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.submitLoading) {
            return;
          }
          this.submitLoading = true;

          //编辑
          if (this.$route.query.sampId) {
            this.api
              .editSampleDetail({ ...this.ruleForm })
              .then(res => {
                this.submitLoading = false;
                if (res.resCode == "200") {
                  messageTips("success", "保存成功！");
                  this.$router.push({
                    name: "sample.sampleInfo"
                  });
                } else {
                  messageTips("error", res.resMsg);
                }
              })
              .catch(() => {
                this.submitLoading = false;
              });
          } else {
            //新增
            this.api.cheeckSampleNum({
              sampleNum: this.ruleForm.sampleNum
            }).then(res => {
              if (res.isExist == 'N') {
                this.api
                  .saveSampleDetail({ ...this.ruleForm })
                  .then(res => {
                    this.submitLoading = false;
                    if (res.resCode == "200") {
                      messageTips("success", "保存成功！");
                      this.$router.push({
                        name: "sample.sampleInfo"
                      });
                    } else {
                      messageTips("error", res.resMsg);
                    }
                  })
                  .catch(() => {
                    this.submitLoading = false;
                  });
              } else {
                messageTips("error", "受检者样本信息已录入，请勿重新录入");
                this.submitLoading = false;
              }
            }).catch(()=>{
              this.submitLoading = false;
            })
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      if(this.$route.query.sampId){
        messageTips("success", "已重置为修改之前的内容！");
      }
    }
  },
  computed: {
    isEditDisable() {
      return this.$route.query.sampId && (this.ruleForm.anayStatus != '01');
    }
  },
  created() {
    this.api = this.$api.sample.sampleInfo;

    if (this.$route.query.sampId) {
      const sampleInfo = getLs("sampleInfo");
      this.ruleForm = { ...sampleInfo };
      this.ruleForm.ageType = this.ruleForm.ageType==="岁" ? "Y" : "M" ;
    }
  }
};
</script>
