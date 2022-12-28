const mongoose = require('mongoose');


const connectDB=async ()=>{
    mongoose.set('strictQuery', false);
 const con= mongoose.connect(process.env.MONGO_URI,()=>{
    console.log('connected to mongodb ');
    });
}

exports.connectDB = connectDB;

