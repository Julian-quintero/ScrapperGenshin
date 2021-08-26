const puppeteer = require('puppeteer');

//https://www.vg247.com/genshin-impact-codes
//https://www.pockettactics.com/genshin-impact/codes

const urls = ['https://www.pockettactics.com/genshin-impact/codes','https://www.vg247.com/genshin-impact-codes'];


const fun = async ()=> {

  

    try {  

        const browser = await puppeteer.launch({     
            headless: true,     
           
            args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
    
            
            let page = await browser.newPage();

       

          
        for (let index = 0; index < urls.length; index++) {

        

        


    
            await page.goto(urls[index], { waitUntil: 'networkidle2' });

          
    
            let elementsHendles = await page.evaluate(() => Array.from(document.querySelectorAll('ul > li > strong')).map(x=>x.textContent));

            await browser.close();
    
            console.log(elementsHendles);
    
         
          
            
        }
    
     
   
        
    } catch (error) {

        console.log('error ',error);


        
    }

}

fun()

  
    

    
