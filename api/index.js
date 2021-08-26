const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");
//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes

const express = require('express')


const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];

const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send('Hello, Vercel!')
  })
  
  app.listen(port, () => {
    console.log(`Express app hosted on Vercel listening at port ${port}`)
  })



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
    "Content-Type": "text/html",
  })
  res.end("hello")

}


