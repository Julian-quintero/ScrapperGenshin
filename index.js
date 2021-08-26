const puppeteer = require("puppeteer");
const chromium = require("chrome-aws-lambda");
//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes

const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];

module.exports = async (req, res) => {
  try {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    for (let index = 0; index < urls.length; index++) {
      await page.goto(urls[index], { waitUntil: "networkidle2" });

      let elementsHendles = await page.evaluate(() =>
        Array.from(document.querySelectorAll("ul > li > strong")).map(
          (x) => x.textContent
        )
      );

      await browser.close();

      console.log(elementsHendles);
    }
  } catch (error) {
    console.log("error ", error);
  }

  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": 5,
  })
  res.end('hola')
};


