import { Page } from "puppeteer";
import { generateLabel, LabelArgs } from "./createNewPlacesList";
import { Data } from "./generateList";

async function addMarkers(
	page: Page,
	list: Data[],
	labelArgs: LabelArgs,
	debug: boolean
): Promise<string[]> {
	await page.goto("https://www.google.com/maps", { waitUntil: "networkidle0" });

	// helper variables
	const label = generateLabel(labelArgs);
	let dataIndex: string | null = null;
	let input = await page.$("#searchboxinput");

	const errors = [];

	for await (const { name, location } of list) {
		try {
			console.log(`fetching ${name}`);
			// clear out input
			await input.click({ clickCount: 3 });
			await input.press("Backspace");

			// search
			await input.type(name + " " + location);
			await page.keyboard.press("Enter");
			// wait till buttons load
			await page.waitForSelector('[data-value="Save"]');
			const saveButton = await page.$('[data-value="Save"]');

			// toggle save prompt
			const isSaved = await page.evaluate(
				(node) => node.getAttribute("aria-label").includes("Saved in"),
				saveButton
			);

			// is already saved. move on
			if (isSaved) continue;

			await saveButton.click();
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
		} catch (error) {
			if (debug) console.error("🤮 adding marker", error);
			errors.push(name);
		}
	}

	return errors;
}

export default addMarkers;
