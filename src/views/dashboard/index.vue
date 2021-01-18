<template>
  <div class="dash-board">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="report-data">
        <div class="report-data-item">
          <div class="report-data-icon sample"></div>
          <div>
            <p class="num">{{ form.sampleCount }}</p>
            <p class="label">样本数量</p>
          </div>
        </div>
        <div class="report-data-item">
          <div class="report-data-icon analysis"></div>
          <div>
            <p class="num">{{ form.dataDirCount }}</p>
            <p class="label">分析目录</p>
          </div>
        </div>
        <div class="report-data-item">
          <div class="report-data-icon review"></div>
          <div>
            <p class="num">{{ form.verifyCount }}</p>
            <p class="label">待审核结果</p>
          </div>
        </div>
        <div class="report-data-item">
          <div class="report-data-icon report"></div>
          <div>
            <p class="num">{{ form.reportCount }}</p>
            <p class="label">报告</p>
          </div>
        </div>
      </div>
      <!-- <div class="system-info">
        <div class="system-info-group">
          <div class="system-info-item">
            <div class="label">生信服务器IP：</div>
            <div class="content">{{ form.baseData.conectIp }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">生信服务器端口：</div>
            <div class="content">{{ form.baseData.conectPort }}</div>
          </div>
          <div class="system-info-item">
            <div class="label">生信服务器状态：</div>
            <div class="content" v-loading="loading">{{ serverStatus }}</div>
          </div>
        </div>

        <div class="system-info-item">
          <div class="label">医疗器械注册证编号：</div>
          <div class="content">{{ form.baseData.registerNum }}</div>
        </div>
        <div class="system-info-item">
          <div class="label">软件名称：</div>
          <div class="content">{{ form.baseData.softName }}</div>
        </div>
        <div class="system-info-item">
          <div class="label">软件型号：</div>
          <div class="content">{{ form.baseData.softType }}</div>
        </div>
        <div class="system-info-item">
          <div class="label">软件版本：</div>
          <div class="content">{{ form.baseData.softVersion }}</div>
        </div>
        <div class="system-info-item">
          <div class="label">服务电话：</div>
          <div class="content">{{ form.baseData.serverTel }}</div>
        </div>
        <div class="system-info-item">
          <div class="label">
            公司地址：
          </div>
          <div class="content">
            {{ form.baseData.companyAddr }}
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="less">
.dash-board {
  color: #222222;
  .main-content {
    padding: 0 !important;
    background: #f0f0f0 !important;
  }

  .report-data {
    display: flex;
    align-items: center;
    padding-left: 70px;
    height: 150px;
    font-size: 14px;
    border-radius: 0px 8px 8px 8px;
    background: #fff;

    .report-data-item {
      display: flex;
      align-items: center;
      width: 230px;

      .report-data-icon {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        margin-right: 14px;
      }

      .sample {
        background: center center no-repeat
          url("../../assets/images/components/left_menu/sample_icon.png")
          #04b9b4;
        background-size: 20px 20px;
      }

      .analysis {
        background: center center no-repeat
          url("../../assets/images/components/left_menu/analysis_icon.png")
          #04b9b4;
        background-size: 20px 20px;
      }

      .review {
        background: center center no-repeat
          url("../../assets/images/components/left_menu/reviews_icon.png")
          #04b9b4;
        background-size: 20px 20px;
      }

      .report {
        background: center center no-repeat
          url("../../assets/images/components/left_menu/report_icon.png")
          #04b9b4;
        background-size: 20px 20px;
      }

      .num {
        line-height: 42px;
        font-size: 42px;
      }
      .label {
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }

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
</style>

<script>
const { messageTips } = window.$app;

export default {
  data() {
    return {
      form: {
        sampleCount: 0,
        dataDirCount: 0,
        verifyCount: 0,
        reportCoount: 0,
        baseData: {
          conectIp: "",
          conectPort: "",
          registerNum: "",
          softName: "",
          softType: "",
          softVersion: "",
          serverTel: "",
          companyAddr: "",
        }
      },
      serverStatus: "",
      loading: true
    };
  },
  methods: {
    getIndexSystemParam() {
      this.api
        .getIndexSystemParam()
        .then(res => {
          if (res.resCode == "200") {
            this.form = { ...res };
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
  mounted() {
    this.api = this.$api.systemSettings.systemParam;
    this.getIndexSystemParam();
    this.getServerStatus();
  }
};
</script>
