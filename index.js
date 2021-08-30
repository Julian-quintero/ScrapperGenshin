const puppeteer = require("puppeteer");
const { Expo } = require('expo-server-sdk')
const express = require("express");
const { db } = require("./firebase/firebase");
const app = express();
const port = process.env.PORT || 3000;

const urls = [
  "https://www.pockettactics.com/genshin-impact/codes"
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
 // codesFromWeb=['RAT','CAT','BLOP','PUT','SIS','REP']
  
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
