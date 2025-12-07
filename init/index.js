import 'dotenv/config';
import mongoose from "mongoose";
import initdata from "./data.js";
import listing from "../models/listing.js";

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB.");
}

main().catch(console.error);

async function initdb() {
  const dataWithGeometry = initdata.data.map(obj => ({
    ...obj,
    owner: "670a1e78be118fa34bb39491",
    geometry: obj.geometry || { type: "Point", coordinates: [0, 0] }
  }));

  await listing.insertMany(dataWithGeometry);
  console.log("Data initialized successfully!");
}

initdb();
