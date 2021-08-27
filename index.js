







let puppeteer = require('puppeteer');



const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];




const funt = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  
    args: ["--no-sandbox"],
  });
    try {      
     
  
      let page = await browser.newPage();
  
     
        await page.goto('https://www.pockettactics.com/genshin-impact/codes');

        await page.waitForSelector("ul > li > strong")
        let elementsHendles = await page.evaluate(() =>
          Array.from(document.querySelectorAll("ul > li > strong")).map(
            (x) => x.textContent
          )
        );
        
     
  
        console.log(elementsHendles);
      
      await browser.close();
    } catch (error) {
      console.log("errorr ", error);
      await browser.close();
    }
  
    await browser.close();
  
  }


  funt()




