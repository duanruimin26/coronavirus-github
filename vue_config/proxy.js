const apiConfig = {
  target: process.env.DEV_SERVER_URL,
  changeOrigin: true,
  ws: true,
  // pathRewrite: path => {
  //   return path.replace("/nadaa", "");
  // }
};

module.exports = {
  "/nadaa": apiConfig
};
