var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
  react: path.resolve(__dirname, './node_modules/react'),
  '@emotion/styled': path.resolve(__dirname, './node_modules/@emotion/styled'),
  'react-inspector': path.resolve(__dirname, './node_modules/react-inspector'),
  'react-async-hook': path.resolve(
    __dirname,
    './node_modules/react-async-hook'
  ),
  '@luke-john/prosemirror-devtools-shared-ui': path.resolve(
    __dirname,
    '../../packages/shared-ui/src/index.tsx'
  ),
  '@luke-john/prosemirror-devtools-shared-utils': path.resolve(
    __dirname,
    '../../packages/shared-utils/src/index.ts'
  ),
};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: path.join(
      __dirname,
      'src',
      'entries',
      'background',
      'background.ts'
    ),
    'content_script-comms-proxy': path.join(
      __dirname,
      'src',
      'entries',
      'content_script',
      'comms-proxy.ts'
    ),
    devtools: path.join(__dirname, 'src', 'entries', 'Devtools', 'index.ts'),
    panel: path.join(__dirname, 'src', 'entries', 'Panel', 'index.tsx'),
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['content_script-comms-proxy', 'devtools'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        // in the `src` directory
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          // getCustomTransformers: () => ({
          //   before: [require('react-refresh-typescript')()],
          // }),
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    plugins: [
      new TsconfigPathsPlugin({ configFile: path.resolve('./tsconfig.json') }),
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'globalThis.regeneratorRuntime = undefined;',
      raw: true,
      entryOnly: true,
    }),
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      cleanStaleWebpackAssets: true,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon-128.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/img/icon-34.png',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        'src',
        'entries',
        'Devtools',
        'index.html'
      ),
      filename: 'devtools.html',
      chunks: ['devtools'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'entries', 'Panel', 'index.html'),
      filename: 'panel.html',
      chunks: ['panel'],
      cache: false,
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'inline-cheap-module-source-map';
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
