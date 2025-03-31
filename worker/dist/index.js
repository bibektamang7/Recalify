"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
function OpenBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const option = new chrome_1.Options();
        option.addArguments("--use-fake-ui-for-media-stream");
        option.addArguments("--disable-blink-features=AutomationControlled");
        let driver = yield new selenium_webdriver_1.Builder()
            .forBrowser(selenium_webdriver_1.Browser.CHROME)
            .setChromeOptions(option)
            .build();
        try {
            yield driver.get("https://meet.google.com/rnq-wdcv-itv");
            const gotItButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[text()='Got it']")), 10000);
            yield gotItButton.click();
            const InputText = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//input[@placeholder='Your name']")), 10000);
            yield InputText.click();
            yield InputText.sendKeys("value", "Bibek Tamang bot");
            const joinButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//span[text()='Ask to join']")), 2000);
            yield joinButton.click();
        }
        catch (error) { }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield OpenBrowser();
    });
}
main();
