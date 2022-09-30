import { Router } from "express";
import Reservation from "../models/Reservation.model.js"
import ParkingSpot from "../models/ParkingSpot.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js";

const reservationRouter = Router();

//get all reservations (admin) ??
reservationRouter.get("/reservations", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        let reservations = await Reservation.find({}, "-__v").populate("parkingSpot")
        if (req.query && req.query.area){
            reservations = reservations.filter( reservation => reservation.parkingSpot.area === req.query.area )
        }
        return res.status(200).json(reservations)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

//get all reservation for a user
reservationRouter.get("/reservations/me", isAuthenticated, attachCurrentUser, async (req, res) =>{
    try{
        const reservation = await Reservation.find({userId: req.currentUser._id}, "-__v")
        return res.status(200).json(reservation)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

// create a reservation
reservationRouter.post("/reservations",  isAuthenticated, attachCurrentUser, async (req, res) =>{
    // add validation if user has active reservaion dont allow a new one
    try{
        const reservation = await Reservation.create({
                                            ...req.body, 
                                            userId: req.currentUser._id})
        reservation.__v = undefined
        return res.status(201).json(reservation)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

reservationRouter.get("/reservations/:reservationId", isAuthenticated, attachCurrentUser,  async (req, res) =>{
    try{
        const {reservationId} = req.params
        const reservation = await Reservation.findOne({_id: reservationId}, "-__v")
        if(!reservation){
            return res.status(400).json({msg: "Invalid request"})
        }
        if(reservation.userId.toString() !== req.currentUser._id.toString()){
            return res.status(400).json({msg :"Not authorized"})
        }
        await reservation.populate("userId").execPopulate()
        return res.status(200).json(reservation)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

reservationRouter.delete("/reservations/:reservationId",  isAuthenticated, attachCurrentUser, async (req, res) =>{
    try{
        const {reservationId} = req.params
        const reservation = await Reservation.findOneAndDelete({_id: reservationId})
        if(!reservation){
            res.status(400).json({msg: "Invalid request"})
        }
        if(reservation.userId.toString() !== req.currentUser._id.toString()){
            return res.status(400).json({msg :"Not authorized"})
        }
        return res.status(204).json()
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

reservationRouter.patch("/reservations/:reservationId",  isAuthenticated, attachCurrentUser, async (req, res) =>{
    try{
        const allowedOperations = ["licensePlateNumber", "parkingDuration"]
        const requestedUpdates = Object.keys(req.body)
        const isValidOperation = requestedUpdates.every( update =>  allowedOperations.includes(update))
        if(!isValidOperation){
            return res.status(405).json({msg: "Operation nit allowed"})
        }
        const {reservationId} = req.params

        const reservation = await Reservation.findOne({_id: reservationId})
        if(!reservation){
            res.status(400).json({msg: "Invalid request"})
        }
        if(reservation.userId.toString() !== req.currentUser._id.toString()){
            return res.status(400).json({msg :"Not authorized"})
        }
        const payload = req.body
        const updatedreservation = await Reservation.findByIdAndUpdate(reservationId, payload, {new: true})
        updatedreservation.__v = undefined
        if(!updatedreservation){
            res.status(400).json({msg: "Invalid request"})
        }
        return res.status(201).json(updatedreservation)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

export default reservationRouter;