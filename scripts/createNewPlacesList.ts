import { Page } from "puppeteer";

export interface LabelArgs {
	year?: number;
	label?: string;
}

export function generateLabel({ year, label }: LabelArgs) {
	return label ?? `World's Best Restaurants ${year}`;
}

async function createNewPlacesList(page: Page, labelArgs: LabelArgs) {
	const label = generateLabel(labelArgs);
	await page.goto("https://www.google.com/maps", { waitUntil: "networkidle0" });
	// open menu
	await page.click('button[aria-label="Menu"');
	// click settings
	await page.waitForSelector('ul[aria-label="Settings"]', { visible: true });
	await page.click('[jsaction="settings.yourplaces"]');
	// create new list
	await page.waitForSelector('[aria-label="New list"]', { visible: true });
	await page.click('[aria-label="New list"]');
	await page.waitForSelector('[aria-label="List name"]', { visible: true });
	await page.type('[aria-label="List name"]', label);
	await page.click('[jsaction="pane.footer.confirm"]');
	// close settings
	await page.click('[aria-label="Close"]');
	await page.waitForNetworkIdle();

	console.log("🌻 successfully created new list");
}

export default createNewPlacesList;
