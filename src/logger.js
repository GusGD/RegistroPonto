const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/log.txt");
const timeCheckLogPath = path.join(__dirname, "../logs/log-times.txt");

function writeLog(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
}

function logCheckTime(checkTime) {
  const logMessage = `${new Date().toISOString()} - Verificação de horário: ${checkTime}\n`;
  fs.appendFileSync(timeCheckLogPath, logMessage, "utf8");
}

function deleteLogTimesIfNeeded() {
  const now = new Date();
  if (
    now.getHours() === 18 &&
    now.getMinutes() === 9 &&
    fs.existsSync(timeCheckLogPath)
  ) {
    try {
      fs.unlinkSync(timeCheckLogPath);
      console.log("Arquivo log-times.txt excluído às 19h.");
      writeLog("Arquivo log-times.txt excluído às 19h.");
    } catch (err) {
      console.error("Erro ao excluir log-times.txt:", err.message);
      writeLog(`Erro ao excluir log-times.txt: ${err.message}`);
    }
  }
}

setInterval(deleteLogTimesIfNeeded, 60000);

module.exports = { writeLog, logCheckTime };
