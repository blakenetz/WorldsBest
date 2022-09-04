import { LaunchOptions } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"; // Use v2.4.5 instead of latest
import * as dotenv from "dotenv";

import generateList, { Data } from "./scripts/generateList";
import signIn from "./scripts/signIn";
import createList from "./scripts/createList";

const [skipList = false] = process.argv.slice(2);
dotenv.config();

(async () => {
	const stealthPlugin = StealthPlugin();
	stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
	stealthPlugin.enabledEvasions.delete("navigator.plugins");
	puppeteer.use(stealthPlugin);
	const browser = await puppeteer.launch({ headless: false });

	// fetch list of restaurants
	// let list: Data[];
	// try {
	// 	list = await generateList(browser);
	// } catch (error) {
	// 	console.error("🤮 error: ", error);
	// 	await browser.close();
	// }

	const page = await browser.newPage();
	await page.setBypassCSP(true);

	await signIn(page).catch(async (err) => {
		console.error("🤮 error signing in: ", err);
		await browser.close();
	});

	if (!skipList) {
		await createList(page).catch(async (err) => {
			console.error("🤮 error creating list: ", err);
			await browser.close();
		});
	}

	await browser.close();
})();
