const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/;
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const FilemanagerPlugin = require("filemanager-webpack-plugin");
const isProd = process.env.VUE_APP_CURRENTMODE === "prod";

// 压缩文件
const tsp = new TerserPlugin({
  sourceMap: !isProd,
  parallel: isProd,  //使用多进程并行运行来提高构建速度
  terserOptions:{
    compress:{
      drop_console: true,
      drop_debugger: true
    },
    mangle: false,//混淆
    warnings: false
  }
});

// gzip 压缩
const cp = new CompressionPlugin({
  filename: "[path].gz[query]",
  algorithm(input, compressionOptions, callback) {
    return zopfli.gzip(input, compressionOptions, callback);
  },
  compressionOptions: {
    numiterations: 15,
    level: 2
  },
  test: productionGzipExtensions,
  threshold: 10240,//只处理比这个值大的资源。按字节计算
  cache: true
});

const bp = new BrotliPlugin({
  test: productionGzipExtensions,
  minRatio: 0.99//只有压缩率比这个值小的资源才会被处理
});

// 打包zip
const fp = new FilemanagerPlugin({
  onEnd: {
    delete: ["./*.zip"],
    archive: [
      {
        source: "./nadaa_web",
        destination: `./nadaa_web_${process.env.VUE_APP_VERSION}.zip`,
        format: "zip"
      }
    ]
  }
});

module.exports = [tsp, cp, bp, fp];
