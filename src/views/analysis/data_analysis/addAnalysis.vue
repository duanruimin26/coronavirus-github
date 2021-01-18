<template>
  <div class="add-analysis">
    <!-- 表单部分 -->
    <div class="main-content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <div class="analysis-config-items">
            <div class="sub-title">分析配置</div>
            <el-form-item label="数据目录" prop="sequenceList">
              <el-input v-model="ruleForm.sequenceList" placeholder="请输入测序数据目录" clearable></el-input>
            </el-form-item>
            <el-form-item label="样本编号" prop="sampleNum">
              <el-input v-model="ruleForm.sampleNum" placeholder="请输入样本编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="样本提取浓度" prop="drawPotency">
              <el-input v-model="ruleForm.drawPotency" placeholder="请输入样本提取浓度" clearable></el-input>
            </el-form-item>
            <el-form-item label="样本建库浓度" prop="createLibPotency">
              <el-input v-model="ruleForm.createLibPotency" placeholder="请输入样本建库浓度" clearable></el-input>
            </el-form-item>
            <el-form-item label="文库编号" prop="libraryId">
              <el-input v-model="ruleForm.libraryId" placeholder="请输入文库编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="接头i7" prop="connetHeadSeven">
              <el-input v-model="ruleForm.connetHeadSeven" placeholder="请输入接头i7信息" clearable></el-input>
            </el-form-item>
            <el-form-item label="接头i5" prop="connetHeadFive">
              <el-input v-model="ruleForm.connetHeadFive" placeholder="请输入接头i5信息" clearable></el-input>
            </el-form-item>
        </div>
        <div class="form-btns">
          <el-button :loading="submitLoading" type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="less">
.add-analysis {
  .analysis-config-items {
    width: 400px;
    margin-bottom: 30px;
  }
  .sub-title {
    margin-bottom: 16px;
    padding: 0 10px 16px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #e6e6e6;
  }
  .form-btns {
    margin-top: 20px;
    padding-left: 20px;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  data() {
    return {
      ruleForm: {
        sequenceList: "",
        sampleNum: "",
        drawPotency: "",
        createLibPotency: "",
        libraryId: "",
        connetHeadSeven: "",
        connetHeadFive: ""
      },
      rules: {
        sequenceList: [
          { required: true, message: "数据目录不能为空", trigger: "blur" }
        ],
        sampleNum: [
          { required: true, message: "样本编号不能为空", trigger: "blur" }
        ],
        drawPotency: [
          { required: true, message: "样本提取浓度不能为空", trigger: "blur" }
        ],
        createLibPotency: [{ required: true, message: "样本建库浓度不能为空", trigger: "blur" }],
        libraryId: [{ required: true, message: "文库编号不能为空", trigger: "blur" }],
        connetHeadSeven: [{ required: true, message: "接头i7不能为空", trigger: "blur" }],
        connetHeadFive: [{ required: true, message: "接头i5不能为空", trigger: "blur" }]
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

          this.api
            .saveAnalysis({ ...this.ruleForm })
            .then(res => {
              this.submitLoading = false;
              if (res.resCode == "200") {
                messageTips("success", "保存成功！");
                this.$router.push({
                  name: "analysis.dataAnalysis"
                });
              } else {
                messageTips("error", res.resMsg);
              }
            })
            .catch(() => {
              this.submitLoading = false;
            });
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
  }
};
</script>
