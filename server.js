// server.js - Stripe PaymentIntent backend for Voiceflow

const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51OQbm4KPZ8owkTpxBFDy6PiyJ204xN0IqqjhFfzpaaUmScOTKMhjfOPjr1N5PuhZ5SiENwCdSJLBCsGmj7M8yVa900iBfjQKct'); // Replace with your actual Stripe secret key

app.use(cors());
app.use(express.json());

// Create a PaymentIntent and return the clientSecret
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('PaymentIntent Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Stripe backend running on port ${PORT}`));
