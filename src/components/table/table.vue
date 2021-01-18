<template>
  <div class="c-table ">
    <!-- 头部 -->
    <div v-if="height" class="table-header">
      <table cellspacing="0" cellpadding="0" border="0" class="c-table-body">
        <thead>
          <tr>
            <th v-if="isSelection" class="is-center is-leaf">
              <div :style="setWidthStyle(50)" class="table-checkbox">
                <el-checkbox
                  v-model="checkAll.checked"
                  :disabled="checkAll.disabled"
                  @change="checkAllChange(checkAll.checked)"
                ></el-checkbox>
              </div>
            </th>
            <th
              v-for="(column, index) in columns"
              :key="index + '_top_' + getRandom()"
              :class="'is-leaf ' + (bdCenter ? 'is-center' : '')"
            >
              <div
                :style="setWidthStyle(column.width, index)"
                class="cell"
                ref="topThDiv"
              >
                {{ column.label }}
              </div>
            </th>
            <th
              v-if="actionWidth"
              :class="'is-leaf ' + (acCenter ? 'is-center' : '')"
            >
              <div class="cell" :style="setWidthStyle(actionWidth)">
                {{ $t("common").action }}
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <!--  -->
    <div class="table-container" ref="container">
      <!-- 选中部分 -->
      <c-table-selection
        v-if="isSelection"
        ref="selection"
        :data="data"
        :check-all="checkAll"
        :check-all-change="checkAllChange"
        @check-change="checkChange"
        :selectable="selectable"
      ></c-table-selection>
      <!-- 主体部分 -->
      <div @scroll="scroll" ref="content" class="table-body">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="c-table-body"
          :style="setTableStyle()"
          ref="body"
        >
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index + '_th_' + getRandom()"
                :class="'is-leaf ' + (bdCenter ? 'is-center' : '')"
              >
                <div
                  :style="setWidthStyle(column.width, index, 'min-')"
                  class="cell"
                  ref="thDiv"
                >
                  {{ column.label }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="(row, index) in data"
              :key="index + '_data_' + getRandom()"
              ref="trDiv"
              @click="handleCurrentChange(row, $event)"
            >
              <td
                v-for="(column, ci) in columns"
                :key="ci + index + getRandom()"
                :class="'is-leaf ' + (bdCenter ? 'is-center' : '')"
              >
                <div :style="setWidthStyle(column.width, ci)" class="ws cell">
                  <slot name="body" :row="row" :column="column" :index="index">
                    <span :title="row[column.key]">{{ row[column.key] }}</span>
                  </slot>
                </div>
              </td>
            </tr>
            <tr class="table-row" v-if="!data.length">
              <td class="is-center" style="border:none" :colspan="emptyColspan">
                <div class="empty" :style="setEmptyStyle()">
                  暂无数据
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作部分 -->
      <div
        v-if="actionWidth"
        class="table-action box-shadow-none"
        ref="action"
        :style="setWidthStyle(actionWidth)"
      >
        <table cellspacing="0" cellpadding="0" border="0" class="c-table-body">
          <thead>
            <tr>
              <th :class="'is-leaf ' + (acCenter ? 'is-center' : '')">
                <div class="cell" :style="setWidthStyle(actionWidth)">
                  {{ $t("common").action }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              v-for="(row, index) in data"
              :key="index + '_ac_' + getRandom()"
            >
              <td :class="'is-leaf ' + (acCenter ? 'is-center' : '')">
                <div class="cell" :style="setWidthStyle(actionWidth)">
                  <slot name="action" :row="row" :index="index"></slot>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import url("table.less");
</style>

<script>
import cTableSelection from "./table_selection";
import {
  getActionClass,
  getSelectionClass,
  loaderCheckAllStatus
} from "./util";

export default {
  name: "cTable",
  components: {
    cTableSelection
  },
  props: {
    columns: {
      default: () => [],
      type: Array
    },
    data: {
      default: () => [],
      type: Array
    },
    type: String,
    actionWidth: Number,
    acCenter: {
      default: false,
      type: Boolean
    },
    bdCenter: {
      default: false,
      type: Boolean
    },
    height: Number,
    border: {
      default: false,
      type: Boolean
    },
    size: String,
    selectable: Function
  },
  data() {
    return {
      checkAll: {
        checked: false,
        disabled: false
      },
      realWidth: 80,
      actionW: 0,
      autoW: true
    };
  },
  methods: {
    checkAllChange(all, flag = true) {
      this.checkAll.checked = all;
      if (flag) {
        const selections = this.data.filter(v => {
          v.checked = !v.disable && this.checkAll.checked;
          return v.checked;
        });
        this.$emit("selection-change", selections);
      }
    },
    checkChange(selections) {
      this.$emit("selection-change", selections);
    },
    handleCurrentChange(row, ev) {
      const { trDiv } = this.$refs;
      if (this.type === "current") {
        trDiv.forEach(v => {
          v.className = "table-row";
        });
        const [tr] = Array.prototype.filter.call(
          ev.path,
          v => v.className === "table-row"
        );
        tr.className += " is-focus";
        this.$emit("current-change", row);
      }
    },
    setWidthStyle(width, index, prefix = "") {
      if (
        !width &&
        index &&
        index === this.columns.length - 1 &&
        this.actionW < 15
      ) {
        const realWidth = this.realWidth + this.actionW;
        return `${prefix}width:${realWidth}px;`;
      }
      return `${prefix}width:${width || this.realWidth}px;`;
    },
    scroll() {
      const { selection, content, body, action } = this.$refs;
      const { scrollLeft, clientWidth } = content;
      const actionFlag = body.clientWidth - (scrollLeft + clientWidth) === 0;

      if (selection && selection.$el) {
        if (scrollLeft > 0) {
          selection.$el.className = getSelectionClass();
        } else {
          selection.$el.className = getSelectionClass(true);
        }
      }
      if (action) {
        if (actionFlag) {
          action.className = getActionClass(true);
        } else {
          action.className = getActionClass();
        }
      }
    },
    getRandom() {
      return Math.random() + "";
    },
    clearSelection() {
      this.$refs.selection.clearSelection();
    },
    setTableStyle() {
      let styleName = "";
      if (this.isSelection) {
        styleName += "padding-left:50px;";
      }
      if (this.actionWidth) {
        styleName += `padding-right:${this.actionWidth}px;`;
      }
      return styleName;
    },
    setEmptyStyle() {
      let styleName = "";
      if (this.isSelection) {
        styleName += "margin-right:50px;";
      }
      if (this.actionWidth) {
        styleName += `margin-left:${this.actionWidth}px;`;
      }
      return styleName;
    },
    setEmptyClass() {
      if (this.border) {
        if (!this.data.length) {
          this.$el.className += " no-border";
        } else {
          this.$el.className = this.$el.className.replace(" no-border", "");
        }
      }
    },
    columnsWidthInit() {
      setTimeout(() => {
        const {
          container,
          content,
          body,
          action,
          trDiv,
          thDiv,
          topThDiv
        } = this.$refs;
        const aW = this.actionWidth ? this.actionWidth : 0;
        if (!body || !content) {
          return;
        }
        const actionFlag =
          ((body || {}).clientWidth || 0) -
            (content.scrollLeft + content.clientWidth) ===
          0;
        let clientWidth = this.$el.clientWidth - aW;
        if (container && container.clientHeight < container.scrollHeight) {
          clientWidth -= 17;
        }
        if (this.isSelection) {
          clientWidth -= 50;
        }
        if (this.border) {
          clientWidth -= this.columns.length;
        }
        this.realWidth = parseInt(clientWidth / this.columns.length, 10);
        this.actionW = clientWidth - this.realWidth * this.columns.length;

        if (this.autoW) {
          this.autoW = false;

          this.$nextTick(() => {
            if (topThDiv) {
              topThDiv.forEach((v, i) => {
                v.style = this.setWidthStyle(this.columns[i].width, i, "min-");
              });
            }

            if (thDiv) {
              thDiv.forEach((v, i) => {
                v.style = this.setWidthStyle(this.columns[i].width, i, "min-");
              });
            }

            if (trDiv) {
              trDiv.forEach(tr => {
                tr.childNodes.forEach((td, i) => {
                  td.childNodes[0].style = this.setWidthStyle(
                    this.columns[i].width,
                    i
                  );
                });
              });
            }
          });
        }

        if (action) {
          if (body.clientWidth > content.clientWidth && !actionFlag) {
            action.className = getActionClass();
          } else {
            action.className = getActionClass(true);
          }
        }
      }, 300);
    }
  },
  computed: {
    isSelection() {
      return this.type === "selection";
    },
    emptyColspan() {
      return !this.data.length ? this.columns.length : 1;
    }
  },
  watch: {
    data() {
      const { allChecked, allDisabled } = loaderCheckAllStatus(
        this.data,
        this.selectable
      );
      this.checkAll.checked = allChecked;
      this.checkAll.disabled = allDisabled;
      if (this.$refs.content) {
        this.$refs.content.scrollLeft = 0;
      }
      this.setEmptyClass();
    }
  },
  mounted() {
    if (this.size === "mini") {
      this.$el.className += " mini";
    }
    if (this.border) {
      this.$el.className += " border";
    }
    if (this.type === "current") {
      this.$el.className += " current";
    }
    if (this.height) {
      this.$refs.container.style.height = this.height + "px";
      this.$refs.container.className += " o-f-y";
    }
    this.setEmptyClass();
    this.columnsWidthInit();
  },
  updated() {
    this.columnsWidthInit();
  }
};
</script>
