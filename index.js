



const puppeteer = require("puppeteer");

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;



const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];


const funt = async () => {
    try {      
      const browser = await puppeteer.launch({
        headless: true,
  
        args: ["--no-sandbox"],
      });
  
      let page = await browser.newPage();
  
      for (let index = 0; index < urls.length; index++) {
        await page.goto(urls[index]);
        await page.waitForSelector("ul > li > strong")
        let elementsHendles = await page.evaluate(() =>
          Array.from(document.querySelectorAll("ul > li > strong")).map(
            (x) => x.textContent
          )
        );
        
     
  
        console.log(elementsHendles);
      }
      await browser.close();
    } catch (error) {
      console.log("errorr ", error);
      await browser.close();
    }
  

  
  }


  app.get('/', (req, res) => {
    res.send('Hello World!')
    funt();
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })




