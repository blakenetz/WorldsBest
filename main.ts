import * as dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import addMarkers from "./scripts/addMarkers";
import createNewPlacesList from "./scripts/createNewPlacesList";
import generateList, { Data } from "./scripts/generateList";
import signIn from "./scripts/signIn";

const [skipList = false] = process.argv.slice(2);
dotenv.config();

(async () => {
	const stealthPlugin = StealthPlugin();
	stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
	stealthPlugin.enabledEvasions.delete("navigator.plugins");
	puppeteer.use(stealthPlugin);
	// headless browser used to generate list of restaurants
	const headless = await puppeteer.launch({ headless: true });
	// browser for google
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setBypassCSP(true);

	// closure around exit function
	async function exit() {
		await Promise.all([headless.close(), browser.close()]);
	}

	// fetch list of restaurants
	const [list] = (await Promise.all([
		generateList(headless),
		signIn(page),
	]).catch(async (err) => {
		console.error("🤮 error generating list: ", err);
		await exit();
	})) as [Data[], void];

	// generate new list if necessary
	if (!skipList) {
		await createNewPlacesList(page).catch(async (err) => {
			console.error("🤮 error creating list: ", err);
			await exit();
		});
	}

	// create pins
	await addMarkers(page, list as Data[]).catch(async (err) => {
		console.error("🤮 error adding markers: ", err);
		await exit();
	});

	await exit();
})();
