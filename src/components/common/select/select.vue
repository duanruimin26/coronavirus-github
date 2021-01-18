<template>
  <div>
    <el-tooltip
      :disabled="!tooltip"
      effect="dark"
      :content="tooltip"
      placement="top"
    >
      <el-select
        v-model="options.value"
        :filterable="options.filterable"
        :remote="options.remote"
        :remote-method="elRemoteMethod"
        :placeholder="setPlaceholder"
        @change="elChange"
        @clear="elClear"
        :loading="options.loading"
        :disabled="options.disabled"
        :clearable="options.remote"
        :multiple="options.multiple"
        :popper-class="'t-' + options.key"
        collapse-tags
        ref="select"
        size="mini"
        @focus="elFocus"
        @visible-change="visibleChange"
      >
        <div v-if="items.length">
          <el-option
            v-for="(item, index) in items"
            :key="item.value + '_' + index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </div>
      </el-select>
    </el-tooltip>
    <div class="input-um-box" :class="{ccs: options.key === 'ccs'}" v-show="showInputUm && isInputUm" @click="showBox">
      <div class="um-box-title">请输入指定账号，若多个请以“,”隔开</div>
      <el-input 
        v-model="options.umList" 
        placeholder="请输入指定UM" 
        ref="uminput" 
        @focus="inputFocus"
        @blur="inputBlur"
      ></el-input>
      <div class="um-box-tips">
        <span class="tips-sz10">请确保输入的账号正确，否则将无法送达</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url("./select.less");
</style>

<script>
export default {
  name: "cSelect",
  props: {
    options: Object,
    placeholder: String
  },
  data() {
    return {
      tooltip: "",
      createItem: {},
      items: [],
      showInputUm: false,
      isInputUm: false,
    };
  },
  methods: {
    elChange(value) {
      if (this.$root.isFn(this.options.change)) {
        this.options.change(value);
      }
      if (this.options.multiple) {
        this.tooltip = this.options.value[0] || "";

        if (value[value.length - 1] === "") {
          this.options.value = [""];
        } else {
          this.options.value = value.filter(v => !!v);
        }
      }
      //动态预警配置页，选择了指定UM，需要显示输入指定UM的弹窗
      if((this.options.key === "recipients" || this.options.key === "ccs") && value.includes('指定UM')){
        this.isInputUm = true;
      }else{
        this.isInputUm = false;
      }
    },
    elClear() {
      if (this.$root.isFn(this.options.clear)) {
        this.options.clear();
      }
    },
    elRemoteMethod(value) {
      if (this.$root.isFn(this.options.remoteFn)) {
        this.options.remoteFn(value);
      }
    },
    elFocus() {
      if (this.options.filterable && this.options.multiple) {
        const items = this.options.value.filter(v => v === "");
        if (items.length) {
          this.items = [];
          setTimeout(() => {
            this.items = this.options.items;
          }, 100);
        }
      }
    },
    visibleChange(val){
      //动态预警配置页，邮件发送对象的选择框，展示下拉框时将showInputUm设为true
      if(val && (this.options.key === "recipients" || this.options.key === "ccs")){
        this.showInputUm = true
        if(this.options.value.includes('指定UM')){
          this.isInputUm = true;
        }
      }else{
        this.showInputUm = false;
      }
    },
    //点击指定UM的输入框时，下拉框的下拉选项正常显示
    showBox(){
      this.$refs.select.visible = true
    },
    //指定UM输入框获取焦点
    inputFocus(){
      this.options.disabled = true
    },
    //指定UM输入框失去焦点
    inputBlur(){
      this.options.disabled = false
    }
  },
  computed: {
    setPlaceholder() {
      return this.options.hasOwnProperty("placeholder")
        ? this.options.placeholder
        : this.placeholder || this.$t("placeholder").select;
    }
  },
  mounted() {
    this.items = this.$root.clone(this.options.items);
    if (this.$refs.select && this.options.allowCreate) {
      this.createItem.sym = Symbol();
      setTimeout(() => {
        this.options.remoteFn = value => {
          if (!value) {
            this.options.items = this.options.items.filter(
              v => v.sym !== this.createItem.sym
            );
            this.options.value = value;
            return;
          }

          Object.assign(this.createItem, {
            label: value,
            value: value
          });

          const [item] = this.options.items.filter(
            v => v.sym === this.createItem.sym
          );
          const repeats = this.options.items.filter(v => v.value === value);

          this.options.value = value;

          if (repeats.length) {
            return;
          }

          if (!item) {
            this.options.items.unshift(this.createItem);
          } else {
            this.options.items.forEach(v => {
              if (v.sym === this.createItem.sym) {
                Object.assign(v, this.createItem);
              }
            });
          }
        };
      }, 600);
    }
  },
  watch: {
    "options.items": {
      handler(val) {
        this.items = this.$root.clone(val);
      },
      deep: true
    }
  }
};
</script>
