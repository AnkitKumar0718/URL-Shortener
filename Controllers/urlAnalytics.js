const moment = require('moment'); 
const URL = require('../Models/url');

const getAnalytics = async (req, res) => {
    const alias = req.params.alias; 

    try {
        const urlEntry = await URL.findOne({ shortUrl: alias });
        if (!urlEntry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const totalClicks = urlEntry.visitHistory.length;

        const uniqueClicks = new Set(urlEntry.visitHistory.map(visit => visit.ipAddress)).size;

        const recentVisits = urlEntry.visitHistory.filter(visit =>
            moment(visit.timestamp).isAfter(moment().subtract(7, 'days'))
        );

        const clicksByDate = recentVisits.reduce((acc, visit) => {
            const date = moment(visit.timestamp).format('YYYY-MM-DD');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

        const osData = recentVisits.reduce((acc, visit) => {
            const osName = visit.os || 'Unknown';
            if (!acc[osName]) {
                acc[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
            }
            acc[osName].uniqueClicks++;
            acc[osName].uniqueUsers.add(visit.ipAddress);
            return acc;
        }, {});

        const osType = Object.entries(osData).map(([osName, data]) => ({
            osName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        const deviceData = recentVisits.reduce((acc, visit) => {
            const deviceName = visit.device || 'Unknown';
            if (!acc[deviceName]) {
                acc[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
            }
            acc[deviceName].uniqueClicks++;
            acc[deviceName].uniqueUsers.add(visit.ipAddress);
            return acc;
        }, {});

        const deviceType = Object.entries(deviceData).map(([deviceName, data]) => ({
            deviceName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        const analyticsData = {
            totalClicks,
            uniqueClicks,
            clicksByDate: clicksByDateArray,
            osType,
            deviceType,
        };

        return res.status(200).json(analyticsData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = getAnalytics;
