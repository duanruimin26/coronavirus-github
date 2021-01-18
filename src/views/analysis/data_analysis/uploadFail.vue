<template>
  <!-- 数据解析批量上传失败选择弹框 -->
  <el-dialog
    title="文件上传失败"
    :visible.sync="visible"
    width="420px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    class="upload-fail-model"
    top="10vh"
  >
    <div class="content-box">
      <div>{{errMessage}}</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">取消</el-button>
      <el-button type="primary" @click="submit('1')"
        >部分导入</el-button
      >
      <el-button type="primary" @click="submit('2')"
        >全部导入</el-button
      >
    </span>
  </el-dialog>
</template>

<style lang="less">
.upload-fail-model{
  .el-dialog__footer{
    padding-bottom: 30px;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  name: "uploadFail",
  props: {
    options: Object,
    visible: Boolean,
    errMessage: String
  },
  data() {
    return {
      
    };
  },
  methods: {
    beforeClose() {
      this.$emit("close", false);

      this.options.percentage = 0;
      this.options.value = "";
      this.options.disable = false;
      this.options.visible = false;
    },
    submit(uploadFailFlag) {
      if (this.options.disable) {
        return;
      }

      this.options.disable = true;

      this.$emit("close", false);

      this.options.percentage = 1;
      this.fileParams = {
        files: [{
          name: "file",
          file: this.options.file
        },{
          name: "type",
          value: uploadFailFlag
        }],
        progress: this.$parent.uploadProgress(this.options)
      };

      this.api
        .upload(this.fileParams)
        .then(res => {
          if (res.resCode == "200") {
            this.options.percentage = 100;
            setTimeout(() => {
              messageTips(
                "success",
                this.$t("upload").success.replace(
                  "{name}",
                  this.options.file.name
                )
              );
              this.options.visible = false;
              this.options.percentage = 0;
              this.options.value = "";
              this.options.disable = false;
              this.$parent.search();
            }, 1000);
          } else {
            messageTips("error", res.resMsg);
            this.options.percentage = 0;
            this.options.value = "";
            this.options.disable = false;
          }
        })
        .catch(() => {
          this.options.visible = false;
          this.uploadOptions.percentage = 0;
          this.uploadOptions.disable = false;
        });
    }
  },
  mounted() {
    this.api = this.$api.analysis.dataAnalysis;
  }
};
</script>
