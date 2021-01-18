const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.VUE_APP_CURRENTMODE === "test";

module.exports = config => {
  // 修复HMR
  config.resolve.symlinks(true);
  // 修复Lazy loading routes  按需加载的问题
  config.plugin("html").tap(args => {
    args[0].chunksSortMode = "none";
    return args;
  });
  // 移除 prefetch 插件
  config.plugins.delete("prefetch");
  // 移除 preload 插件
  config.plugins.delete("preload");

  if (!isDev) {
    // 压缩图片
    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        mozjpeg: {
          quality: 65
        },
        pngquant: {
          quality: [0.65, 0.9]
        }
      });
  }

  // 打包分析
  if (isTest) {
    config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
      {
        analyzerMode: "static"//在"静态"模式下，会生成带有报告的单个HTML文件
      }
    ]);
  }
};
