const cron = require('node-cron');
const Trade = require('../models/trade');


const triggerScheduledJobs = async () => {
    const now = new Date();
    const trades = await Trade.find({
        typeOfPost: 2,
        time: { $lte: now },
        state: "accepted"
    });

    trades.forEach(trade => {
        console.log(`Triggering job for trade ID: ${trade._id}`);
        trade.state = "accepted";
        trade.save();
    });
};

// Cron job running every minute to check for due trades
cron.schedule('* * * * *', () => {
    console.log("Running scheduled trade job check...");
    triggerScheduledJobs();
});
