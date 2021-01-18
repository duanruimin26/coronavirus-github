export default () => ({
  menus: {
  systemSettings: {
      name: "systemSettings",
      iconClass: "icon-bsp",
      order: 2,
      redirect: "systemSettings.list",
      children: {
        systemParam:{
          name: "systemSettings.systemParam",
        },
        userManage: {
          name: "systemSettings.userManage",
        },
        roleManage: {
          name: "systemSettings.roleManage"
        },
        operationLogs: {
          name: "systemSettings.operationLogs"
        }
      }
    },
    sample: {
      name: "sample",
      iconClass: "icon-ct",
      order: 3,
      redirect: "sample.list",
      children: {
        subjectInfo: {
          name: "sample.subjectInfo",
        },
        sampleInfo: {
          name: "sample.sampleInfo"
        }
      }
    },
    analysis: {
      name: "analysis",
      iconClass: "icon-al",
      order: 4,
      redirect: "analysis.list",
      children: {
        dataAnalysis: {
          name: "analysis.dataAnalysis",
        },
        resultsReview: {
          name: "analysis.resultsReview"
        }
      }
    },
    report: {
      name: "report",
      iconClass: "icon-rm",
      order: 5,
      redirect: "report.list",
      children: {
        searchDownload: {
          name: "report.searchDownload",
        }
      }
    },
    systemLog: {
      name: "systemLog",
      iconClass: "icon-fm",
      order: 6,
      children: {
        list: {
          name: "systemLog.list",
        }
      }
    }
  }
});
