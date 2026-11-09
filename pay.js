const { PRODUCTS, HOST, sign } = require("../lib/shop");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const b = req.body || {};
    const items = Array.isArray(b.items) ? b.items : [];
    let total = 0;
    const names = [];
    for (const it of items) {
      const p = PRODUCTS[it.id];
      const q = Math.floor(Number(it.q));
      if (!p || !(q > 0) || q > 20) return res.status(400).json({ error: "Bad cart" });
      total += p.p * q;
      names.push(p.n + " x" + q);
    }
    if (!total) return res.status(400).json({ error: "Cart is empty" });

    const name = String(b.name || "").trim().slice(0, 60);
    const phone = String(b.phone || "").trim();
    const addr = String(b.address || "").trim().slice(0, 200);
    if (!name || !addr) return res.status(400).json({ error: "Please type your name and address" });
    if (!/^01\d{9}$/.test(phone)) return res.status(400).json({ error: "Phone must be like 01712345678" });

    const tranId = "BM" + Date.now() + Math.floor(Math.random() * 1000);
    const site = "https://" + req.headers.host;
    const amount = String(total);

    const params = new URLSearchParams({
      store_id: process.env.SSL_STORE_ID || "",
      store_passwd: process.env.SSL_STORE_PASSWORD || "",
      total_amount: amount,
      currency: "BDT",
      tran_id: tranId,
      success_url: site + "/api/success",
      fail_url: site + "/api/fail",
      cancel_url: site + "/api/fail",
      ipn_url: site + "/api/ipn",
      cus_name: name,
      cus_email: "customer@bmshop.com",
      cus_add1: addr,
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: phone,
      shipping_method: "Courier",
      ship_name: name,
      ship_add1: addr,
      ship_city: "Dhaka",
      ship_postcode: "1000",
      ship_country: "Bangladesh",
      num_of_item: String(items.length),
      product_name: names.join(", ").slice(0, 250),
      product_category: "General",
      product_profile: "general",
      value_a: amount,
      value_b: sign(tranId, amount)
    });

    const r = await fetch(HOST + "/gwprocess/v4/api.php", { method: "POST", body: params });
    const d = await r.json();
    if (d.status !== "SUCCESS" || !d.GatewayPageURL) {
      return res.status(502).json({ error: "Payment page could not open. Check store ID and password." });
    }
    return res.status(200).json({ url: d.GatewayPageURL, tran: tranId, total: total });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};
