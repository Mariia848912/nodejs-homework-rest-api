const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { changeImage, sendEmail } = require("../helpers");

const { nanoid } = require("nanoid");
require("dotenv").config();

const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); // робимо запит, щоб подивитися є чи цей имеєл в базі и повернути уникальний месседж помилки

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcryptjs.hash(password, 10); // 10 це сіль - додаткові символи
  const avatarURL = gravatar.url(email); // повертається посилання на тимчасову аватарку
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const emailOptions = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">
  Click verify email</a>`,
  };
  await sendEmail(emailOptions);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const emailOptions = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">
  Click verify email</a>`,
  };
  await sendEmail(emailOptions);
  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }); // робимо запит, щоб подивитися є чи цей имеєл в базі и повернути уникальний месседж помилки

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email  not verified");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });

  res.status(201).json({
    message: "Logout success",
  });
};
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findByIdAndUpdate(_id, { subscription });

  res.status(200).json({
    message: `Subscription was changed to ${subscription.toUpperCase()}`,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file; // беремо тимчасовий шлях

  const filename = `${_id}_${originalname}`; // щоб файли з однаковим ім'ям не перезаписувалися

  const resultUpload = path.join(avatarsDir, filename); // шлях де має зберігатися
  await changeImage(tempUpload);
  await fs.rename(tempUpload, resultUpload); // переміщаємо з тимчасового місця в result
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL }); // записуємо новий шлях в базу

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
