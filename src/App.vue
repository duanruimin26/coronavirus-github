<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@import url("./assets/css/index.less");
@import url("./assets/css/common.less");
@import url("./assets/css/element_alter.less");
</style>

<script>
export default {
  methods: {
    setMinHeight() {
      this.$el.style.minHeight = `${document.body.clientHeight}px`;
    }
  },
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))));
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state));
    })
  },
  updated() {
    this.setMinHeight();
    window.addEventListener("resize", this.setMinHeight);
  }
};
</script>
