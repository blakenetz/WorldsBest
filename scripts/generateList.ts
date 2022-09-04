import { Browser } from "puppeteer";

export interface Data {
	name: string;
	location: string;
}

async function generateList(browser: Browser, year: number): Promise<Data[]> {
	/**
	 * @todo fetch data for provided year
	 */

	const page = await browser.newPage();
	await page.goto("https://www.theworlds50best.com/list/1-50", {
		waitUntil: "networkidle0",
	});

	// fetch all items from lists
	const items = await page.$$(
		"div[data-list]:not([data-list*='Individual']) .item"
	);

	const list = Promise.all(
		items.map(async (item) => {
			return {
				name: await item.$eval("h2", (node) => node.innerText),
				location: await item
					.$$eval("p", (nodes) => nodes.map((node) => node.innerText))
					.then((res) => res.pop() ?? ""),
			};
		})
	);

	console.log("🌻 successfully generated list of restaurants");

	return list;
}

export default generateList;
