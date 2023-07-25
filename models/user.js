const { Schema, model } = require("mongoose");

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;

const messageErrorEmailJoi =
  'A valid email address has 4 parts: recipient name (John2), @ symbol, domain name (gmail), top-level domain (.com). For example: "John52@gmail.com".';
const subscriptionTypes = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegExp,
      unique: true,
    },
    subscription: {
      type: String,
      enum: {
        values: subscriptionTypes,
        message: 'Subscription" must be one of [starter, pro, business]', // не працює. ЧОМУ????????
      },
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError); // якщо в userSchema станеться помилка, то ця мідлвара спрацює. робимо її 400, а то вона вилітає як 500

const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .messages({ "any.required": "Missing required name field" }),
  email: Joi.string()
    .pattern(new RegExp(emailRegExp))
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.pattern.base": `${messageErrorEmailJoi}`,
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Missing required name field" }),
  subscription: Joi.string().valid(...subscriptionTypes),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(new RegExp(emailRegExp))
    .required()
    .messages({
      "any.required": "Missing required email field",
      "string.pattern.base": `${messageErrorEmailJoi}`,
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({ "any.required": "Missing required name field" }),
});

const updateSubscriptionchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionTypes)
    .required()
    .messages({ "any.required": "Missing required subscription field" }),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSubscriptionchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
