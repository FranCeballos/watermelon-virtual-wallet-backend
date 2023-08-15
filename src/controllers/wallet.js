exports.getUser = (req, res, next) => {
  res.status(200).json(JSON.stringify({ name: "Francisco" }));
};
