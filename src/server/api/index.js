import { prefix } from "../../meta_json";
import http from "../http";

import common from "./common";
import systemSettings from "./system_settings";
import sample from "./sample";
import analysis from "./analysis";
import report from "./report";
import systemLog from "./system_log";

const options = {
  prefix,
  http
};

export default {
  common: common(options),
  systemSettings: systemSettings(options),
  sample: sample(options),
  analysis: analysis(options),
  report: report(options),
  systemLog: systemLog(options)
};
