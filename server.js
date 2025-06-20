// server.js
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe('sk_test_YOUR_SECRET_KEY'); // ⬅️ Replace with your real Stripe Secret Key

app.use(cors());
app.use(express.json());

app.post('/charge', async (req, res) => {
  const { token, amount } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ success: false, error: 'Missing token or amount' });
  }

  try {
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: token,
      description: 'Voiceflow chat payment'
    });

    res.json({ success: true, charge });
  } catch (err) {
    console.error('Stripe charge failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Stripe backend listening on port ${PORT}`));
