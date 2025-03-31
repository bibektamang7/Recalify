import { Builder, Browser, By, Key, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

async function OpenBrowser() {
	const option = new Options();
	option.addArguments("--use-fake-ui-for-media-stream");
	option.addArguments("--disable-blink-features=AutomationControlled");

	let driver = await new Builder()
		.forBrowser(Browser.CHROME)
		.setChromeOptions(option)
		.build();

	try {
		await driver.get("https://meet.google.com/rnq-wdcv-itv");

		const gotItButton = await driver.wait(
			until.elementLocated(By.xpath("//span[text()='Got it']")),
			10000
		);
		await gotItButton.click();

		const InputText = await driver.wait(
			until.elementLocated(By.xpath("//input[@placeholder='Your name']")),
			10000
		);
		await InputText.click();
		await InputText.sendKeys("value", "Bibek Tamang bot");

		const joinButton = await driver.wait(
			until.elementLocated(By.xpath("//span[text()='Ask to join']")),
			2000
		);
		await joinButton.click();
	} catch (error) {}
}

async function main() {
	await OpenBrowser();
}

main();
