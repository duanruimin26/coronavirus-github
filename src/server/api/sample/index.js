import sampleInfo from "./sample_info";
import subjectInfo from "./subject_info";

export default options => ({
  sampleInfo: sampleInfo(options),
  subjectInfo: subjectInfo(options)
});
