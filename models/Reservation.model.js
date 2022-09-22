import mongoose from "mongoose";
const {Schema, model} = mongoose;

const reservationSchema = new Schema({
    licensePlateNumber : {
        type: String,
        required: true,
        trim: true,
        lowercase: true
        //add validation 
    },
    parkingDuration: {
        type: Number,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    parkingSpot:{
        type: Schema.Types.ObjectId,
        ref: "ParkingSpot"
    }
}, {timestamps: true})

const Reservation = model("Reservation", reservationSchema)

export default Reservation;