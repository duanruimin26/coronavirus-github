const isProd = process.env.VUE_APP_CURRENTMODE === "prod";
const isDev = process.env.VUE_APP_CURRENTMODE === "dev";
const { webpackPlugins, proxy, chainWebpack } = require("./vue_config"); 

module.exports = {
  assetsDir: "static", //静态资源目录名称
  productionSourceMap: !isProd,
  outputDir: !isDev
    ? "nadaa_web/nadaa_web"
    : "dist",
  css: {
    extract: !isDev
  },
  chainWebpack,
  configureWebpack: config => {
    let plugins = [];
    if (!isDev) {
      plugins = webpackPlugins;
      config.output.filename = `static/js/[name].[contenthash:8]_${process.env.VUE_APP_VERSION}.js`;
      config.output.chunkFilename = `static/js/[name].[contenthash:8]_${process.env.VUE_APP_VERSION}.js`;
    }
    config.plugins = [...config.plugins, ...plugins];
  },
  publicPath: isProd
  ? '/nadaa_web/'
  : '/',
  devServer: {
    port: 8000,
    disableHostCheck: true,
    proxy
  }
};
