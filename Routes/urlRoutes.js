const express = require('express');
const createShortUrlLimiter = require('../Middlewares/limiter');

const  {createShortUrl,redirectShortUrl}  = require('../Controllers/urlControllers');
const getAnalytics=require('../Controllers/urlAnalytics')
const getTopicAnalytics=require('../Controllers/topicAnalytics');
const getOverallAnalytics=require('../Controllers/overallAnalytics')
const { verifyToken } = require('../Middlewares/auth');
const router = express.Router();

router.post('/shorten',verifyToken,createShortUrlLimiter, createShortUrl);
router.get('/shorten/:alias', redirectShortUrl);
router.get('/analytics/:alias',verifyToken, getAnalytics);
router.get('/analytics/topic/:topic',verifyToken, getTopicAnalytics);
router.get('/overall', verifyToken, getOverallAnalytics);


module.exports = router;

