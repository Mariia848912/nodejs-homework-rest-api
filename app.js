const express = require("express");
const logger = require("morgan"); // це middleware, яка виводить в консоль інформацію про запит
const cors = require("cors");
const dotenv = require("dotenv"); // require("dotenv").config(); - можливо так написати
// читає файл env і додає дані до process.env (змінні оточення )
const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/auth");

const app = express(); // виклик функції express і є веб-сервіс

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
dotenv.config(); // читає файл env і додає дані до process.env (змінні оточення )
app.use(logger(formatsLogger));
app.use(cors()); // це для того, щоб express не відмовлял, якщо фронт и бєк на різних шляхах

app.use(express.json()); // ця middleware перевіряє чи є тіло в запиті.якщо є, то дивиться який по
// заголовку Content-type, якщо json формат,  то робить express.json()
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
}); // обробка помилок коли прийшов запит на не існуючий адрес

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
}); // інша обробка помилок

module.exports = app;
