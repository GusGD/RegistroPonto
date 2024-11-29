const { clockIn } = require("./src/clockIn");
const { logCheckTime } = require("./src/logger");
const { format } = require("date-fns");

function checkAndClockIn() {
  const now = new Date();
  const checkTime = format(now, "HH:mm:ss");

  console.log(`Verificando horário: ${checkTime}`);
  logCheckTime(checkTime);

  clockIn(now);
}

setInterval(checkAndClockIn, 60 * 1000);
