const puppeteer = require("puppeteer");

const express = require("express");
const { db } = require("./firebase/firebase");
const app = express();
const port = process.env.PORT || 3000;

const urls = [
  "https://www.pockettactics.com/genshin-impact/codes"
];




async function fillDbWithCodes (codesFromWeb) {
  codesFromWeb.forEach(async (element) => {
    await db.collection("codes").doc(element.toString()).set({
      codes: element,
    });
  });
}

async function deleteDb (codesFromDb) {
  codesFromDb.forEach(async (element) => {
    await db.collection("codes").doc(element).delete()
  });
}

const getCodesFromdb = async (codesFromWeb) => {
  codesFromWeb=['RAT']
  
  await db.collection("codes")
    .get()
    .then((doc) => {
      CodesFromdb = doc.docs.map((x) => x.data().codes);
    });
   
   console.log('codes from db',CodesFromdb);


  if (CodesFromdb.length < codesFromWeb.length) {
    console.log('db menor que web');  
    fillDbWithCodes(codesFromWeb)
    console.log('notifi');
    
   
  }else if(CodesFromdb.length > codesFromWeb.length){
    deleteDb(CodesFromdb)    
    console.log('borrado');    
    fillDbWithCodes(codesFromWeb)

  }else if(CodesFromdb.length === codesFromWeb.length){

    if (CodesFromdb.toString() == codesFromWeb.toString()) {
      console.log('mismos codigos')
    }else{
      deleteDb(CodesFromdb)  
     console.log('misma longitud pero diferente contenido')
     fillDbWithCodes(codesFromWeb)
     console.log('notifi');

    }
  


  }
};

const funt = async () => {
  let codesFromWeb;

  try {
    const browser = await puppeteer.launch({
      headless: true,

      args: ["--no-sandbox"],
    });

    let page = await browser.newPage();

    for (let index = 0; index < urls.length; index++) {
      await page.goto(urls[index]);
      await page.waitForSelector("ul > li > strong");
      let elementsHendles = await page.evaluate(() =>
        Array.from(document.querySelectorAll("ul > li > strong")).map((x) => {
          return (
            x.textContent === x.textContent.toUpperCase() &&
            x.textContent.length > 1 &&
            x.textContent
          );
        })
      );
      codesFromWeb = elementsHendles.filter((e) => e);
      console.log(codesFromWeb);
      getCodesFromdb(codesFromWeb);
      // console.log(elementsHendles);
      //console.log(clean);
    }
    await browser.close();
  } catch (error) {
    console.log("errorr ", error);
    await browser.close();
  }

  var random_number = Math.floor(Math.random() * 100000);
};
//    await db.collection("codes").doc(random_number.toString()).set({
//     codes: "Los Angeles"

//  })



app.get('/', (req, res) => {
   res.send('Hello World!')
   funt();
 })

 app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`)
 })
