const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const emailRegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const messageErrorEmailJoi =
  'A valid email address has 4 parts: recipient name (John2), @ symbol, domain name (gmail), top-level domain (.com). For example: "John52@gmail.com".';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegExp,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
); // вимоги до обїєкту

contactSchema.post("save", handleMongooseError); // якщо в contactSchema станеться помилка, то ця мідлвара спрацює. робимо її 400, а то вона вилітає як 500

const addSchema = Joi.object({
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
  phone: Joi.string()
    .required()
    .messages({ "any.required": "Missing required phone field" }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": "Missing required favorite field" }),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
};

const Contact = model("contact", contactSchema); // це клас, який буде працювати з колекцією

module.exports = {
  Contact,
  schemas,
};
