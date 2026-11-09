module.exports = (req, res) => {
  res.writeHead(303, { Location: "/?paid=0" });
  res.end();
};
