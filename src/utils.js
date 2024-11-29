const { format } = require("date-fns");

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date) {
  const holidays = ["01-01", "25-12"];
  const dateStr = format(date, "dd-MM");
  return holidays.includes(dateStr);
}

module.exports = { isWeekend, isHoliday };
