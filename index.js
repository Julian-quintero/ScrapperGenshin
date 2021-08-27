




const express = require('express')
let chrome = {};
let puppeteer;

// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   // running on the Vercel platform.
//   chrome = require('chrome-aws-lambda');
//   puppeteer = require('puppeteer-core');
// } else {
//   // running locally.
  puppeteer = require('puppeteer');
//}


const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];


const funt = async () => {
    try {      
      const browser = await puppeteer.launch({
        headless: true,
  
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
      console.log("errorr ", error);
    }
  

  
  }


  funt()




