<template>
  <div>
    <!-- 关于 -->
    <el-dialog
      title="关于"
      :visible.sync="options.visible"
      width="680px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="10vh"
      class="download-records"
    >
      <div class="dialog-content">
        <div class="system-info">
          <div class="system-info-group">
            <div class="system-info-item">
              <div class="label">生信服务器IP：</div>
              <div class="content">{{ baseData.conectIp }}</div>
            </div>
            <div class="system-info-item">
              <div class="label">生信服务器端口：</div>
              <div class="content">{{ baseData.conectPort }}</div>
            </div>
            <div class="system-info-item">
              <div class="label">生信服务器状态：</div>
              <div class="content" v-loading="loading">{{ serverStatus }}</div>
            </div>
          </div>

          <div class="system-info-item">
            <div class="label">医疗器械注册证编号：</div>
            <div class="content">{{ baseData.registerNum }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">软件名称：</div>
            <div class="content">{{ baseData.softName }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">软件型号：</div>
            <div class="content">{{ baseData.softType }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">软件版本：</div>
            <div class="content">{{ baseData.softVersion }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">服务电话：</div>
            <div class="content">{{ baseData.serverTel }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">
              公司地址：
            </div>
            <div class="content">
              {{ baseData.companyAddr }}
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

    .system-info {
      margin-top: 10px;
      padding: 25px 30px 30px;
      border-radius: 8px;
      background: #ffffff;

      .system-info-group {
        margin-bottom: 14px;
        border-bottom: 1px solid #e7e7e7;
      }

      .system-info-item {
        display: flex;
        width: 500px;
        margin-bottom: 14px;
        padding-left: 40px;
        line-height: 22px;
        justify-content: space-between;

        .content {
          min-width: 50px;
          text-align: right;
        }
      }
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
      baseData: {
        conectIp: "",
        conectPort: "",
        registerNum: "",
        softName: "",
        softType: "",
        softVersion: "",
        serverTel: "",
        companyAddr: ""
      },
      serverStatus: "",
      loading: false
    };
  },
  methods: {
    beforeClose() {
      this.options.visible = false;
    },
    getIndexSystemParam() {
      this.api
        .getIndexSystemParam()
        .then(res => {
          if (res.resCode == "200") {
            this.baseData = { ...res.baseData };
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    },
    getServerStatus() {
      this.api
        .getServerStatus()
        .then(res => {
          if (res.resCode == "200") {
            this.loading = false;
            this.serverStatus = res.status;
          } else {
            this.loading = false;
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {});
    }
  },
  watch: {
    "options.visible"(val) {
      if (val) {
        this.getIndexSystemParam();
        this.getServerStatus();
      } else {
        this.baseData = {};
        this.loading = false;
        this.serverStatus = "";
      }
    }
  },
  mounted() {
    this.api = this.$api.systemSettings.systemParam;
  }
};
</script>
