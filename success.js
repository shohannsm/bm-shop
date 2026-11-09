const { confirm } = require("../lib/shop");

module.exports = async (req, res) => {
  let to = "/?paid=0";
  try {
    const d = await confirm(req.body);
    if (d) to = "/?paid=1&tid=" + encodeURIComponent(d.tran_id) + "&amt=" + encodeURIComponent(d.value_a);
  } catch (e) {}
  res.writeHead(303, { Location: to });
  res.end();
};
