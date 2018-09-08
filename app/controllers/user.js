const profile = (req, res) => {
  const { user } = req;
  res.status(200).json({
    message: 'Successfully collected user information',
    user,
  });
};

module.exports = {
  profile,
};
