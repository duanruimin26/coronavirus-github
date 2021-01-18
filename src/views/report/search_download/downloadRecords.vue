<template>
  <div>
    <!-- 下载记录 -->
    <el-dialog
      title="下载记录"
      :visible.sync="options.visible"
      width="520px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="download-records"
    >
      <div class="dialog-content">
        <div class="records-info">
          <div class="info-row">
            <span class="label">下载次数：</span>
            <span>{{ count }}</span>
          </div>
          <div class="info-row">
            <span class="label">下载用户和下载时间详情：</span>
          </div>
          <div class="download-list" style="text-align: center;" v-if="dataList.length == 0">
            暂无数据
          </div>
          <div class="download-list" v-else>
            <div
              class="info-row ml20"
              v-for="(item, index) in dataList"
              :key="index"
            >
              <span class="mr20">{{ index+1 }}. {{ item.downloadUser }}</span>
              <span>{{ item.downloadTime }}</span>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="beforeClose">
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.download-records {
  .el-dialog__title {
    font-weight: bold;
  }
  .el-dialog__body {
    padding: 10px 20px 30px;

    .records-info {
      margin-bottom: 20px;

      .download-list{
        height: 200px;
        overflow-y: auto;
      }
    }

    .info-row {
      margin-bottom: 10px;

      .label {
        font-weight: bold;
        margin-right: 10px;
      }
    }

    .ml20 {
      margin-left: 20px;
    }

    .mr20 {
      margin-right: 20px;
    }
  }

  .dialog-footer {
    text-align: center;
  }
}
</style>

<script>
const { messageTips } = window.$app;

export default {
  name: "downloadRecords",
  props: {
    options: Object
  },
  data() {
    return {
      count: 0,
      dataList: []
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    getRecordsInfo() {
      this.api
        .getRecordsInfo({
          reportResId: this.options.currentRow.reportResId
        })
        .then(res => {
          if (res.resCode == "200") {
            this.count = res.count;
            this.dataList = [...res.dataList];
          } else {
            messageTips("error", res.resMsg);
          }
        });
    }
  },
  watch: {
    "options.visible"(val) {
      if (val) {
        this.getRecordsInfo();
      }else{
        this.count = 0;
        this.dataList = [];
      }
    }
  },
  mounted() {
    this.api = this.$api.report.searchDownload;
  }
};
</script>
