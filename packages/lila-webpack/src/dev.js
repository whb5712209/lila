import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import browserSync from 'browser-sync';

import { makeMock, forceGet as forceGetMiddleware, makeServe } from './util';
import { defaultDevMiddleware } from './defaults';

export default ({ page, argv, lila, serve, servePath }) => {
  const { getSettings, makeConfig } = lila;
  const [cwd, srcDir, devDir, webpackConfigGenerator] = getSettings([
    'cwd',
    'src',
    'dev',
    'webpackConfigGenerator',
  ]);

  if (!webpackConfigGenerator)
    throw new Error('webpackConfigGenerator not configured');

  const makeWebpackConfig = webpackConfigGenerator(webpack);

  if (typeof makeWebpackConfig !== 'function')
    throw new Error('webpackConfigGenerator should return a function');

  const config = makeConfig({ page, cmd: 'dev', argv });
  const webpackConfig = makeWebpackConfig({
    page,
    argv,
    cmd: 'dev',
    config,
    lila,
  });

  const {
    forceGet = true,
    mock = true,
    port = 8090,
    browserSync: browserSyncConfig = {},
    devMiddleware: devMiddlewareConfig = defaultDevMiddleware,
    hotMiddleware: hotMiddlewareConfig = {},
  } = config;

  const compiler = webpack(webpackConfig);

  if (!browserSyncConfig.server) browserSyncConfig.server = {};

  browserSyncConfig.server.baseDir = cwd;
  browserSyncConfig.port = port;
  browserSyncConfig.startPath = serve ? '/serve' : `/${devDir}/index.html`;

  if (!browserSyncConfig.middleware) browserSyncConfig.middleware = [];

  // This must be in the first place.
  if (forceGet) browserSyncConfig.middleware.unshift(forceGetMiddleware);
  if (mock) browserSyncConfig.middleware.unshift(makeMock(cwd));
  if (serve)
    browserSyncConfig.middleware.unshift(
      makeServe({
        root: cwd,
        devDir,
        servePath: servePath(page, srcDir),
      })
    );

  devMiddlewareConfig.stats = 'errors-only';
  devMiddlewareConfig.publicPath = `/${devDir}/`;

  browserSyncConfig.middleware.push(
    devMiddleware(compiler, devMiddlewareConfig)
  );
  browserSyncConfig.middleware.push(
    hotMiddleware(compiler, hotMiddlewareConfig)
  );

  browserSync.init(browserSyncConfig);
};