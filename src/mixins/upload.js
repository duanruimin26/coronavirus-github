export default {
  data() {
    return {
      loadingOptions: {
        visible: false,
        percentage: 0
      }
    };
  },
  methods: {
    uploadProgress(options) {
      return progress => {
        const num = progress >= 100 ? 90 : progress;
        if (options) {
          options.percentage = num;
        } else {
          this.loadingOptions.percentage = num;
        }
      };
    },
    open(percentage = 0) {
      this.loadingOptions.percentage = percentage;
      this.loadingOptions.visible = true;
    },
    cancel(flag = true) {
      if (flag) {
        this.loadingOptions.percentage = 100;
      }
      setTimeout(() => {
        this.loadingOptions.visible = false;
      }, 1000);
    }
  },
  created() {
    this.loadingOptions.open = this.open;
    this.loadingOptions.cancel = this.cancel;
  }
};
