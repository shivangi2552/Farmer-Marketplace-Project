const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

const environment = process.env.PAYPAL_MODE === 'live'
  ? new checkoutNodeJssdk.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new checkoutNodeJssdk.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = client;
