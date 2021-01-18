<template>
  <div>
    <ul class="upload-progress-line animate">
      <li v-for="nub in 8" :key="nub" :style="setLinePosition(nub)"></li>
    </ul>
    <el-progress
      :text-inside="setTextInside"
      :stroke-width="setStrokeWidth"
      :percentage="percentage"
    ></el-progress>
  </div>
</template>

<script>
export default {
  name: "cProgress",
  props: {
    textInside: Boolean,
    strokeWidth: Number,
    percentage: Number
  },
  methods: {
    setLinePosition(nub) {
      return `left: ${nub * 15}px`;
    }
  },
  computed: {
    setTextInside() {
      return this.$root.isFalse(this.textInside);
    },
    setStrokeWidth() {
      return this.strokeWidth || 20;
    }
  }
};
</script>
