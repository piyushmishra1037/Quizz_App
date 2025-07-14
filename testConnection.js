const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/quizapp';

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => {
    console.log('MongoDB Connected Successfully');
    mongoose.connection.close();
}).catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
    mongoose.connection.close();
});
