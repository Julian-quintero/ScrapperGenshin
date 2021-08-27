const puppeteer = require("puppeteer");

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const tab = await browser.newPage();
  const text = await (await tab.goto("http://example.com/")).text();
  console.log(text);
  console.log("done");
  browser.close();
}




app.get('/', (req, res) => {
  res.send('Hello World!')
  main();
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})