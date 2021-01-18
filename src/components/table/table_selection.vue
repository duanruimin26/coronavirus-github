<template>
  <!-- 选中部分 -->
  <div class="table-selection box-shadow-none">
    <table cellspacing="0" cellpadding="0" border="0" class="c-table-body">
      <thead>
        <tr>
          <th class="is-center is-leaf">
            <div class="table-checkbox">
              <el-checkbox
                v-model="checkAll.checked"
                :disabled="checkAll.disabled"
                @change="checkAllChange(checkAll.checked)"
                name="checkAll"
              ></el-checkbox>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="table-row"
          v-for="(item, index) in data"
          :key="index + '_select_' + getRandom()"
        >
          <td class="is-center is-leaf">
            <div class="table-checkbox">
              <el-checkbox
                v-model="item.checked"
                :class="item.checkClass || ''"
                :disabled="setDisable(item)"
                @change="handleCheckChange"
              ></el-checkbox>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { loaderCheckAllStatus } from "./util";

export default {
  name: "cTableSelection",
  props: {
    data: Array,
    selectable: Function,
    checkAllChange: Function,
    checkAll: Object
  },
  methods: {
    getRandom() {
      return Math.random() + "";
    },
    handleCheckChange() {
      const { allChecked, allDisabled, selections } = loaderCheckAllStatus(
        this.data,
        this.selectable
      );
      this.checkAll.checked = allChecked;
      this.checkAll.disabled = allDisabled;
      this.checkAllChange(this.checkAll.checked, false);
      this.$emit("check-change", selections);
    },
    clearSelection() {
      this.checkAll.checked = false;
      this.data.forEach(v => {
        v.checked = false;
      });
    },
    setDisable(item) {
      return this.selectable ? this.selectable(item) : item.disable;
    }
  }
};
</script>
