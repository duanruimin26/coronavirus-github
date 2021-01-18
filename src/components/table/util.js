export const getActionClass = flag =>
  `table-action ${flag ? "box-shadow-none" : ""}`;

export const getSelectionClass = flag =>
  `table-selection ${flag ? "box-shadow-none" : ""}`;

export const loaderCheckAllStatus = (data, disableFn) => {
  const { disables, selections } = data.reduce(
    (obj, v) => {
      if (disableFn) {
        v.disable = disableFn(v);
      }
      if (v.disable) {
        obj.disables.push(v);
      } else if (v.checked) {
        obj.selections.push(v);
      }
      return obj;
    },
    {
      disables: [],
      selections: []
    }
  );
  return {
    allChecked: data.length
      ? data.length - disables.length === selections.length
      : false,
    allDisabled: data.length === disables.length,
    selections
  };
};
