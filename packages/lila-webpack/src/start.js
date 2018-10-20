import browserSync from 'browser-sync';
import { forceGet as forceGetMiddleware, makeMock } from './util';

export default ({ page, argv, lila }) => {
  const { getSettings, makeConfig } = lila;
  const [cwd, buildDir] = getSettings(['cwd', 'build']);

  const config = makeConfig({ page, cmd: 'start', argv });

  const {
    forceGet = true,
    mock = true,
    port = 8090,
    browserSync: browserSyncConfig = {},
  } = config;

  if (!browserSyncConfig.server) browserSyncConfig.server = {};

  browserSyncConfig.server.baseDir = cwd;
  browserSyncConfig.port = port;
  browserSyncConfig.startPath = `/${buildDir}/index.html`;

  if (!browserSyncConfig.middleware) browserSyncConfig.middleware = [];

  // This must be in the first place.
  if (forceGet) browserSyncConfig.middleware.unshift(forceGetMiddleware);
  if (mock) browserSyncConfig.middleware.unshift(makeMock(cwd));

  browserSync.init(browserSyncConfig);
};
