const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const fs = require('fs');





//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes


const urls = [
  "https://www.pockettactics.com/genshin-impact/codes",
  "https://www.vg247.com/genshin-impact-codes",
];

(async () => {
    await fs.promises.mkdir('public', { recursive: true });
    await fs.promises.writeFile('public/index.html', '<img src="/image.png">');
  
    const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    } : {
      args: [],
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });
  
    const page = await browser.newPage();
  
    await page.setViewport({
      width: 400,
      height: 400,
      deviceScaleFactor: 1
    });
  
    await page.setContent('<h1>Hello World!</h1>', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'public/image.png' });
    await browser.close();
  })();