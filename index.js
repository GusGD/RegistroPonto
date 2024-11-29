const { clockIn } = require("./src/clockIn");
const { logCheckTime } = require("./src/logger");
const { format } = require("date-fns");

function checkAndClockIn() {
  const now = new Date();
  const checkTime = format(now, "HH:mm:ss");

  logCheckTime(checkTime);

  clockIn(now);
}
console.log("Script de ponto iniciado ás: " + format(new Date(), "HH:mm:ss"));
setInterval(checkAndClockIn, 60 * 1000);
