const puppeteer = require("puppeteer-core");

const chromium = require('chrome-aws-lambda');





//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes

const options = process.env.AWS_REGION
? {
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  }
: {
    args: [],
    executablePath:
      process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  };


const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];

const fun = async () => {
  try {  



    const browser = await puppeteer.launch({
        options

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
