const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let config = {
  entry: {
    acarshub: path.resolve(__dirname, "src") + "/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules|\.d\.ts$/,
      },
      {
        test: /\.d\.ts$/,
        loader: "ignore-loader",
      },
      {
        test: /\.(sass|css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: "file-loader",
        options: {
          outputPath: "../images",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(mp3)$/i,
        loader: "file-loader",
        options: {
          outputPath: "../sounds",
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(md)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@fortawesome/fontawesome-free-solid$":
        "@fortawesome/fontawesome-free-solid/shakable.es.js",
    },
    extensions: [
      ".js",
      ".ts",
      ".tsx",
      ".css",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".md",
    ],
  },
  output: {
    //filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "dist/static/js"),
    publicPath: "static/js/",
    clean: true,
  },

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        acarshub: {
          name: "acarshub",
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }),
    new NodePolyfillPlugin({
      additionalAliases: ["process"],
    }),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "./src/assets/images") + "/acarshub.svg",
      inject: true,
      cache: true,
      outputPath: "../images/favicons",
      publicPath: "../../static/images/favicons",
      prefix: "",
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: "ACARS Hub",
      filename: "../index.html",
      meta: {
        viewport:
          "width=400, user-scalable=yes, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui",
      },
    }),
    new InjectBodyPlugin({
      content: `    <div class="container" id="header">
      <div class="row" id="links"></div>
    </div> <!-- /#header -->
    <div class="container" id="content">
      <div class="left" id="log">
      </div> <!-- /#log -->
    </div> <!-- /#content -->
    <div class="footer" id="footer_div">
    </div> <!-- /#footer_div -->`,
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "source-map";
    config.output.filename = "[name].js";
  } else {
    config.devtool = "source-map";
    config.output.filename = "[name].[chunkhash].js";
  }

  return config;
};
