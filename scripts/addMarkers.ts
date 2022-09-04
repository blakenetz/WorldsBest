import { Page } from "puppeteer";
import { label } from "./createNewPlacesList";
import { Data } from "./generateList";

async function addMarkers(page: Page, list: Data[]) {
	await page.goto("https://www.google.com/maps", { waitUntil: "networkidle0" });
	let dataIndex: string | null = null;

	for await (const { name, location } of list) {
		// search
		const inputValue = await page.$eval(
			"#searchboxinput",
			(el: HTMLInputElement) => el.value
		);
		for (let i = 0; i < inputValue.length; i++) {
			await page.keyboard.press("Backspace");
		}
		await page.type("#searchboxinput", name + " " + location);
		await page.keyboard.press("Enter");
		// toggle save prompt
		await page.waitForSelector('[data-value="Save"]');
		await page.click('[data-value="Save"]');
		// select list
		await page.waitForSelector("#action-menu");
		// find selector of list item
		if (!dataIndex) {
			const menu = await page.$("#action-menu");
			const listItems = (await menu?.$$("li[data-index]")) ?? [];

			const results = await Promise.all(
				listItems.map((li) => {
					return li.$$eval(
						"div > div",
						(nodes, targetText) =>
							nodes.some((node) => node.innerHTML === targetText),
						label
					);
				})
			);

			const target = listItems[results.findIndex(Boolean)];

			dataIndex = await page.evaluate(
				(node) => node.getAttribute("data-index"),
				target
			);
		}

		await page.click(`[data-index="${dataIndex}"]`);

		// wait for save
		await page.waitForNetworkIdle();
	}
}

export default addMarkers;
