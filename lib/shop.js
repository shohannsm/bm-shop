const crypto = require("crypto");

// Product prices live here too, so nobody can change a price in the browser.
// Keep this list the same as the list in index.html.
const PRODUCTS = {
  1: { n: "Cotton Panjabi", p: 1200 },
  2: { n: "Men's Polo T-Shirt", p: 550 },
  3: { n: "Women's Three-Piece", p: 2400 },
  4: { n: "Denim Jeans", p: 1500 },
  5: { n: "Wireless Earbuds", p: 1800 },
  6: { n: "Smart Watch", p: 3200 },
  7: { n: "Power Bank 10000mAh", p: 1400 },
  8: { n: "Bluetooth Speaker", p: 2100 }
};

// Test mode is ON unless you set SSL_SANDBOX=false in Vercel.
const SANDBOX = process.env.SSL_SANDBOX !== "false";
const HOST = SANDBOX ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";

function sign(tranId, amount) {
  return crypto
    .createHmac("sha256", process.env.SSL_STORE_PASSWORD || "")
    .update(tranId + "|" + amount)
    .digest("hex");
}

async function confirm(body) {
  if (!body || !body.val_id) return null;
  const q = new URLSearchParams({
    val_id: String(body.val_id),
    store_id: process.env.SSL_STORE_ID || "",
    store_passwd: process.env.SSL_STORE_PASSWORD || "",
    format: "json"
  });
  const r = await fetch(HOST + "/validator/api/validationserverAPI.php?" + q);
  const d = await r.json();
  if (!d || (d.status !== "VALID" && d.status !== "VALIDATED")) return null;
  if (d.value_b !== sign(d.tran_id, d.value_a)) return null;
  if (Number(d.amount) !== Number(d.value_a)) return null;
  return d;
}

module.exports = { PRODUCTS, HOST, sign, confirm };
