import { Builder, By, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome.js";

import { isWeekend, isHoliday } from "./utils.js";
import { format } from "date-fns";
import { writeLog, logCheckTime } from "./logger.js";
import fs from "fs/promises";

export async function clockIn(today) {
  const date = new Date(today);
  const year = date.getFullYear();

  const holidays = await isHoliday(date);

  if (isWeekend(date) || holidays.includes(format(date, "yyyy-MM-dd"))) {
    const msg = "Hoje é fim de semana ou feriado. Ponto não registrado.";
    console.log(msg);
    writeLog(msg);
    return;
  }

  const currentTime = format(date, "HH:mm");

  let allowedTimes;
  try {
    const allowedTimesContent = await fs.readFile(
      "./src/allowedTimes.json",
      "utf-8"
    );
    allowedTimes = JSON.parse(allowedTimesContent).allowedTimes;
  } catch (err) {
    console.error("Erro ao carregar allowedTimes.json:", err.message);
    writeLog("Erro ao carregar allowedTimes.json.");
    return;
  }

  if (!allowedTimes.includes(currentTime)) {
    const msg = `Horário atual (${currentTime}) não está nos horários permitidos. Ponto não registrado.`;
    logCheckTime(msg);
    return;
  }

  let driver;
  try {
    console.log("Iniciando o Selenium WebDriver...");
    writeLog("Iniciando o Selenium WebDriver...");

    const options = new Options();
    options.addArguments("--disable-gpu");
    options.addArguments("--no-sandbox");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    console.log("WebDriver iniciado.");

    await driver.get(process.env.URL);
    writeLog("Acessando o site...");

    await driver.wait(until.elementLocated(By.id("email")), 10000);
    await driver.findElement(By.id("email")).sendKeys(process.env.EMAIL);
    await driver.findElement(By.id("password")).sendKeys(process.env.SENHA);
    await driver.findElement(By.id("m_login_signin_submit")).click();
    writeLog("Login realizado.");

    await driver.sleep(5000);

    const firstButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(@class, 'btn-primary') and contains(text(), 'Registrar Ponto')]"
        )
      ),
      5000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      firstButton
    );
    await driver.executeScript("arguments[0].click();", firstButton);
    writeLog("Primeiro botão de registro de ponto clicado.");

    const secondButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(@class, 'btn-primary') and contains(text(), 'Registrar Ponto') and @ng-show='botaoHabilitado']"
        )
      ),
      5000
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true);",
      secondButton
    );
    await driver.executeScript("arguments[0].click();", secondButton);
    writeLog("Segundo botão de registro de ponto clicado.");

    const successMessage = `Ponto registrado com sucesso em ${currentTime}`;
    writeLog(successMessage);
    console.log(successMessage);
  } catch (err) {
    const errorMessage = `Erro ao bater o ponto: ${err.message}`;
    writeLog(errorMessage);
    console.error(errorMessage);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
