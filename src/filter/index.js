import Vue from "vue";
import { date } from "@/utils/tools";
import { analysisStatus, sampleQualityControl, verifyStatus, resultJudge } from "./filters";

Vue.filter("date", date);
Vue.filter("analysisStatus", analysisStatus);
Vue.filter("sampleQualityControl", sampleQualityControl);
Vue.filter("verifyStatus", verifyStatus);
Vue.filter("resultJudge", resultJudge);
