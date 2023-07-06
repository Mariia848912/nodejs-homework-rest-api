const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const allContacts = await contacts.listContacts();
  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const oneContact = await contacts.getContactById(contactId);
  if (!oneContact) {
    throw HttpError(404, "Not found");
  }
  res.json(oneContact);
};

const addContact = async (req, res) => {
  const newContacts = await contacts.addContact(req.body);
  res.status(201).json(newContacts);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await contacts.removeContact(contactId);
  if (!removeContact) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;

  const updateContact = await contacts.updateContact(contactId, req.body);
  if (!updateContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updateContact);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
};
