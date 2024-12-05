import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFilePath = path.join(__dirname, "../logs/log.txt");
const timeCheckLogPath = path.join(__dirname, "../logs/log-times.txt");

export function writeLog(message) {
  const logMessage = `${moment()
    .tz("America/Sao_Paulo")
    .format("YYYY-MM-DD HH:mm:ss")} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
}

export function logCheckTime(checkTime) {
  const logMessage = `${moment()
    .tz("America/Sao_Paulo")
    .format("YYYY-MM-DD HH:mm:ss")} - Script Iniciado: ${checkTime}\n`;
  fs.appendFileSync(timeCheckLogPath, logMessage, "utf8");
}

export function deleteLogTimesIfNeeded() {
  const now = moment().tz("America/Sao_Paulo");
  if (
    now.hour() === 18 &&
    now.minute() === 10 &&
    fs.existsSync(timeCheckLogPath)
  ) {
    try {
      fs.unlinkSync(timeCheckLogPath);
      writeLog("Arquivo log-times.txt excluído às: " + now.format("HH:mm"));
    } catch (err) {
      writeLog(`Erro ao excluir log-times.txt: ${err.message}`);
    }
    process.exit(0);
  }
}

setInterval(deleteLogTimesIfNeeded, 60000);
