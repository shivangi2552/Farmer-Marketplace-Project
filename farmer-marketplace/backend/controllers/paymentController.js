const paypal = require('../utils/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

exports.createOrder = async (req, res) => {
  const { total } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: total
      }
    }]
  });

  try {
    const order = await paypal.execute(request);
    res.status(201).json({ id: order.result.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.captureOrder = async (req, res) => {
  const { orderID } = req.body;

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await paypal.execute(request);
    res.status(200).json({ capture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
