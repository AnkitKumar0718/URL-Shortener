const moment = require('moment'); 
const URL = require('../Models/url');

const getTopicAnalytics = async (req, res) => {
    const topic = req.params.topic; 

    try {
        const urls = await URL.find({ topic });
        if (!urls || urls.length === 0) {
            return res.status(404).json({ error: 'No URLs found for the specified topic' });
        }

        let totalClicks = 0;
        const uniqueIpSet = new Set();
        const clicksByDate = {};
        const urlsData = [];

        urls.forEach(url => {
            const urlTotalClicks = url.visitHistory.length;

            const uniqueClicks = new Set(url.visitHistory.map(visit => visit.ipAddress)).size;

            urlsData.push({
                shortUrl: url.shortUrl,
                totalClicks: urlTotalClicks,
                uniqueClicks,
            });

            totalClicks += urlTotalClicks;
            url.visitHistory.forEach(visit => uniqueIpSet.add(visit.ipAddress));

            url.visitHistory.forEach(visit => {
                const date = moment(visit.timestamp).format('YYYY-MM-DD');
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            });
        });

        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

        const analyticsData = {
            totalClicks,
            uniqueClicks: uniqueIpSet.size,
            clicksByDate: clicksByDateArray,
            urls: urlsData,
        };

        return res.status(200).json(analyticsData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = getTopicAnalytics;
