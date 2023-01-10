const stripe = require('stripe')('sk_test_51Jw9OEBh107PE7HCBRIwZVUVMkdIBeTvvRp1a95GKCAGQgG6pZCDbyH0PrLfRRJ0x9MLZ7TkPnROYIPzG28oFc3Y00PIDl4oc4');


const stripeCheckout = async (req, res) => {
    // console.log("tushar")
    // const myheader = req.header('Authorization')
    // const token =myheader.split(" ")[1]
    // const stripe = Stripe(process.env.STRIPE_KEY)
    // console.log(token)
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/checkout-success',
        cancel_url: 'http://localhost:3000/cart',
    });

    res.send({ uri: session.url });
}

module.exports = {
    stripeCheckout
}