import { Router } from "express";
import ParkingSpot from "../models/ParkingSpot.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js"

const parkingSpotRouter = Router();

parkingSpotRouter.post("/parkingspots", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const parkingSpot = await ParkingSpot.create(req.body)
        parkingSpot.__v = undefined
        return res.status(201).json(parkingSpot)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

parkingSpotRouter.get("/parkingspots/:parkingspotId", async (req, res) =>{
    try{
        const {parkingspotId} = req.params
        const parkingSpot = await ParkingSpot.findOne({_id: parkingspotId}, "-__v")
        if(!parkingSpot){
            return res.status(400).json({msg: "Invalid request"})
        }
        return res.status(200).json(parkingSpot)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal server error"})
    }
})

parkingSpotRouter.get("/parkingspots", async (req, res) => {
    try{
        const parkingSpots = await ParkingSpot.find(
            req.query.area ? {area: req.query.area} : {}
            , "-__v")
        return res.status(200).json(parkingSpots)

    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Internal server error"})
    }
} )

parkingSpotRouter.delete("/parkingspots/:parkingspotId", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        // add validation to only delete parking spots currently not in use 
        const {parkingspotId} = req.params
        const parkingSpot = await ParkingSpot.findOneAndDelete({_id: parkingspotId})
        if(!parkingSpot){
            res.status(400).json({msg: "Invalid request"})
        }
        return res.status(204).json()
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

parkingSpotRouter.patch("/parkingspots/:parkingspotId", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{

        const allowedOperations = ["coordinates", "reserved"]
        const requestedUpdates = Object.keys(req.body)
        const isValidOperation = requestedUpdates.every( update =>  allowedOperations.includes(update))
        
        if(!isValidOperation){
            return res.status(405).json({msg: "Operation not allowed"})
        }
        const {parkingspotId} = req.params
        const payload = req.body
        const updatedParkingSpot = await ParkingSpot.findByIdAndUpdate(parkingspotId, payload, {new: true})
        updatedParkingSpot.__v = undefined
        if(!updatedParkingSpot){
            res.status(400).json({msg: "Invalid request"})
        }
        return res.status(201).json(updatedParkingSpot)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

export default parkingSpotRouter;