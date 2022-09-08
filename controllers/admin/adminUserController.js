exports.test = async (req, res, next) => {
  try {
      res.status(200).send({'ok':'ok'});
  } catch (e) {}
};
