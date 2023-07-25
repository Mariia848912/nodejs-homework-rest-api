const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  console.log(name, code);
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
}; // name "MongoServerError" && code  1100 - утворюється якщо ми поле поставили унікальним, а нам приходить ще раз нприклад користовач с таким імейлом

module.exports = handleMongooseError;
