<template>
  <div>
    <div class="clearfix upload-group mb10">
      <el-input
        :readonly="setLabelRd"
        :disabled="options.label.disabled"
        v-model="options.label.value"
        :placeholder="options.label.placeholder"
        class="small-input fl"
      ></el-input>
      <i class="line fl"></i>
      <c-upload-input
        class="mg-bottom-xs fl"
        :options="options.upload"
        :upload-tip="uploadTip"
      ></c-upload-input>
      <i
        v-if="options.addIcon"
        @click="addClick"
        class="com-icon icon-one-add fl"
      ></i>
      <i
        v-if="options.deleteIcon"
        @click="deleteClick"
        class="com-icon el-icon-delete red fl ml10"
      ></i>
      <span
        v-if="options.deleteText && options.upload.value"
        @click="deleteSelected"
        class="red fl ml10"
        style="cursor: pointer;"
      >删除已选</span>
      <a
        v-if="options.addTip"
        class="purple v-align-m ml10 fl add-text"
        href="javascript:;"
        @click="addTipClick ? addTipClick(options) : addClick()"
      >
        {{ options.addTip }}
      </a>
      <a
        v-if="columns"
        class="purple v-align-m ml10 fl add-text"
        href="javascript:;"
        @click="options.listShow = !options.listShow"
      >
        {{ setListToggleLabel }}
      </a>
      <a
        v-if="options.listShow"
        :class="setDelClass + ' v-align-m ml10 fl add-text'"
        href="javascript:;"
        @click="deleteAll"
      >
        删除已选
      </a>
    </div>
    <c-table
      v-if="columns && options.listShow"
      :columns="columns"
      :data="options.data"
      :action-width="actionWidth"
      border
      :height="250"
      size="mini"
    >
      <template v-slot:body="scope">
        <div v-if="scope.column.key === 'unitPrice'">
          {{ scope.row[scope.column.key] | toPoint }}
        </div>
      </template>    
      <template v-slot:action="scope">
        <a
          @click="deleteServiceLine(scope.row)"
          :class="setDelClass"
          href="javascript:;"
        >
          {{ $t("button").delete }}
        </a>
      </template>
    </c-table>
  </div>
</template>

<style lang="less" scoped>
@import url("upload_group.less");
</style>

<script>
import cTable from "../table/table";
const { isFalse, isFn } = window.$app;

export default {
  name: "cUploadGroup",
  components: { cTable },
  props: {
    options: Object,
    uploadTip: String,
    columns: Array,
    actionWidth: Number,
    addTipClick: Function,
    tableDelete: Function
  },
  methods: {
    addClick() {
      if (isFn(this.options.add)) {
        this.options.add();
      }
    },
    deleteClick() {
      if (isFn(this.options.delete)) {
        this.options.delete(this.options.index);

        //将该附件关联的已选服务线释放出来

        if (!this.options.data.length || this.options.disabled) {
          return;
        }
        const serviceLineIds = this.options.data.map(v => v.id);
        this.tableDelete(this.options, serviceLineIds);
      }
    },
    deleteSelected(){
      this.options.deleteSelect();
    },
    deleteServiceLine(row) {
      if (this.options.disabled) {
        return;
      }
      this.tableDelete(this.options, row);
    },
    deleteAll() {
      if (!this.options.data.length || this.options.disabled) {
        return;
      }
      const ids = this.options.data.map(v => v.id);
      this.tableDelete(this.options, ids);
    }
  },
  computed: {
    setLabelRd() {
      return !isFalse(this.options.label.readonly);
    },
    setListToggleLabel() {
      return this.options.listShow ? "收起列表" : "展开列表";
    },
    setDelClass() {
      return this.options.disabled ? "disable" : "red";
    }
  }
};
</script>
