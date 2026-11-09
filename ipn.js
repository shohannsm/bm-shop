const { confirm } = require("../lib/shop");

// SSLCommerz calls this by itself after a payment. Orders are also visible
// in your SSLCommerz merchant panel (with product names and customer details).
module.exports = async (req, res) => {
  try {
    const d = await confirm(req.body);
    if (d) console.log("PAID", d.tran_id, d.value_a, d.cus_name, d.cus_phone);
  } catch (e) {}
  res.status(200).send("OK");
};
