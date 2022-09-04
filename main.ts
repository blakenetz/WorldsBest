import * as dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import addMarkers from "./scripts/addMarkers";
import createNewPlacesList from "./scripts/createNewPlacesList";
import generateList, { Data } from "./scripts/generateList";
import signIn from "./scripts/signIn";

interface Args {
	skipList?: boolean;
	year?: number;
	label?: string;
	"2fa"?: boolean;
}

dotenv.config();

(async () => {
	const argv = await yargs(hideBin(process.argv)).argv;
	const {
		skipList = false,
		year = new Date().getFullYear() - 1,
		label,
		...rest
	} = (argv as Args) || {};

	const twoFactorAuth = rest["2fa"] ?? true;

	console.log(argv, skipList);

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

	// fetch list of restaurants and sign in
	const [list] = (await Promise.all([
		generateList(headless, year),
		signIn(page, twoFactorAuth),
	]).catch(async (err) => {
		console.error("🤮 error generating list: ", err);
		await exit();
	})) as [Data[], void];

	// generate new list if necessary
	if (skipList !== true) {
		await createNewPlacesList(page, { year, label }).catch(async (err) => {
			console.error("🤮 error creating list: ", err);
			await exit();
		});
	}

	// create pins
	const errors = await addMarkers(page, list as Data[], { year, label }).catch(
		async (err) => {
			console.error("🤮 error adding markers: ", err);
			await exit();
		}
	);
	if ((errors || []).length) {
		console.error(`🤮 unable to save: ${(errors || []).join(", ")}`);
	}

	await exit();
})();
