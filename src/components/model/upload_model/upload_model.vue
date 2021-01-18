<template>
  <div>
    <!-- 上传弹框 -->
    <el-dialog
      :title="i18n.modelContent.title"
      :visible.sync="options.visible"
      width="420px"
      :before-close="uploadToggle"
      custom-class="upload-model"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
    >
      <div class="upload-model-body pd-left-sm pd-right-sm clearfix">
        <div v-if="!percentageMax" class="upload-init">
          <div class="label fl">{{ i18n.modelContent.label }}</div>
          <div class="input-group fr">
            <c-upload-input :options="options"></c-upload-input>
            <p>{{ i18n.modelContent.tips }}</p>
          </div>
        </div>
        <div v-if="percentageMax" class="upload-progress">
          <div class="upload-progress-tip">
            {{ i18n.modelContent.progressTip }}
            <!-- 批量导入文件上传中，请稍等！ -->
          </div>
          <div class="mg-auto upload-progress-body">
            <c-progress :percentage="options.percentage"></c-progress>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          {{ $t("button").cancel }}
        </el-button>
        <el-button :disabled="options.disable" type="primary" @click="confirm">
          {{ $t("button").confirm }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less">
@import url("upload_model.less");
</style>

<script>
import { mixinUpload } from "@/mixins";

export default {
  name: "cUploadModel",
  mixins: [mixinUpload],
  props: {
    options: Object
  },
  methods: {
    setInit() {
      this.i18n = this.$t("uploadModel");
    },
    uploadToggle(done) {
      this.options.value = "";
      if (done) {
        done();
      }
    },
    confirm() {
      if (this.$root.isFn(this.options.confirm)) {
        this.options.confirm();
      }
    },
    cancel() {
      if (this.$root.isFn(this.options.cancel)) {
        this.options.cancel();
      } else {
        this.options.visible = false;
      }
    }
  },
  computed: {
    percentageMax() {
      return this.options.percentage > 0;
    }
  },
  created() {
    this.setInit();
  }
};
</script>
