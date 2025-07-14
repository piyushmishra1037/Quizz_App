const mongoose = require("mongoose");

const connection = mongoose.connection;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => {
    console.log('MongoDb Connected Successfully');
}).catch((err) => {
    console.error('MongoDb Connection Error:', err);
});

connection.on("error", (err) => {
    console.error('MongoDb Connection Error:', err);
});

module.exports = connection;
