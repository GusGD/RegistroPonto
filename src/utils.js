import { format } from "date-fns";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

let holidayCache = null;
let fetchAttempted = false;

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

async function isHoliday(date) {
  if (fetchAttempted && holidayCache === null) {
    console.warn(
      "Tentativa anterior de obter feriados falhou. Usando cache vazio."
    );
    return [];
  }

  if (holidayCache !== null) {
    return holidayCache;
  }

  const urlApi = process.env.URL_API;
  const tokenApi = process.env.TOKEN_API;

  try {
    fetchAttempted = true;
    const year = date.getFullYear();
    const response = await fetch(`${urlApi}${year}?token=${tokenApi}`);

    if (!response.ok) {
      console.error(
        `Erro ao buscar feriados: ${response.status} - ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();
    holidayCache = data.map((holiday) => holiday.date);
    return holidayCache;
  } catch (error) {
    console.error(`Erro ao verificar feriado: ${error.message}`);
    return [];
  }
}

export { isWeekend, isHoliday };
