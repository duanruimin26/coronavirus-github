import Menu from "./left_menu/left_menu.vue";
import Tags from "./tags/tags.vue";
import uploadGroup from "./upload_group/upload_group.vue";
import uploadLoading from "./upload_loading/upload_loading.vue";

// 弹框
import {
  tipModel,
  uploadModel
} from "./model";

export const leftMenu = Menu;
export const cTags = Tags;
export const cUploadGroup = uploadGroup;
export const cUploadLoading = uploadLoading;

export const cTipModel = tipModel;
export const cUploadModel = uploadModel;
