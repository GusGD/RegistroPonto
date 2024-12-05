import { clockIn } from "./src/clockIn.js";
import { logCheckTime } from "./src/logger.js";
import { format } from "date-fns";

let isClockingIn = false;

async function checkAndClockIn() {
  const now = new Date();
  const checkTime = format(now, "HH:mm:ss");

  logCheckTime(checkTime);

  if (isClockingIn) {
    console.log(
      "Já estamos registrando o ponto. Aguardando próxima tentativa..."
    );
    return;
  }

  isClockingIn = true;
  await clockIn(now);
  isClockingIn = false;
}

console.log("Script de ponto iniciado às: " + format(new Date(), "HH:mm:ss"));
setInterval(checkAndClockIn, 60 * 1000);
