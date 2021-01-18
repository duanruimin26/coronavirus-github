export const analysisStatus = val => {
  let analysisStatusText = "";
  switch (val) {
    case "01":
      analysisStatusText = "未分析";
      break;
    case "02":
      analysisStatusText = "分析中";
      break;
    case "03":
      analysisStatusText = "已分析";
      break;
    // case "04":
    //   analysisStatusText = "分析失败";
    //   break;
    default:
      analysisStatusText = "- -";
  }
  return analysisStatusText;
};

export const sampleQualityControl = val => {
  let sampleQualityControlText = "";
  switch (val) {
    case "00":
      sampleQualityControlText = "- -";
      break;
    case "01":
      sampleQualityControlText = "通过";
      break;
    case "02":
      sampleQualityControlText = "不通过";
      break;
  }
  return sampleQualityControlText;
};

export const verifyStatus = val => {
  let verifyStatusText = "";
  switch (val) {
    case "00":
      verifyStatusText = "- -";
      break;
    case "01":
      verifyStatusText = "未审核";
      break;
    case "02":
      verifyStatusText = "已审核";
      break;
  }
  return verifyStatusText;
};

export const resultJudge = val => {
  let resultJudgeText = "";
  switch (val) {
    case "00":
      resultJudgeText = "- -";
      break;
    case "01":
      resultJudgeText = "通过";
      break;
    case "02":
      resultJudgeText = "不通过";
      break;
  }
  return resultJudgeText;
};

export const ageType = val => {
  let ageTypeText = "";
  switch (val) {
    case "Y":
      ageTypeText = "年";
      break;
    case "M":
      ageTypeText = "个月";
      break;
  }
  return ageTypeText;
};