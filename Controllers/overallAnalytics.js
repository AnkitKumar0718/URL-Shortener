const moment = require('moment');
const URL = require('../Models/url');

const getOverallAnalytics = async (req, res) => {
    try {
        const userId = req.userId;  

        const urls = await URL.find({ createdBy: userId });
        if (!urls || urls.length === 0) {
            return res.status(404).json({ error: 'No URLs found for the user' });
        }

        let totalUrls = urls.length;
        let totalClicks = 0;
        const uniqueIpSet = new Set();
        const clicksByDate = {};
        const osType = {};
        const deviceType = {};

        urls.forEach(url => {
            const urlTotalClicks = url.visitHistory.length;
            totalClicks += urlTotalClicks;

            url.visitHistory.forEach(visit => {
                uniqueIpSet.add(visit.ipAddress);

                const date = moment(visit.timestamp).format('YYYY-MM-DD');
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;

                const os = visit.os || 'Unknown';
                if (!osType[os]) {
                    osType[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
                }
                osType[os].uniqueClicks++;
                osType[os].uniqueUsers.add(visit.ipAddress);

                const device = visit.device || 'Unknown';
                if (!deviceType[device]) {
                    deviceType[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
                }
                deviceType[device].uniqueClicks++;
                deviceType[device].uniqueUsers.add(visit.ipAddress);
            });
        });

        const clicksByDateArray = Object.entries(clicksByDate).map(([date, count]) => ({
            date,
            count,
        }));

        const osData = Object.entries(osType).map(([osName, data]) => ({
            osName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        const deviceData = Object.entries(deviceType).map(([deviceName, data]) => ({
            deviceName,
            uniqueClicks: data.uniqueClicks,
            uniqueUsers: data.uniqueUsers.size,
        }));

        const analyticsData = {
            totalUrls,
            totalClicks,
            uniqueClicks: uniqueIpSet.size,
            clicksByDate: clicksByDateArray,
            osType: osData,
            deviceType: deviceData,
        };

        return res.status(200).json(analyticsData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = getOverallAnalytics;
