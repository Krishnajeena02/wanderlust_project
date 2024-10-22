const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");




// const mongourl =  "mongodb://127.0.0.1:27017/wanderlust";
const  dbUrl=process.env.ATLASDB_URL;


main().then((res)=>{
    console.log("connected to DB.")
}).catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoose.connect(dbUrl);
};

const initdb = async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({
        
        ...obj,
        owner:"670a1e78be118fa34bb39491"
    }))
    await listing.insertMany(initdata.data);
    console.log("data was init")
}

initdb();