import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dbConnect from './config/db.config.js'
import userRouter from './routes/user.routes.js'
import fileRouter from './routes/file.routes.js'
import parkingSpotRouter from './routes/parkingSpot.routes.js'
import reservationRouter from './routes/reservation.routes.js'
import stripe from './routes/stripe.routes.js'

dbConnect()

const app = express();

var whitelist = [process.env.REACT_WEB_APP_URL]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Não esquecer de criar variável de ambiente com o endereço do seu app React (local ou no Netlify)
//app.use(cors({ origin: process.env.REACT_APP_URL }));
app.use(cors())

app.get("/api/health", (req, res)=>{
  return res.status(200).json({ok: true})
})
app.use("/api", userRouter);
app.use("/api", fileRouter);
app.use("/api", parkingSpotRouter);
app.use("/api", reservationRouter);
app.use("/api", stripe);

app.listen(Number(process.env.EXPRESS_PORT), () =>
  console.log(`Server up and running at port ${process.env.EXPRESS_PORT}`)
);

import Reservation from './models/Reservation.model.js'
import ParkingSpot from './models/ParkingSpot.model.js'
import Area from './models/Area.model.js'

const main = async () => {
  const reserve = await Reservation.findById("62f406d2dd0e46a6f1572e1b").populate("parkingSpot")

  //const reserve = await Reservation.findOne({_id: "62f388f3b09fff8b00adbabd"})
  //await reserve.populate("parkingSpot").execPopulate()
  //await reserve.populate("userId").execPopulate()
  console.log(reserve)

  // const parkingSpot = await ParkingSpot.findById("62f2b5f3f028ed54f74cdcb8")
  // await parkingSpot.populate("reservations").execPopulate()
  // console.log(parkingSpot.reservations)

  //  const area = await Area.findById("62f19163bd0ba0372948b476")
  //  await area.populate("parkingSpots").populate("reservations").execPopulate()
  //  console.log(area.reservations)

}

// main()
