const responseMiddleware = (req, res, next) => {
  const { data, err } = res;

  if (data) {
    res.status(200).json(data);
    return;
  }

  next(err);
};

export { responseMiddleware };
