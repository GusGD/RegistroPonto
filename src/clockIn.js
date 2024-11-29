require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { logCheckTime, writeLog } = require("./logger");
const { Builder, By, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { format } = require("date-fns");

function getAllowedTimes() {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "allowedTimes.json"),
      "utf8"
    );
    const json = JSON.parse(data);
    return json.allowedTimes || [];
  } catch (err) {
    console.error(
      "Erro ao ler ou analisar o arquivo allowedTimes.json:",
      err.message
    );
    return [];
  }
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date) {
  const holidays = ["01-01", "25-12"];
  const dateStr = format(date, "dd-MM");
  return holidays.includes(dateStr);
}

const allowedTimes = getAllowedTimes();

async function clockIn(today) {
  if (isWeekend(today) || isHoliday(today)) {
    const msg = "Hoje é fim de semana ou feriado. Ponto não registrado.";
    console.log(msg);
    writeLog(msg);
    return;
  }

  const currentTime = format(today, "HH:mm");
  if (!allowedTimes.includes(currentTime)) {
    const msg = `Horário atual (${currentTime}) não está nos horários permitidos. Ponto não registrado.`;
    console.log(msg);
    logCheckTime(msg);
    return;
  }

  let driver;
  try {
    console.log("Iniciando o Selenium WebDriver...");
    writeLog("Iniciando o Selenium WebDriver...");

    const options = new Options();
    //options.addArguments("--headless"); // executa sem interface gráfica
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

    // Primeiro botão: verificando e clicando
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

    // Segundo botão: verificando e clicando
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
    console.log(successMessage);
    writeLog(successMessage);
  } catch (err) {
    const errorMessage = `Erro ao bater o ponto: ${err.message}`;
    console.error(errorMessage);
    writeLog(errorMessage);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = { clockIn };
