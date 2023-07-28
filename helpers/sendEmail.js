const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { META_PASSWORD } = process.env;
const emailSender = "m.sarbieieva@meta.ua";

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,

  secure: true,
  auth: {
    user: emailSender,
    pass: META_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: emailSender };
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
