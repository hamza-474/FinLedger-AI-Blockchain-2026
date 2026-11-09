const logRequest = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};

const logError = (err, req) => {
  console.error(`[${new Date().toISOString()}] ERROR - ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message);
};

module.exports = { logRequest, logError };
