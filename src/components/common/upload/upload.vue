<template>
  <div class="common-upload">
    <el-upload
      :action="setAction"
      :headers="options.headers"
      :multiple="options.multiple"
      :data="options.data"
      :accept="options.accept"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-change="handleChange"
      :on-progress="handleProgress"
      :before-upload="beforeAvatarUpload"
      :http-request="options.httpReq"
      :file-list="fileList"
      :auto-upload="false"
      :show-file-list="false"
      ref="upload"
    >
      <el-button
        slot="trigger"
        size="small"
        type="primary"
        class="upload-open"
        ref="upload"
      ></el-button>
      <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        class="upload-submit"
        @click="submit"
      ></el-button>
    </el-upload>
  </div>
</template>

<style lang="less" scoped>
@import url("./upload.less");
</style>

<script>
export default {
  name: "cUpload",
  props: {
    options: Object
  },
  data() {
    return {
      isFn: "",
      fileList: []
    };
  },
  methods: {
    // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
    handlePreview(file) {
      if (this.isFn(this.options.preview)) {
        this.options.preview(file);
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      if (this.isFn(this.options.remove)) {
        this.options.remove(file, fileList);
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeAvatarUpload(file) {
      if (this.isFn(this.options.beforeUpload)) {
        this.options.beforeUpload(file);
      }
    },
    // 文件上传时的钩子
    handleProgress(event, file, fileList) {
      if (this.isFn(this.options.progress)) {
        this.options.progress(event, file, fileList);
      }
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      if (this.isFn(this.options.success)) {
        this.options.success(response, file, fileList);
      }
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      if (this.isFn(this.options.error)) {
        this.options.error(err, file, fileList);
      }
    },
    handleChange(file, fileList) {
      if (this.isFn(this.options.change)) {
        this.options.change(file, fileList);
      }
    },
    submit() {
      this.$refs.upload.submit();
    }
  },
  computed: {
    setMultiple() {
      return this.$root.isTrue(this.options.multiple);
    },
    setAction() {
      return this.options.action || "javascript:;";
    }
  },
  created() {
    this.isFn = this.$root.isFn;
  }
};
</script>
