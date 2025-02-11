import log from 'loglevel';

// Настроим уровень логирования (можно менять при необходимости)
log.setLevel('debug'); // debug, info, warn, error

const logger = {
  debug: (msg) => log.debug(`🐛 [DEBUG] ${msg}`),
  info: (msg) => log.info(`ℹ️ [INFO] ${msg}`),
  warn: (msg) => log.warn(`⚠️ [WARN] ${msg}`),
  error: (msg) => log.error(`🚨 [ERROR] ${msg}`)
};

export default logger;
