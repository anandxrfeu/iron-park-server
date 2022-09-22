import { Router } from "express";
import Area from "../models/Area.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isAdmin from "../middlewares/isAdmin.js"

const areaRouter = Router();

areaRouter.get("/areas", isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const areas = await Area.find({})
        return res.status(200).json(areas)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

areaRouter.post("/areas",  isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const area = await Area.create(req.body)
        return res.status(201).json(area)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

areaRouter.get("/areas/:areaId", isAuthenticated, attachCurrentUser, isAdmin,  async (req, res) =>{
    try{
        const {areaId} = req.params
        const area = await Area.findOne({_id: areaId})
        if(!area){
            return res.status(400).json({msg: "Invalid request"})
        }
        return res.status(200).json(area)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

areaRouter.delete("/areas/:areaId",  isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{
        const {areaId} = req.params
        const area = await Area.findOneAndDelete({_id: areaId})
        if(!area){
            res.status(400).json({msg: "Invalid request"})
        }
        return res.status(204).json()
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

areaRouter.patch("/areas/:areaId",  isAuthenticated, attachCurrentUser, isAdmin, async (req, res) =>{
    try{

        const allowedOperations = ["name", "latitude", "longitude"]
        const requestedUpdates = Object.keys(req.body)
        const isValidOperation = requestedUpdates.every( update =>  allowedOperations.includes(update))
        if(!isValidOperation){
            return res.status(405).json({msg: "Operation nit allowed"})
        }
        const {areaId} = req.params
        const payload = req.body
        const updatedArea = await Area.findByIdAndUpdate(areaId, payload, {new: true})
        if(!updatedArea){
            res.status(400).json({msg: "Invalid request"})
        }
        return res.status(201).json(updatedArea)
    }catch(err){
        console.log(err)
        return res.status(500).json({msg: "Interval server error"})
    }
})

export default areaRouter;