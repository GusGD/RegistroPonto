const { format } = require("date-fns");

const holidays = [
  // Adicionar feriados da empresa aqui
];

function isHoliday(date) {
  const formattedDate = format(date, "yyyy-MM-dd");
  return holidays.includes(formattedDate);
}

module.exports = { isHoliday };
