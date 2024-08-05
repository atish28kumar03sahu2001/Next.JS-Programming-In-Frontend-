const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://kumarsahuatish:ALS8oBbpXx5HaT7f@next-crud.y6nptfb.mongodb.net/";
if(!MONGO_URI) {
    throw new Error (
        "Please define the MONGODB_URI environment variable inside lib/mongoDB.js"
    );
}

let cached = global.mongoose;
if(!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

async function connectToDatabase() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose)=>{
            return mongoose;
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connectToDatabase;