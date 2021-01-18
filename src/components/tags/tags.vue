<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">{{
          item.title
        }}</router-link>
        <span
          class="tags-li-icon"
          @click="closeTags(index)"
          v-if="item.name != 'dashboard'"
        >
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagsList: [],
      showTagsList: []
    };
  },
  methods: {
    isActive(path) {
      return path === this.$route.fullPath;
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];

      // let allIndex = 0;
      // this.tagsList.forEach((v, i) => {
      //   if (v.path == delItem.path) {
      //     allIndex = i;
      //   }
      // });
      // this.tagsList.splice(allIndex, 1);

      // this.showTagsList = this.tagsList.slice(-5);

      // this.tagsList.splice(0, 1, {
      //   title: "首页",
      //   path: "/coronavirusTestSystem/dashboard",
      //   name: "dashboard"
      // });

      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path);
      } else {
        this.$router.push("/");
      }
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        if (this.tagsList.length >= 7) {
          this.tagsList.shift();
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.name
        });

        if (this.tagsList[0].name != "dashboard") {
          this.tagsList.unshift({
            title: "首页",
            path: "/coronavirusTestSystem/dashboard",
            name: "dashboard"
          });
        }
        if(this.tagsList.length > 7){
          this.tagsList.splice(1,1)
        }
      }

      this.$root.Bus.$emit("tags", this.tagsList);

      // this.showTagsList = this.tagsList.slice(-5);
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    }
  },
  watch: {
    $route(newValue) {
      this.setTags(newValue);
    }
  },
  created() {
    this.setTags(this.$route);
    // 监听关闭当前页面的标签页
    this.$root.Bus.$on("close_current_tags", () => {
      for (let i = 0, len = this.tagsList.length; i < len; i++) {
        const item = this.tagsList[i];
        if (item.path === this.$route.fullPath) {
          if (i < len - 1) {
            this.$router.push(this.tagsList[i + 1].path);
          } else if (i > 0) {
            this.$router.push(this.tagsList[i - 1].path);
          } else {
            this.$router.push("/");
          }
          this.tagsList.splice(i, 1);
          break;
        }
      }
    });
  }
};
</script>


<style>
.tags {
  position: relative;
  height: 50px;
  overflow: hidden;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  width: 100px;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  background: #e3e6e6;
  border-radius: 8px 8px 0px 0px;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #d5d8d8;
}

.tags-li.active {
  background: #ffffff;
}

.tags-li-title {
  float: left;
  width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #222222;
  font-weight: bold;
  font-size: 13px;
}

.tags-li-title:hover {
  color: #222222;
}

.tags-li-icon {
  cursor: pointer;
}
</style>
