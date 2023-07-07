// функція декоратор - функція, що отримає функцію і повертає

const ctrlWrapper = (ctrl) => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};

// коли в next передаэмо error, то express шукаэ обробник попилок.
// ця функція с 4 ма параметрами в файлі app.js
// module.exports = {
//   ctrlWrapper,
// };
module.exports = ctrlWrapper;
