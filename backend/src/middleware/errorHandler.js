const errorHandler = (err, req, res, next) => {
  res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
};

module.exports = errorHandler;