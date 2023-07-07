const express = require("express");
const logger = require("morgan"); // це middleware, яка виводить в консоль інформацію об запиті
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express(); // виклик функції express і є веб-сервіс

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors()); // це для того, щоб express не відмовлял, якщо фронт и бєк на різних шляхах

app.use(express.json()); // ця middleware перевіряє чи є тіло в запиті.якщо є, то дивиться який по
// заголовку Content-type, якщо json формат,  то робить express.json()

app.use("/api/contacts", contactsRouter); // всі маршрути які починаються з /api/contacts шукати тут

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
}); // обробка помилок коли прийшов запит на не існуючий адрес

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
}); // інша обробка помилок

module.exports = app;
