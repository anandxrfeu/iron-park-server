import { Router } from 'express'
import Stripe from 'stripe';
import 'dotenv/config'


//process.env.STRIPE_API_KEY
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const paymentRouter = Router()

const calculatePrice = (duration) => {
    let price = 0
    if (duration === 5)
        price =  500
    else if(duration ===10)
        price =  1000
    else if (duration === 15)
        price =  1500
    else if (duration > 15)
        price =  ((duration - 15) / 5)*800 + 1500
    return price
}

paymentRouter.post('/create-checkout-session', async (req, res) => {
    const {reservation} = req.body
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Parking',
              description: `Total Duration: ${reservation.parkingDuration} mins`,
              metadata: {
                id: reservation._id,
                checkIn: reservation.checkInTime,
                checkOut: reservation.checkOutTime,
                duration: reservation.parkingDuration,
                licenseNumber: reservation.licensePlateNumber
              }
            },
            unit_amount: calculatePrice(Number(reservation.parkingDuration)),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.REACT_APP_URL}/payment-sucess/${reservation._id}`,
      cancel_url: `${process.env.REACT_APP_URL}/reservation/${reservation._id}`,
    });
  
    return res.status(201).json({url: session.url});
  });

export default paymentRouter;


  // onst calculateOrderAmount = (items) => {
  //     // Replace this constant with a calculation of the order's amount
  //     // Calculate the order total on the server to prevent
  //     // people from directly manipulating the amount on the client
  //     console.log("items -> ",items)
  //     return 1400;
  //   };
  
  // paymentRouter.post("/create-payment-intent", async (req, res) => {
  //     try{
  //         const { items } = req.body;
  //         console.log("req.body -> ", req.body)
  //         // Create a PaymentIntent with the order amount and currency
  //         const paymentIntent = await stripe.paymentIntents.create({
  //             amount: calculateOrderAmount(items),
  //             currency: "brl",
  //             automatic_payment_methods: {
  //                 enabled: true,
  //             },
  //         });
  //         console.log("stripe -> ", paymentIntent)
  //         return res.status(201).json({clientSecret: paymentIntent.client_secret});
  //     }catch(err){
  //         console.log(err)
  //     }
  // })