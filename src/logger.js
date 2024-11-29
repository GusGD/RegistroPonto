const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const logFilePath = path.join(__dirname, "../logs/log.txt");
const timeCheckLogPath = path.join(__dirname, "../logs/log-times.txt");

function writeLog(message) {
  const logMessage = `${moment()
    .tz("America/Sao_Paulo")
    .format("YYYY-MM-DD HH:mm:ss")} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
}

function logCheckTime(checkTime) {
  const logMessage = `${moment()
    .tz("America/Sao_Paulo")
    .format("YYYY-MM-DD HH:mm:ss")} - Script Iniciado: ${checkTime}\n`;
  fs.appendFileSync(timeCheckLogPath, logMessage, "utf8");
}

function deleteLogTimesIfNeeded() {
  const now = moment().tz("America/Sao_Paulo");
  if (
    now.hour() === 18 &&
    now.minute() === 4 &&
    fs.existsSync(timeCheckLogPath)
  ) {
    try {
      fs.unlinkSync(timeCheckLogPath);
      writeLog("Arquivo log-times.txt excluído às: " + now.format("HH:mm"));
    } catch (err) {
      writeLog(`Erro ao excluir log-times.txt: ${err.message}`);
    }
  }
}

setInterval(deleteLogTimesIfNeeded, 60000);

module.exports = { writeLog, logCheckTime };
