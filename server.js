const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connecttoMongo = require("./utiles/db.js");
const productrouter = require("./routes/productRoute")
const authrouter = require("./routes/userRoute")
const striperouter = require("./routes/stripe")
const { Order } = require("./models/order.js");
const { v4: uuidv4 } = require('uuid');
dotenv.config();
connecttoMongo();
const stripe = require('stripe')(process.env.STRIPE_KEY);

var cors = require("cors");
const port = process.env.PORT || 8080;


app.use(express.json())
app.use(cors())

app.use("/api/product",productrouter)
app.use("/user/api", authrouter)
app.use("/stripe", striperouter)



const createOrder = async (customer, payment,cartitems,userId,amount) => {
    
    console.log(cartitems)
    const Items = cartitems;

    const products = Items.map((item) => {
        return {
            productId: item.id,
            quantity: item.cartQuantity,
        };
    });

    const newOrder = new Order({
        userId:userId,
        customerId:customer.id,
        paymentId:payment.id,
        products,
        subtotal:amount-35,
        total: amount,
        shipping:payment.shipping,
        payment_status:payment.paid,
    });

    try {
        const savedOrder = await newOrder.save();
        console.log("Processed Order:", savedOrder);
    } catch (err) {
        console.log(err);
    }
};

app.post('/payment',async(req, res) => {
    let status, error;
    let data = req.body.data
    
    const { token,cartitems,amount,userId } = req.body;
    console.log("mydata",token, cartitems, amount, userId)
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source:token.id
         
        })
        if (customer) {
            const payment = await stripe.charges.create({
                customer: customer.id,
                amount,
                currency: 'usd',

                receipt_email: token.email,
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        postal_code:token.card.address_zip,
                        country: token.card.address_country,
                        city: token.card.address_city
                    }
                }
            }, {
                idempotencyKey: uuidv4()
            });
            if (payment) {
                createOrder(customer,payment,cartitems,userId,amount)
               
                status = 'success';
                res.json({ error, status });
            }
        }

        
       
    } catch (error) {
        console.log(error);
        status = 'Failure';
        res.json({ error, status });
    }
                   
});

app.listen(port, () => {
    console.log(`server connected to localhost ${port}`)
})




