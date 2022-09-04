import { ElementHandle, Page } from "puppeteer";
import { Data } from "./generateList";

async function addMarkers(page: Page, list: Data[]) {
	const listName = `World's Best Restaurants ${new Date().getFullYear()}`;
	await page.goto("https://www.google.com/maps", { waitUntil: "networkidle0" });

	for await (const { name, location } of list) {
		// search
		await page.type("#searchboxinput", name + " " + location);
		await page.keyboard.press("Enter");
		// toggle save prompt
		await page.waitForSelector('[data-value="Save"]');
		await page.click('[data-value="Save"]');

		const [li] = await page.$x(`//li[contains(text(), "${listName}")]`);
		await (li as ElementHandle).click();

		await page.waitForSelector('[role="status"]');
	}
}

export default addMarkers;
