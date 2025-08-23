const crypto = require("crypto");

require("dotenv").config();
const MERCHANT_ID = process.env.MERCHANT_ID;
const PAYMENT_SALT_KEY = process.env.PAYMENT_SALT_KEY;
const MERCHANT_BASE_URL = process.env.MERCHANT_BASE_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const paymentController = async (req, res, transactionId) => {
  try {
    const merchantId = MERCHANT_ID;
    const saltkey = PAYMENT_SALT_KEY;
    const baseUrl = MERCHANT_BASE_URL; // ✅ use PhonePe’s sandbox endpoint
    const frontendUrl = FRONTEND_URL;

    // amount comes from frontend body
    const { amount } = req.body;
    const intAmount = parseInt(amount);

    const payload = {
      merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: "MUID-" + Date.now(),
      amount: intAmount * 100, // convert to paise
      redirectUrl: `${frontendUrl}/payment-status?txnId=${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${frontendUrl}/payment-status?txnId=${transactionId}`, // ✅ callback
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode payload
    const payloadString = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    // Generate checksum
    const sha256 = crypto
      .createHash("sha256")
      .update(payloadString + "/pg/v1/pay" + saltkey)
      .digest("hex");

    const checksum = sha256 + "###1";

    // Call PhonePe API
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        accept: "application/json",
      },
      body: JSON.stringify({ request: payloadString }),
    });

    const data = await response.json();

    return res.json({
      msg: "Redirect to payment gateway",
      paymentUrl: data.data.instrumentResponse.redirectInfo.url,
      transactionId,
    });
  } catch (error) {
    return res.json({ msg: error.message });
  }
};

module.exports = { paymentController };
