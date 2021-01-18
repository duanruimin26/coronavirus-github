import route from "@/route";
import { messageTips } from "./common";

const _toString = Object.prototype.toString;
const _isArr = Array.isArray;

export const isFn = fn => {
  if (!fn) return;
  return _toString.call(fn) === "[object Function]";
};

export const isObj = obj => {
  if (!obj) return;
  return _toString.call(obj) === "[object Object]";
};

export const isDef = v => v !== undefined && v !== null && v !== "";

export const isFalse = v => v === false;

export const isTrue = v => v === true;

export const isNum = num =>
  _toString.call(num) === "[object Number]" && !isNaN(num);

export const toNumber = v => {
  const _v = parseFloat(v);
  return isNaN(_v) ? v : _v;
};

export const toArray = data => (_isArr(data) && data) || [];

export const toObj = data => (isObj(data) && data) || {};

export const isValidDate = date => {
  if (!isDef(date)) {
    return;
  }
  const time = new Date(date);
  return time instanceof Date && !isNaN(time.getTime());
};

// 获取提交参数
export const getParams = (param, options = {}) => {
  if (!isObj(param)) {
    return param;
  }
  let flag = false;
  const values = Object.values(param);
  values.forEach((v, i) => {
    if (isObj(v)) {
      const value = _isArr(v.value) && v.value.includes("") ? [] : v.value;
      if (v.groupKey) {
        if (!options[v.groupKey]) {
          options[v.groupKey] = {};
        }
        if (v.key) {
          options[v.groupKey][v.key] = value;
        }
      } else if (v.key && !options[v.key]) {
        options[v.key] = value;
      } else {
        getParams(v, options);
      }
    }
    if (i === values.length - 1) {
      flag = true;
    }
  });

  if (flag) {
    return options;
  }
};

// 设置查询参数
export const setParams = (options, params) =>
  Object.entries(options).reduce((obj, [k, v]) => {
    if (isObj(v)) {
      if (v.key && v.hasOwnProperty("value") && params.hasOwnProperty(v.key)) {
        v.value = params[v.key];
      }
      obj[k] = setParams(v, params);
    } else {
      obj[k] = v;
    }
    return obj;
  }, {});

// 合并参数
export const assignParams = (params, local) => {
  if (!isObj(params)) {
    return;
  }

  let flag = false;
  const keys = Object.entries(local);
  keys.forEach(([k, v], i) => {
    if (isObj(v)) {
      if (!params[k]) {
        params[k] = {};
      }
      assignParams(params[k], v);
    } else if (!params.hasOwnProperty(k)) {
      params[k] = v;
    }
    if (i === keys.length - 1) {
      flag = true;
    }
  });

  if (flag) {
    return params;
  }
};

// 深拷贝
export const clone = data => {
  if (_isArr(data)) {
    return data.reduce((list, v) => {
      if (isObj(v) || _isArr(v)) {
        list.push(clone(v));
      } else {
        list.push(v);
      }
      return list;
    }, []);
  } else if (isObj(data)) {
    return Object.entries(data).reduce((obj, [k, v]) => {
      if (isObj(v) || _isArr(v)) {
        obj[k] = clone(v);
      } else {
        obj[k] = v;
      }
      return obj;
    }, {});
  }
  return data;
};

// 解析返回参数
export const resolveObj = options => {
  if (!isObj(options)) {
    return options;
  }
  return Object.entries(options).reduce((obj, [k, v]) => {
    if (isObj(v)) {
      Object.assign(obj, { ...resolveObj(v) });
    } else if (!obj.hasOwnProperty(k)) {
      obj[k] = v;
    }
    return obj;
  }, {});
};

// 格式化时间
export const date = (date, fm = "yyyy-MM-dd HH:mm:ss") => {
  if (!date) {
    return date;
  }
  const time = new Date(date);
  const fmConfig = {
    "M+": time.getMonth() + 1,
    "d+": time.getDate(),
    "H+": time.getHours(),
    "m+": time.getMinutes(),
    "s+": time.getSeconds()
  };
  if (/(y+)/.test(fm)) {
    fm = fm.replace(
      RegExp.$1,
      time
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    );
  }

  Object.entries(fmConfig).forEach(([k, v]) => {
    const reg = new RegExp(`(${k})`);
    if (reg.test(fm)) {
      fm = fm.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? v : ("00" + v).substr(("" + v).length)
      );
    }
  });

  return fm;
};

