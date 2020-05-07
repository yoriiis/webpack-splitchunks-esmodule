const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ChunksWebpackPlugin = require("chunks-webpack-plugin");

const generateWebpackConfig = ({ browsers, isProduction, presets }) => {
  return {
    name: browsers,
    watch: !isProduction,
    entry: {
      home: "./index.js",
    },
    output: {
      path: path.resolve(__dirname, `./dist/assets/${browsers}`),
      filename: "[name].js",
      sourceMapFilename: "[file].map",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets,
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".css"],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[name].css",
      }),
      new ChunksWebpackPlugin({
        outputPath: path.resolve(__dirname, `./dist/templates/${browsers}`),
        fileExtension: ".html.twig",
        templateStyle: `<link rel="stylesheet" href="{{chunk}}" />`,
        templateScript: `<script defer${
          browsers === "modern" ? ' type="module"' : " nomodule"
        } src="{{chunk}}"></script>`,
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        name: false,
      },
    },
  };
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  const configModern = generateWebpackConfig({
    browsers: "modern",
    isProduction,
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            esmodules: true,
          },
          debug: false,
        },
      ],
    ],
  });

  const configLegacy = generateWebpackConfig({
    browsers: "legacy",
    isProduction,
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          targets: {
            esmodules: false,
          },
        },
      ],
    ],
  });

  return [configModern, configLegacy];
};
