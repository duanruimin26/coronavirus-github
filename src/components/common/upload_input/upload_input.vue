<template>
  <div class="upload-input" @click="handlerClick">
    <el-tooltip
      :disabled="!uploadTip"
      effect="dark"
      :content="uploadTip"
      placement="top"
    >
      <el-input
        :readonly="setUploadRd"
        v-model="options.value"
        :disabled="options.disabled"
        :placeholder="$t('placeholder').select"
      >
        <el-button slot="append" icon="el-icon-upload2"></el-button>
      </el-input>
    </el-tooltip>
    <c-upload :options="options"></c-upload>
  </div>
</template>

<style lang="less">
@import url("upload_input.less");
</style>

<script>
export default {
  name: "cUploadInput",
  props: {
    options: Object,
    uploadTip: String
  },
  methods: {
    handlerClick() {
      if (this.options.disabled) {
        return;
      }
      this.uploadBtns.open.click();
    }
  },
  computed: {
    setUploadRd() {
      return !this.$root.isFalse(this.options.readonly);
    }
  },
  mounted() {
    this.uploadBtns = new this.$root.getUploadButton(this.$el).getBtns();
  }
};
</script>