//时间格式化 2020-10-10
export const formatDate = date => {
  let dateTime = date
  let y = 1900+dateTime.getYear()
  let m = "0"+(dateTime.getMonth()+1)
  let d = "0"+dateTime.getDate()
  return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length)
}


//获取url参数
export const loaderGetParams = (params = {}) =>
  Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

//去重
export const noRepeat = (data, key) => {
  const options = data.reduce((obj, v) => {
    if (isObj(v)) {
      const _v = v[key];
      if (!obj[_v]) {
        obj[_v] = v;
      }
    } else if (!obj[v]) {
      obj[v] = v;
    }
    return obj;
  }, {});
  return Object.values(options);
};

// 获取重复
export const repeat = (option, option1, key) =>
  option.reduce((list, v) => {
    option1.forEach(_v => {
      if (isObj(v) && v[key] === _v[key]) {
        list.push(v);
      } else if (v === _v) {
        list.push(v);
      }
    });
    return list;
  }, []);

// 过滤
export const filterData = (options, value, key = "value") => {
  return options.filter(v => {
    if (isObj(v)) {
      return v[key] === value;
    }
    return v === value;
  });
};

// 排序
export const sortData = (data, k, flag = true) =>
  data.sort((p, n) => {
    const v = isObj(p) ? p[k] : p;
    const _v = isObj(n) ? n[k] : n;
    if (flag) {
      if (v > _v) {
        return -1;
      } else if (v < _v) {
        return 1;
      }
    } else {
      if (v < _v) {
        return -1;
      } else if (v > _v) {
        return 1;
      }
    }

    return 0;
  });

// 复制
export const copyText = tag => {
  const ele = document.querySelector(tag);
  ele.children[0].select();
  document.execCommand("copy");
};

// iframe下载
const formSub = method => {
  return (href, ...rest) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.name = 'downloadIframe';
    iframe.id = 'downloadIframe';
    document.body.appendChild(iframe);

    const [params = {}] = rest;
    const f = document.createElement("form");
    f.action = "/nadaa" + href;
    f.method = method;
    // f.target = "_blank";
    f.target = "downloadIframe";
    f.style.display = "none";
    Object.keys(params).forEach(k => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = k;
      input.value = params[k];
      f.appendChild(input);
    });
    document.body.appendChild(f);
    f.submit();

    iframe.addEventListener("load", function () {
      let contentWin = document.getElementById("downloadIframe").contentWindow;
      let backBodyText = contentWin.document.body.innerText;

      if (backBodyText.includes('登陆超时')) {
        messageTips("error", '请先登录账户！');
        route.replace({
          name: "login",
          query: {
            path: route.currentRoute.fullPath
          }
        });
      }

      iframe.remove();
    });

    setTimeout(() => {
      f.remove();
    }, 500);
  };
};

// 批量下载
const downLoadList = (src, index) => {
  setTimeout(() => {
    var ifEle = document.createElement("iframe");
    // ifEle.sandbox = "";
    ifEle.src = window.location.origin + window.$app.prefix + src;
    ifEle.style.display = "none";
    ifEle.id = "downLoadIfEle"
    document.body.appendChild(ifEle);

    ifEle.addEventListener("load", function() {
      let contentWin = document.getElementById("downLoadIfEle").contentWindow;
      let backBodyText = contentWin.document.body.innerText;

      if(backBodyText.includes('没有权限')){
        messageTips("error", '请先登录账户！');
        route.replace({
          name: "login",
          query: {
            path: route.currentRoute.fullPath
          }
        });
      }
    });

    setTimeout(() => {
      ifEle.remove();
    }, (index + 1) * 500);
  }, (index + 1) * 1000);
};

export const getDate = (time, fm = "yyyy") => {
  const _time = date(time || new Date(), fm);
  return _time.toString();
};

export const disabledNextDate = fm => time =>
  getDate(time, fm) > getDate("", fm);

export const disabledFirstDate = fm => time =>
  getDate(time, fm) < getDate("", fm);

