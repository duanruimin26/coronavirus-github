<template>
  <div>
    <!-- pdf报告预览 -->
    <el-dialog
      title="报告预览"
      :visible.sync="options.visible"
      width="800px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="report-preview"
    >
      <div class="dialog-content">
        <pdf
          ref="pdf"
          :src="options.pdfUrl"
          :page="pageNum"
          :rotate="pageRotate"
          @progress="loadedRatio = $event"
          @page-loaded="pageLoaded($event)"
          @num-pages="pageTotalNum = $event"
          @link-clicked="page = $event"
        >
        </pdf>
        <div class="tools">
          <el-button type="primary" @click="prePage" class="m10">
            上一页</el-button
          >
          <el-button type="primary" @click="nextPage" class="m10">
            下一页</el-button
          >
          <div class="page">{{ pageNum }}/{{ pageTotalNum }}</div>
          <el-button type="primary" @click="clock" class="m10">
            顺时针</el-button
          >
          <el-button type="primary" @click="counterClock" class="m10">
            逆时针</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.report-preview {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 0 20px 40px;

    .tools{
      display: flex;
      justify-content: center;
      align-items: center;

      .m10{
        margin: 0 10px;
      }

      .page{
        margin: 0 10px;
      }
    }
  }
}
</style>

<script>
import pdf from "vue-pdf";
// const { messageTips } = window.$app;

export default {
  name: "reportPreview",
  components: {
    pdf
  },
  props: {
    options: Object
  },
  data() {
    return {
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    // 上一页函数，
    prePage() {
      var page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      var page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90;
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    }
  },
  watch: {
    "options.visible"(val) {
      if (!val) {
        this.options.pdfUrl = "";
        this.pageNum = 1;
      }
    }
  },
  mounted() {}
};
</script>
