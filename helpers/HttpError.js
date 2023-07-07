const HttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
// назвали так функцію т.я. створюється і повертається 
// новий об'єкт (!велика літера і noun)