// storage操作
const storage = {
  getSs(key) {
    const data = window.sessionStorage.getItem(key);
    if (isDef(data)) {
      return JSON.parse(data);
    }
  },
  setSs(key, data, time) {
    window.sessionStorage.setItem(key, JSON.stringify(data), time);
  },
  rmSs(key) {
    window.sessionStorage.removeItem(key);
  },
  getLs(key) {
    const data = window.localStorage.getItem(key);
    if (isDef(data)) {
      return JSON.parse(data);
    }
  },
  setLs(key, data, time) {
    window.localStorage.setItem(key, JSON.stringify(data), time);
  },
  rmLs(key) {
    window.localStorage.removeItem(key);
  },
  setCk(name, value, day = 0) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + day);
    const expiredays = day ? `;expires=${exdate.toGMTString()};path=/` : "";
    document.cookie = `${name}=${escape(value)}${expiredays}`;
  },
  getCk(name) {
    if (document.cookie.length > 0) {
      let start = document.cookie.indexOf(name + "=");
      if (start > -1) {
        start = start + name.length + 1;
        let end = document.cookie.indexOf(";", start);
        if (end === -1) end = document.cookie.length;
        return unescape(document.cookie.substring(start, end));
      }
    }
    return "";
  },
  rmCk(name) {
    const exp = new Date();
    exp.setTime(exp.getTime() - 1);
    const cval = storage.getCk(name);
    if (isDef(cval)) {
      document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
    }
  }
};

const round = (number, precision) =>
  Math.round(+number + "e" + precision) / Math.pow(10, precision);

const inputnum = (obj, limit = 2) => {
  obj.value += "";
  obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  obj.value = obj.value.replace(/^[0]+[\d]*$/gi, ""); //清楚开头为0
  obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
  obj.value = obj.value.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
  obj.value = obj.value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  const reg =
    limit === 2 ? /^(\\-)*(\d+)\.(\d\d).*$/ : /^(\\-)*(\d+)\.(\d\d\d\d\d).*$/;
  obj.value = obj.value.replace(reg, "$1$2.$3"); //只能输入两个小数
};

// 清空数据
export const emptyValue = params =>
  Object.entries(params).reduce((obj, [key, v]) => {
    obj[key] = Object.assign({}, v);
    if (v.hasOwnProperty("value")) {
      obj[key].value = _isArr(v.value) ? [""] : "";
    }
    return obj;
  }, {});

const joinArrLabel = (list = [], key, mark = ",") =>
  toArray(list)
    .filter(v => isObj(v))
    .filter(v => !!v[key])
    .map(v => v[key])
    .join(mark);

export const getAutoDate = (date, count) => {
  const time = new Date(date);
  time.setDate(count);
  const y = time.getFullYear();
  const m = time.getMonth() + 1;
  const d = time.getDate();
  return `${y}-${m < 10 ? "0" + m : m}-${d}`;
};

// 汉字排序
export const pinyinSort = (data, key) => {
  const list = toArray(data).filter(v => !!v);
  if (String.prototype.localeCompare) {
    return list.sort((v, _v) => {
      const first = (key ? v[key] : v) + "";
      const last = (key ? _v[key] : _v) + "";
      if (isDef(v)) {
        return first.localeCompare(last, "zh");
      } else {
        return first.localeCompare(last, "zh");
      }
    });
  }
  return sortData(list, key, false);
};

// 不足两位小数补齐两位，超过两位全部显示
export const toPoint = num => {
  if (!isNum(num)) return num;
  let [f, l] = num.toString().split(".");
  if (l) {
    if (l.length >= 2) {
      // l = Math.floor(toNumber(l) * 100) / 100;
      return `${f}.${l}`;//小数位超过三位全部显示
    }
    return `${f}.${l}0`;
  }
  return `${f}.00`;
};

//时间标签(今天/昨天/近7天/近30天)转起始日期
export const tagsToTime = (tag) => {
  const time = new Date();
  let endTime = formatDate(time);
  let startTime = "";

  switch (tag){
    case '1'://今天
      startTime = endTime;
      break;
    case '2'://昨天
      startTime = formatDate(new Date(time - 1000 * 60 * 60 * 24 * 1));
      endTime = startTime;
      break;
    case '3'://近7天
      startTime = formatDate(new Date(time - 1000 * 60 * 60 * 24 * 7));
      break;
    case '4'://近30天
      startTime = formatDate(new Date(time - 1000 * 60 * 60 * 24 * 30));
      break;
  }
  return [startTime, endTime]
}

export default {
  isFn,
  isObj,
  isFalse,
  isTrue,
  isNum,
  isDef,
  isValidDate,
  toNumber,
  toArray,
  toObj,
  getParams,
  setParams,
  assignParams,
  loaderGetParams,
  resolveObj,
  clone,
  date,
  repeat,
  noRepeat,
  filterData,
  copyText,
  sortData,
  getForm: formSub("get"),
  postForm: formSub("post"),
  ...storage,
  getDate,
  disabledNextDate,
  disabledFirstDate,
  inputnum,
  round,
  emptyValue,
  joinArrLabel,
  downLoadList,
  getAutoDate,
  pinyinSort,
  toPoint,
  tagsToTime
};
