const URL = require('../Models/url');
const { nanoid } = require('nanoid');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const UAParser = require('ua-parser-js');
const parser = new UAParser();

const createShortUrl = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    if (!longUrl) {
        return res.status(400).json({ error: 'longUrl is required' });
    }
    const shortUrl = customAlias || nanoid(8);

    try {
        if (customAlias) {
            const existingAlias = await URL.findOne({ customAlias });
            if (existingAlias) {
                return res.status(400).json({ error: 'Custom alias is already in use' });
            }
        }

        const newUrl = await URL.create({
            shortUrl,
            longUrl,
            customAlias: customAlias || null,
            topic: topic || null,
            visitHistory: [],
        });

        return res.status(201).json({
            shortUrl: newUrl.shortUrl,
            createdAt: newUrl.createdAt,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const redirectShortUrl = async (req, res) => {
    const alias = req.params.alias; 

    try {
        const urlEntry = await URL.findOne({ shortUrl: alias });
        if (!urlEntry) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        let longUrl = urlEntry.longUrl;
        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
            longUrl = `http://${longUrl}`;
        }

        const ipAddress = requestIp.getClientIp(req);
        const geoData = geoip.lookup(ipAddress);

        const userAgent = req.headers['user-agent'];
        const result = parser.setUA(userAgent).getResult();

        const os = result.os.name || 'Unknown'; 
        const device = result.device.type || 'Unknown'; 

        urlEntry.visitHistory.push({
            timestamp: Date.now(),
            userAgent: userAgent,
            ipAddress: ipAddress,
            geolocation: geoData || {},
            os: os, 
            device: device,
        });

        await urlEntry.save();

        res.redirect(longUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {createShortUrl,redirectShortUrl};

