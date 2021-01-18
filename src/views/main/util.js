const { sortData } = window.$app;

export const filterMenu = (roleMenus = [], allMenus = {}) => {
  if (!roleMenus.length) return roleMenus;

  const options = roleMenus
    .filter(v => v !== "overview")
    .reduce((obj, k) => {
      const keys = k.split(".");
      const [_f, _s] = keys;
      if (!obj[_f]) {
        obj[_f] = {};
      }

      if (keys.length > 1) {
        if (!obj[_f].children) {
          obj[_f].children = {};
        }

        if (_s && !obj[_f].children[_s]) {
          obj[_f].children[_s] = {};
        }
      }

      return obj;
    }, {});

  const menuOptions = Object.keys(options).reduce((obj, k) => {
    if (allMenus[k] && !options[k].children) {
      obj[k] = allMenus[k];
    } else {
      allMenus[k].children = Object.keys(allMenus[k].children).reduce(
        (_obj, _k) => {
          if (options[k].children[_k]) {
            _obj[_k] = allMenus[k].children[_k];
          }
          return _obj;
        },
        {}
      );
      obj[k] = allMenus[k];
    }
    return obj;
  }, {});

  const menus = Object.values(menuOptions).map(v => {
    if (v.children) {
      v.children = Object.values(v.children);
    }
    return v;
  });

  return {
    menus: sortData(menus, "order", false)
  };
};
