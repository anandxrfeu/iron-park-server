import mongoose from "mongoose";

const {Schema, model} = mongoose;

const AreaSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true,
        //add validation
    },
    longitude: {
        type: String,
        required: true,
        //add validation
    }
});

AreaSchema.virtual("parkingSpots", {
    ref: "ParkingSpot",
    localField: "_id",
    foreignField: "parkingSpotArea"
})

const Area = model("Area", AreaSchema);

export default Area