const express = require("express");
const contacts = require("../../models/contacts");
const router = express.Router();
const { HttpError } = require("../../helpers");

const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Missing required name field" }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "Missing required email field" }),
  phone: Joi.string()
    .required()
    .messages({ "any.required": "Missing required phone field" }),
});

router.get("/", async (_, res, next) => {
  try {
    const allContacts = await contacts.listContacts();
    res.json(allContacts);
  } catch (error) {
    next(error);
    /*
    інший варіант зловити одну помилку
     res.status(500).json({ message: "Server error" });
    */
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await contacts.getContactById(contactId);
    if (!oneContact) {
      throw HttpError(404, "Not found");
    }
    res.json(oneContact);
  } catch (error) {
    // коли в next передаэмо error, то express шукаэ обробник попилок.
    // ця функція с 4 ма параметрами в файлі app.js
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const newContacts = await contacts.addContact(req.body);
    res.status(201).json(newContacts);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removeContact = await contacts.removeContact(contactId);
    if (!removeContact) {
      throw HttpError(404, "Not found");
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;

    const updateContact = await contacts.updateContact(contactId, req.body);
    if (!updateContact) {
      throw HttpError(404, "Not found");
    }
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
