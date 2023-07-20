const { User } = require("../models/user"); // імпортуємо, щоб перевірити юзер, який направляє нам токен чи він досі є в DB
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers; // ставимо значеня по дефолту, т.к. якщо токен не прийде буде undefined і код на split ляже
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY); // перевірка чи ми робили цей токен
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized")); // немає користовоча в базі
    }

    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};

module.exports = authenticate;
