const puppeteer = require("puppeteer");
const { Expo } = require('expo-server-sdk')
const express = require("express");
const { db } = require("./firebase/firebase");
const app = express();
const port = process.env.PORT || 3000;
//https://genshin-impact.fandom.com/wiki/Promotional_Codes
const urls = [
  "https://genshin-impact.fandom.com/wiki/Promotional_Codes"
];

let expo = new Expo();


let somePushTokens=['ExponentPushToken[nuoSJPPCIIiKB3gJtt55be]']

async function sendMessage(codesFromWeb) {
  let messages = [];
  let CodesFromdb;
  await db
    .collection("expo")
    .get()
    .then((doc) => {
      CodesFromdb = doc.docs.map((x) => x.data().codes);
    });

  for (let pushToken of CodesFromdb) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    console.log('pushToken',pushToken);
  
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
  
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)

    
    messages.push({
      to: pushToken,
      sound: 'default',
      body: 'NEW GENSHIN IMPACT CODES',
      priority: 'high'
    //  data: { withSome: 'data' },
    })
  }

  let chunks = expo.chunkPushNotifications(messages);
let tickets = [];
(async () => {
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
})();
  
}



async function fillDbWithCodes (codesFromWeb) {

  try {

    codesFromWeb.forEach(async (element) => {
      await db.collection("codes").doc(element.toString()).set({
        codes: element,
      });
    });
    
  } catch (error) {

    console.log('error in fillDbWithCodes',error);
    
  }

}

async function deleteDb (codesFromDb) {

  try {
    codesFromDb.forEach(async (element) => {
      await db.collection("codes").doc(element).delete()
    });
  } catch (error) {
    console.log('error in deleteDb',error);
  }
  
}

const getCodesFromdb = async (codesFromWeb) => {
  codesFromWeb=['GENSHINGIFT','LANVJSFUD6CM','DTNUKTWCC6D9','HSNUKTXCCPWV']

 
  console.log('codesFromWeb',codesFromWeb);
  try {

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
    sendMessage(codesFromWeb)
   
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
     sendMessage(codesFromWeb)

    }
  


  }
    
  } catch (error) {
    console.log('error in getCodesFromdb',error);
  }
  
 
};

const funt = async () => {
  let codesFromWeb;

  const browser = await puppeteer.launch({
    headless: true,
    //args: ["--no-sandbox"],
  });

  let page = await browser.newPage();


  try {
    


    for (let index = 0; index < urls.length; index++) {
      await page.goto(urls[index],{
        waitUntil: 'networkidle2',
      });
      await page.waitForSelector("tr");
      let elementsHendles = await page.evaluate(() =>
        Array.from(document.querySelectorAll("tr")).map((x) => {
          console.log(x)
          // return (
          //   x.textContent[0] === x.textContent[0].toUpperCase() &&
          //   x.textContent.length > 1 &&
          //   x.textContent
          // );
        })
      );
      codesFromWeb = elementsHendles.filter((e) => e);
      console.log('codesFromWeb1',codesFromWeb);
      //getCodesFromdb(codesFromWeb);
      // console.log(elementsHendles);
      //console.log(clean);
    }
    await browser.close();
  } catch (error) {
    console.log("errorr ", error);
    await browser.close();
  }

 
};
//    await db.collection("codes").doc(random_number.toString()).set({
//     codes: "Los Angeles"

//  })

//funt()

 app.get('/', (req, res) => {
    res.send('Hello World!')
    funt();
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
