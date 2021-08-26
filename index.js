const puppeteer = require("puppeteer-core");

const chrome = require('chrome-aws-lambda');






//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes


const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];

const fun = async () => {
  try {  



    const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
      } : {
        args: [],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      });

    let page = await browser.newPage();

    for (let index = 0; index < urls.length; index++) {
      await page.goto(urls[index], { waitUntil: "networkidle2" });

      let elementsHendles = await page.evaluate(() =>
        Array.from(document.querySelectorAll("ul > li > strong")).map(
          (x) => x.textContent
        )
      );

    

      console.log(elementsHendles);
    }

    await browser.close();
  } catch (error) {
    console.log("error ", error);
    await browser.close();
  }
};

fun();
