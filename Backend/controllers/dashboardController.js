const Journal = require('../models/Journal');

const getDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        
        const totalEntries = await Journal.countDocuments({ user: userId });

        
        const hoursResult = await Journal.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, totalHours: { $sum: '$studyDuration' } } }
        ]);
        const totalHours = hoursResult[0]?.totalHours || 0;

        
        const difficultyBreakdown = await Journal.aggregate([
            { $match: { user: userId } },
            { $group: { _id: '$difficultyLevel', count: { $sum: 1 } } }
        ]);

        
        const recentEntries = await Journal.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('topicName studyDuration difficultyLevel createdAt');

        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyEntries = await Journal.countDocuments({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        const weeklyHoursResult = await Journal.aggregate([
            {
                $match: {
                    user: userId,
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            { $group: { _id: null, totalHours: { $sum: '$studyDuration' } } }
        ]);
        const weeklyHours = weeklyHoursResult[0]?.totalHours || 0;

        res.json({
            totalEntries,
            totalHours,
            weeklyEntries,
            weeklyHours,
            difficultyBreakdown,
            recentEntries
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboard };