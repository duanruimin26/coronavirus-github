<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="options.visible"
      width="420px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="beforeClose"
      top="10vh"
    >
      <div class="tip-model-body clearfix">
        <div :class="iconClass()"></div>
        <div class="fl content">
          <div class="b mg-bottom-sm">
            {{ options.title }}
          </div>
          <div class="clearfix">
            <div class="fl">{{ options.contentLabel }}</div>
            <div class="fl content-text" v-html="options.content"></div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer ac">
        <el-button v-if="cancelShow" @click="cancel">
          {{ $t("button").cancel }}
        </el-button>
        <el-button :disabled="options.disable" type="primary" @click="confirm">
          {{ $t("button").confirm }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.content {
  width: calc(100% - 35px);

  // .content-text {
  //   width: calc(100% - 88px);
  // }
}
</style>

<script>
export default {
  name: "cTipModel",
  props: {
    options: Object
  },
  methods: {
    confirm() {
      if (this.$root.isFn(this.options.confirm)) {
        if(this.options.operateType){
          this.options.confirm(this.options.operateType);
        }else{
          this.options.confirm();
        }
      }
    },
    cancel() {
      if (this.$root.isFn(this.options.cancel)) {
        this.options.cancel();
      }
      this.options.visible = false;
    },
    iconClass() {
      let className = "icon-warning-fill";
      switch (this.options.type) {
        case "success":
          className = "icon-success-fill";
          break;
        case "error":
          className = "icon-error-fill";
          break;
      }
      return `icon fl ${className}`;
    },
    beforeClose(done) {
      if (this.$root.isFn(this.options.cancel)) {
        this.options.cancel();
      }
      done();
    }
  },
  computed: {
    cancelShow() {
      if (this.options.cancelShow === undefined) {
        return true;
      }
      return this.options.cancelShow;
    }
  }
};
</script>
