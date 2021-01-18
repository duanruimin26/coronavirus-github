import Vue from "vue";
import select from "./select/select.vue";
import upload from "./upload/upload.vue";
import uploadInput from "./upload_input/upload_input.vue";
import progress from "./progress/progress.vue";

Vue.component(select.name, select);
Vue.component(upload.name, upload);
Vue.component(uploadInput.name, uploadInput);
Vue.component(progress.name, progress);
