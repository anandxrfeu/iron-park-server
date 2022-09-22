import { Router } from "express";
import ParkingSpot from "../models/ParkingSpot.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js"

const parkingSpotRouter = Router();

parkingSpotRouter.get("/areas/:areaId/parkingspots", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        console.log("req.params.areaId: ", req.params.areaId)
        const parkingSpots = await ParkingSpot.find({parkingSpotArea: req.params.areaId})
        return res.status(200).json(parkingSpots)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

parkingSpotRouter.post("/parkingspots", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const parkingSpot = await ParkingSpot.create(req.body)
        return res.status(201).json(parkingSpot)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

parkingSpotRouter.get("/parkingspots/:parkingspotId", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const {parkingspotId} = req.params
        const parkingSpot = await ParkingSpot.findOne({_id: parkingspotId})
        if(!parkingSpot){
            return res.status(400).json({msg: "Invalid request"})
        }
        return res.status(200).json(parkingSpot)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

parkingSpotRouter.delete("/parkingspots/:parkingspotId", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
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

        const allowedOperations = ["cordinates"]
        const requestedUpdates = Object.keys(req.body)
        const isValidOperation = requestedUpdates.every( update =>  allowedOperations.includes(update))
        
        if(!isValidOperation){
            return res.status(405).json({msg: "Operation nit allowed"})
        }
        const {parkingspotId} = req.params
        const payload = req.body
        const updatedParkingSpot = await ParkingSpot.findByIdAndUpdate(parkingspotId, payload, {new: true})
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