export const HttpError = ({ status = 500, message = "Server error" }) => {
  const error = new Error();
  error.message = message;
  error.status = status;

  throw error;
};
