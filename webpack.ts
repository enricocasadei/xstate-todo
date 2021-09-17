import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  devtool: "inline-source-map",
  devServer: {
    contentBase: "../build",
    historyApiFallback: true,
    disableHostCheck: true,
    port: 8090,
    open: true,
    hot: true,
  },
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.join(__dirname, "build"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      { test: /\.(jpe?g|png|gif|ico|svg)$/i, use: "file?name=[name].[ext]" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};

export default config;
