const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json()); // Middleware for JSON parsing

const mongoURI = 'mongodb+srv://udaysharma9171:YCBxPNYykbcrhMua@clusterdb.o3rt2.mongodb.net/student_data';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
    try {
        await client.connect();
        console.log("✅ MongoDB Connected Successfully!");

        // 🔍 Optional: Check collections
        const db = client.db('student_data');
        const collections = await db.listCollections().toArray();
        console.log("📂 Collections:", collections.map(col => col.name));

        // ✅ Register API only after DB is connected
        app.get('/api/teacher/insights', async (req, res) => {
            try {
                const insights = await db.collection('students').find({}, {
                    projection: {
                        name: 1,
                        quiz_score_1: 1,
                        quiz_score_2: 1,
                        quiz_score_3: 1,
                        assignment_score_1: 1,
                        assignment_score_2: 1,
                        math_engagement_time: 1,
                        science_engagement_time: 1,
                        history_engagement_time: 1,
                        engagement_flag: 1,
                        cluster: 1
                    }
                }).toArray();

                console.log('✅ Teacher insights fetched successfully:', insights);
                res.status(200).json(insights);
            } catch (error) {
                console.error('❌ Error fetching teacher insights:', error.message);
                res.status(500).json({ error: 'Failed to fetch teacher insights' });
            }
        });

        // ✅ Start server AFTER routes and DB are ready
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
    }
}

connectDB();