import { MessageBox, Message } from "element-ui";
import { isObj, isFalse, isDef, toNumber, toArray } from "./tools";
const _toString = Object.prototype.toString;

const buttonLoadingShow = modelInstance => text => {
  modelInstance.confirmButtonLoading = true;
  modelInstance.confirmButtonText = text;
};

const buttonLoadingHide = modelInstance => () => {
  modelInstance.confirmButtonLoading = false;
};

// 限制提示框弹出个数
export const getMessageLan = (limit = 1) =>
  document.getElementsByClassName("el-message").length >= limit;

// 信息弹框
export const messageBox = ({
  title,
  message,
  type,
  className,
  confirm,
  cancel,
  close
}) => {
  const app = window.$app;
  const i18n = app.$t("button");
  const confirmClick = isObj(confirm) ? confirm.click : confirm;
  const confirmOptions = isObj(confirm) ? confirm : {};
  const cancelClick = isObj(cancel) ? cancel.click : cancel;
  const cancelOptions = isObj(cancel) ? cancel : {};

  MessageBox({
    title,
    message,
    type,
    customClass: "common-model " + className,
    showConfirmButton: !isFalse(confirmOptions.show),
    confirmButtonText: confirmOptions.text || i18n.confirm,
    showCancelButton: !isFalse(cancelOptions.show),
    cancelButtonText: cancelOptions.text || i18n.cancel,
    dangerouslyUseHTMLString: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    beforeClose: (action, modelInstance, done) => {
      const options = {
        modelInstance,
        done
      };
      if (action === "confirm") {
        if (confirmClick) {
          confirmClick({
            buttonLoadingShow: buttonLoadingShow(modelInstance),
            ...options
          });
        } else {
          done();
        }
      } else if (cancelClick) {
        cancelClick({
          buttonLoadingHide: buttonLoadingHide(modelInstance),
          ...options
        });
      } else {
        done();
      }
    }
  }).catch(() => {
    if (close) {
      close();
    }
  });
};

export const messageTips = (type, message = "") => {
  if (getMessageLan(3)) {
    return;
  }
  Message({
    message,
    type
  });
};

const setMessage = ({
  messageBox: { title, text1, text2, text3 }
},e={msg:''}) => `<p class="title">${title}</p>
<p>${text1}</p>
<p>${text2}</p>
<p>${text3}</p>
<p class="red">${e.msg}</p>
`;

export const uploadError = (e={msg:''}) => {
  messageBox({
    title: window.$app.$t("common").tip,
    message: setMessage(window.$app.$t("uploadModel"),e),
    type: "warning",
    className: "",
    confirm: {
      text: window.$app.$t("button").gotIt
    },
    cancel: {
      show: false
    }
  });
};

// 获取上传组件按钮
export class getUploadButton {
  constructor(el) {
    this.el = el;
  }
  getOpenBtn() {
    return this.el.querySelector(".upload-open");
  }
  getSubmitBtn() {
    return this.el.querySelector(".upload-submit");
  }
  getBtns() {
    return {
      open: this.getOpenBtn(),
      submit: this.getSubmitBtn()
    };
  }
}

// 上传文件变更事件
export const uploadChange = (reg, message) => option => {
  return file => {
    if (isDef(reg) && !reg.test(file.name)) {
      window.$app.messageTips("error", message);
      return;
    }
    let { raw } = file;
    const fileType = _toString.call(raw);
    if (fileType === "[object Blob]") {
      raw = new File([raw], raw.name, {
        type: raw.type
      });
    }
    option.file = raw;
    option.value = raw.name;
    option.id = "0";
  };
};

// 设置下拉选项
export const setItems = (data, ...config) => {
  const [flag = true, lk, vk] = config;
  if (isObj(data)) {
    return Object.entries(data).map(([value, label]) => ({
      label,
      value: flag ? value : toNumber(value)
    }));
  }
  return data.reduce((list, v, i) => {
    if (!isObj(v)) {
      list.push({
        label: v,
        value: flag ? (v === "全部" ? "" : v) : i
      });
    } else {
      list.push(
        Object.assign(v, {
          label: v[lk],
          value: vk ? v[vk] : v[lk]
        })
      );
    }
    return list;
  }, []);
};

// 设置列表头基本信息
export const setColumns = (columns, wAuto = true) =>
  Object.entries(columns).map(([key, value]) => {
    const obj = {
      key
    };
    if (isObj(value)) {
      Object.assign(obj, value, {
        width: value.width
          ? value.width
          : wAuto
          ? value.label.length * 15 + 20
          : ""
      });
    } else {
      obj.label = value;
      obj.width = wAuto ? value.length * 15 + 20 : "";
    }
    return obj;
  });

// 设置全部选项
export const concatDef = (data = [], value = "") =>
  [
    {
      label: window.$app.$t("common").all,
      value
    }
  ].concat(data);

// 过滤tabs页签
export const loaderTabs = tabs =>
  Object.entries(tabs).map(([k, v]) => ({
    label: v,
    name: k
  }));

export const loaderPage = ({ limit, page }, data) =>
  toArray(data).reduce((list, v, i) => {
    if (
      (page === 1 && limit > i) ||
      (page * limit > i && (page - 1) * limit <= i)
    ) {
      list.push(v);
    }
    return list;
  }, []);



export default {
  getMessageLan,
  messageBox,
  messageTips,
  uploadError,
  getUploadButton,
  uploadChange,
  setItems,
  setColumns,
  concatDef,
  loaderTabs,
  loaderPage
};
