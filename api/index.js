// Vercel Serverless Function entrypoint
try {
  const app = require('../server.js');
  module.exports = app;
} catch (err) {
  console.error('[Vercel Boot Error]', err);
  module.exports = (req, res) => {
    res.status(500).json({
      error: "Vercel Serverless Function Boot Error",
      message: err.message,
      stack: err.stack
    });
  };
}
