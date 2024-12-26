const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        index: true, 
    },
    longUrl: {
        type: String,
        required: true,
        },
    customAlias: {
        type: String,
    },
    topic: {
        type: String,
    },
    visitHistory: [
        {
            timestamp: { type: Number },
            userAgent: { type: String },
            ipAddress: { type: String },
            geolocation: {
                country: { type: String },
                region: { type: String },
                city: { type: String },
                latitude: { type: Number },
                longitude: { type: Number },
            },
            os: { type: String },
            device: { type: String },
        },
    ],
    totalClicks: {
        type: Number,
        default: 0,
    },
    uniqueClicks: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);



