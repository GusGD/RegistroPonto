import { format } from "date-fns";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

async function isHoliday(date) {
  const urlApi = process.env.URL_API;
  const tokenApi = process.env.TOKEN_API;
  const state = process.env.STATE;

  try {
    const year = date.getFullYear();

    const response = await fetch(`${urlApi}${year}?token=${tokenApi}`);

    if (!response.ok) {
      console.error(
        `Erro ao buscar feriados: ${response.status} - ${response.statusText}`
      );
      return [];
    }
    const data = await response.json();
    const holidays = data.map((holiday) => holiday.date);
    return holidays;
  } catch (error) {
    console.error(`Erro ao verificar feriado: ${error.message}`);
    return [];
  }
}
export { isWeekend, isHoliday };
