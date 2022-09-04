import { Page } from "puppeteer";

async function signIn(page: Page, twoFactorAuth: boolean) {
	const { GOOGLE_EMAIL, GOOGLE_PASSWORD } = process.env;

	if (!GOOGLE_EMAIL || !GOOGLE_PASSWORD) {
		throw new Error("GOOGLE_EMAIL and GOOGLE_PASSWORD env variables required");
	}

	await page.goto("https://accounts.google.com/signin/v2/identifier", {
		waitUntil: "networkidle0",
	});

	await page.type('[type="email"]', process.env.GOOGLE_EMAIL ?? "");
	await page.keyboard.press("Enter");

	await page.waitForSelector('[type="password"]', { visible: true });
	await page.type('[type="password"]', process.env.GOOGLE_PASSWORD ?? "");
	await page.keyboard.press("Enter");

	// navigate to 2fa
	if (twoFactorAuth) {
		await page.waitForNavigation();
	}

	// success!
	await page.waitForNavigation();

	console.log("🌻 successfully signed in");
}

export default signIn;
