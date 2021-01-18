<template>
  <div>
    <el-dialog
      ref="uploadLoading"
      :visible.sync="options.visible"
      width="300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="upload-loading"
      top="30vh"
      @closed="closed"
    >
      <div class="upload-progress-body">
        <p class="orange ac mb10">{{ setContent }}</p>
        <c-progress :percentage="options.percentage"></c-progress>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
@import url("upload_loading.less");
</style>

<script>
export default {
  name: "cUploadLoading",
  props: {
    options: Object,
    content: String
  },
  methods: {
    closed() {
      if (this.$root.isFn(this.options.closed)) {
        this.options.closed();
      }
    }
  },
  computed: {
    setContent() {
      return this.content || "上传中，请稍等！";
    }
  }
};
</script>
