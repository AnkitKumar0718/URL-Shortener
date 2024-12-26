const rateLimit = require('express-rate-limit');

const createShortUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: 'Too many URL creation requests from this IP, please try again later.',
});

module.exports = createShortUrlLimiter;
