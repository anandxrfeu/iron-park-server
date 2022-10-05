import mongoose from "mongoose";

const {Schema, model} = mongoose;

const parkingSpotSchema = new Schema({
    reserved:{
        type: Boolean,
        default: false,
        required: true
    },
    coordinates:{
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
    },
    area:{
        name:{
            type: String
        },
        coordinates:{
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
        }
    }
}, {
    timestamps: true
  });

parkingSpotSchema.virtual("reservations", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "parkingSpot"
})

const ParkingSpot = model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot


/*

import mongoose from "mongoose";

const {Schema, model} = mongoose;

const parkingSpotSchema = new Schema({
    reserved:{
        type: Boolean,
        default: false,
        required: true
    },
    coordinates:{
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
    },
    area:{
        type: String
    }
}, {
    timestamps: true
  });

parkingSpotSchema.virtual("reservations", {
    ref: "Reservation",
    localField: "_id",
    foreignField: "parkingSpot"
})

const ParkingSpot = model("ParkingSpot", parkingSpotSchema);

export default ParkingSpot

*/