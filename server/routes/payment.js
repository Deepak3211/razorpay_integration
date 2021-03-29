require('dotenv').config();

const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

router.post('/orders', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: 50100,
      currency: 'INR',
      receipt: 'receipt_order_01',
    }
    
    const order = await instance.orders.create(options);
    if (!order) {
      return res.status(500).send(' Server Error')
    }
    res.json(order);
  } catch (error) {
    res.status(500).send(' Server Error')
    
  }
});

router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
      // console.log(req.body)
      
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const hash = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET);

        hash.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = hash.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success 😃",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
      res.status(500).send(error);
      // console.log(error);
    }
});
module.exports = router;