const mongoose = require('mongoose');

let db;
/*const connectToServer = async () => {
    const mongoURL = "mongodb+srv://" + process.env.ATLAS_USERNAME + ":" + process.env.ATLAS_PASSWORD + "@splitter.ocqycgg.mongodb.net/?retryWrites=true&w=majority";
    const connection = await mongoose.connect(mongoURL, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    });
    const db = connection.collections;
    mongoose.set('strictQuery', false);
}

module.exports = connectToServer;*/

module.exports = {
    connectToServer: async () => {
        const mongoURL = "mongodb+srv://" + process.env.ATLAS_USERNAME + ":" + process.env.ATLAS_PASSWORD + "@splitter.ocqycgg.mongodb.net/?retryWrites=true&w=majority";
        const connection = await mongoose.connect(mongoURL, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        db = connection.collections;
        mongoose.set('strictQuery', false);
    },
    getDb: function() {
        return db;
    }
}
