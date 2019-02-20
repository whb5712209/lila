import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { baseType, reactType, vueType, reactVueType } from './data';

const vueLoader = () => ({
  loader: 'vue-loader',
  test: /\.vue$/,
});

const baseBabelLoader = ({
  babelImport,
  babelComponent,
  babelExclude,
  babelPresets,
  babelPlugins,
  flow,
  flowRuntime,
  test,
  presets,
  plugins,
}) => ({
  loader: 'babel-loader',
  test,
  options: {
    presets: [
      '@babel/preset-env',
      ...presets,
      ...(flow ? ['@babel/preset-flow'] : []),
      ...babelPresets,
    ],
    plugins: [
      ...plugins,
      '@babel/plugin-syntax-dynamic-import',
      ...(Array.isArray(babelImport) ? babelImport : [babelImport]).map(i => [
        'import',
        ...(Array.isArray(i) ? i : [i]),
      ]),
      ...(Array.isArray(babelComponent)
        ? babelComponent
        : [babelComponent]
      ).map(i => ['component', ...(Array.isArray(i) ? i : [i])]),
      ...(flowRuntime ? [['flow-runtime', { assert: !0, annotate: !0 }]] : []),
      ...babelPlugins,
    ],
  },
  exclude: babelExclude,
});

export const babelLoader = ({
  makeType,
  babelImport,
  babelComponent,
  babelExclude,
  babelPresets,
  babelPlugins,
  flow,
  flowRuntime,
}) => {
  const rules = [];

  if (
    makeType === baseType ||
    makeType === reactType ||
    makeType === reactVueType
  ) {
    // base, react, react + vue: only handle pure js code in .js file
    rules.push(
      baseBabelLoader({
        babelImport,
        babelComponent,
        babelExclude,
        babelPresets,
        babelPlugins,
        flow,
        flowRuntime,
        test: /\.js$/,
        presets: [],
        plugins: [],
      })
    );
  } else {
    rules.push(
      baseBabelLoader({
        // vue: also handle jsx code in .js file
        babelImport,
        babelComponent,
        babelExclude,
        babelPresets,
        babelPlugins,
        flow,
        flowRuntime,
        test: /\.js$/,
        presets: [],
        plugins: ['transform-vue-jsx'],
      })
    );
  }

  if (makeType === reactType || makeType === reactVueType) {
    rules.push(
      baseBabelLoader({
        babelImport,
        babelComponent,
        babelExclude,
        babelPresets,
        babelPlugins,
        flow,
        flowRuntime,
        test: /\.jsx$/,
        presets: ['@babel/preset-react'],
        plugins: ['@babel/plugin-transform-react-jsx'],
      })
    );
  }

  if (makeType === vueType || makeType === reactVueType) {
    rules.push(vueLoader());
  }

  return rules;
};

export const urlLoader = ({ extensions }) => ({
  loader: 'url-loader',
  options: {
    // 0 means infinite, put 1 here to disable base64.
    limit: 1,
  },
  test: new RegExp(`\\.(${extensions.join('|')})$`),
});

export const htmlLoader = () => ({
  loader: 'html-loader',
  test: /\.html$/,
  options: {
    attrs: ['img:src', 'link:href'],
    interpolate: 'require',
  },
});

export const cssLoader = ({
  cssModules,
  cssModulesName,
  cssModulesExclude,
  exclude,
  browsers,
  isBuild,
}) => ({
  test: /\.css$/,
  use: [
    {
      loader: isBuild ? MiniCssExtractPlugin.loader : 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: cssModules && exclude,
        localIdentName: cssModulesName,
      },
    },
    {
      loader: 'postcss-loader',
      options: { plugins: [autoprefixer({ browsers })] },
    },
  ],
  exclude: cssModules && exclude ? cssModulesExclude : undefined,
  include: cssModules && !exclude ? cssModulesExclude : undefined,
});

export const lessLoader = ({
  cssModules,
  cssModulesName,
  cssModulesExclude,
  exclude,
  browsers,
  isBuild,
}) => ({
  test: /\.less$/,
  use: [
    {
      loader: isBuild ? MiniCssExtractPlugin.loader : 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: cssModules && exclude,
        localIdentName: cssModulesName,
      },
    },
    {
      loader: 'postcss-loader',
      options: { plugins: [autoprefixer({ browsers })] },
    },
    {
      loader: 'less-loader',
    },
  ],
  exclude: cssModules && exclude ? cssModulesExclude : undefined,
  include: cssModules && !exclude ? cssModulesExclude : undefined,
});

export const sassLoader = ({
  cssModules,
  cssModulesName,
  cssModulesExclude,
  exclude,
  browsers,
  isBuild,
}) => ({
  test: /\.scss$/,
  use: [
    {
      loader: isBuild ? MiniCssExtractPlugin.loader : 'style-loader',
    },
    {
      loader: 'css-loader',
      options: {
        modules: cssModules && exclude,
        localIdentName: cssModulesName,
      },
    },
    {
      loader: 'postcss-loader',
      options: { plugins: [autoprefixer({ browsers })] },
    },
    {
      loader: 'sass-loader',
    },
  ],
  exclude: cssModules && exclude ? cssModulesExclude : undefined,
  include: cssModules && !exclude ? cssModulesExclude : undefined,
});
