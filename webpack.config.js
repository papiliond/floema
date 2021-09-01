const path = require("path");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { DefinePlugin } = require("webpack");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const srcPath = path.join(__dirname, "src");
const assetsPath = path.join(__dirname, "assets");
const staticPath = path.join(__dirname, "static");
const stylesPath = path.join(__dirname, "styles");

module.exports = (env) => {
  let config = {
    entry: [
      path.join(srcPath, "index.js"),
      path.join(stylesPath, "index.scss"),
    ],
    output: {
      publicPath: path.resolve(__dirname, "dist"),
    },
    resolve: {
      modules: [srcPath, assetsPath, staticPath, stylesPath, "node_modules"],
    },
    plugins: [
      new DefinePlugin({
        IS_DEVELOPMENT: isDevelopment(),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./static",
            to: "",
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment() ? "[name].css" : "[name].[hash].css",
        chunkFilename: isDevelopment() ? "[id].css" : "[id].[hash].css",
      }),
      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            ["gifsicle", { interlaced: true }],
            ["jpegtran", { progressive: true }],
            ["optipng", { optimizationLevel: 8 }],
          ],
        },
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "",
              },
            },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
            },
            {
              loader: "sass-loader",
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[hash].[ext]",
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif)$/i,
          use: {
            loader: ImageMinimizerPlugin.loader,
          },
        },
        {
          test: /\.(glsl|frag|vert)$/,
          use: ["raw-loader", "glslify-loader"],
          exclude: /node_modules/,
        },
      ],
    },
  };

  if (isDevelopment()) {
    config = merge(config, {
      mode: "development",
      devtool: "inline-source-map",
    });
  } else {
    config = merge(config, {
      mode: "production",
      plugins: [new CleanWebpackPlugin()],
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
    });
  }

  if (isDevServer()) {
    config = merge(config, {
      devServer: {
        hot: true,
        devMiddleware: {
          writeToDisk: true,
        },
      },
    });
  }

  return config;
};

function isDevServer() {
  return process.argv.find((v) => v.includes("webpack-dev-server"));
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}
