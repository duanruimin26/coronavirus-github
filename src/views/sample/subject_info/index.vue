<template>
  <div class="subject-info">
    <!-- 列表部分 -->
    <div class="main-content">
      <div class="search-params">
        <div class="params-row">
          <span class="label">姓名</span>
          <el-input type="text" placeholder="姓名" class="width1" v-model="params.checkedName" clearable></el-input>
          <el-button icon="el-icon-delete" @click="reset()">清空搜索条件</el-button>
          <el-button type="primary" :disabled="queryAuthDisable" icon="el-icon-search" @click="search()">搜索</el-button>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="tableData" border style="width: 100%" v-loading="searchDisable">
          <el-table-column prop="sampleNum" label="编号" min-width="140"></el-table-column>
          <el-table-column prop="checkedName" label="姓名" min-width="90"></el-table-column>
          <el-table-column prop="checkedSex" label="性别" min-width="70"></el-table-column>
          <el-table-column prop="checkedAge" label="年龄" min-width="70"></el-table-column>
          <el-table-column prop="checkedTel" label="手机号" min-width="108"></el-table-column>
          <el-table-column prop="sendCheckHospital" label="送检医院" min-width="230"></el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="table-pagination"
        @size-change="search"
        @current-change="getList"
        background
        :current-page.sync="params.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
const { toArray, toObj, messageTips } = window.$app;

export default {
  data() {
    return {
      params: {
        checkedName: null,
        pageSize: 50,
        currentPage: 1
      },
      tableData: [],
      totalCount: 0,
      searchDisable: false,
      queryAuthDisable: false,
    };
  },
  methods: {
    search() {
      this.params.currentPage = 1;
      this.getList();
    },
    getList() {
      if (this.searchDisable) {
        return;
      }
      this.searchDisable = true;

      this.api
        .getList(this.params)
        .then(res => {
          this.searchDisable = false;
          if (res.resCode == "200") {
            const { data = [], totalCount = 0 } = toObj(res);
            this.tableData = toArray(data);
            this.totalCount = totalCount;
          } else {
            messageTips("error", res.resMsg);
          }
        })
        .catch(() => {
          this.searchDisable = false;
        });
    },
    reset(){
      this.params = this.$options.data().params
      // this.getList();
    },
    checkBtnAuth(){
      this.$api.common.checkBtnAuth({
        menuName: this.$route.name
      }).then(res => {
        if(res.resCode == "200"){
          this.queryAuthDisable = !res.permittedMenuNames.includes("interactiveReport.detailsList.query");
        }else{
          this.messageTips("error",res.resMsg);
        }
      }).catch(()=>{})
    }
  },
  mounted() {
    this.api = this.$api.sample.subjectInfo;
    this.getList();
    // this.checkBtnAuth();
  }
};
</script>
