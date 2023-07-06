const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
// ця middleware перевіряє чи є тіло в запиті.якщо є, то дивиться який по
// заголовку Content-type, якщо json формат,  то робить express.json()
app.use(express.json());

app.use("/api/contacts", contactsRouter);
// обробка помилок коли прийшов запит на не існуючий адрес
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});
// інша обробка помилок
app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
