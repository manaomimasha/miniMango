import mongoose from "mongoose"
const uriMongo = process.env.MONGO_URI 

export const db = mongoose.connect(uriMongo)
.then(db=>{console.log('database is connected yey')})
.catch(err=>{console.log("error", err)})