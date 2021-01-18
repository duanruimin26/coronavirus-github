module.exports = {
  presets: [
    ["@babel/env", { corejs: "3", useBuiltIns: "usage" }],
    ["@vue/app"]
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk"
      }
    ]
  ]
};
