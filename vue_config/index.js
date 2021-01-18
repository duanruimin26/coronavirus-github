const webpackPlugins = require("./plugins");
const proxy = require("./proxy");
const chainWebpack = require("./chain_webpack");

module.exports = {
  webpackPlugins,
  proxy,
  chainWebpack
};
