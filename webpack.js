const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "src"),
    hot: true,
  },
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, "build"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
      { test: /\.(jpe?g|png|gif|ico|svg)$/i, use: "file?name=[name].[ext]" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: "src/images/favicon.ico",
      template: path.join(__dirname, "src", "index.html"),
    }),
  ],
};
