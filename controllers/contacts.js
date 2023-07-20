const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 3, favorite } = req.query;

  const skip = (page - 1) * limit;
  const filter = favorite ? { owner, favorite } : { owner };
  const allContacts = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
    favorite,
  }).populate("owner", "name email subscription"); // повертає лише книжки юзера

  res.json(allContacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const oneContact = await Contact.findById(contactId);

  if (!oneContact) {
    throw HttpError(404, "Not found");
  }
  res.json(oneContact);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;

  const newContacts = await Contact.create({ ...req.body, owner }); // кожний контакт буде записан за певним юзером

  res.status(201).json(newContacts);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await Contact.findByIdAndDelete(contactId);

  if (!removeContact) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "Contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updateContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updateContact);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

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
  updateFavorite: ctrlWrapper(updateFavorite),
};
