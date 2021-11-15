const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();

const links = [];
(async() => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.smbtrials.com/attorneys?p=4645&FirstName=&LastName=&Rank=Partner&L=&LPA=');
  await page.waitForSelector('h4');
  await page.waitForTimeout(3000);
  const enlaces = await page.evaluate(() => {
     const elements = document.querySelectorAll('.attNew_content h4 a');

     const links = [];
     for(let element of elements){
       links.push(element.href);
     }
     return links;
  });
        const partnerList = [];
       for (let enlace of enlaces){ //iterator for array of links 
         await page.goto(enlace);
         await page.waitForTimeout(1);
         await page.waitForSelector('#content-wrapper h1');
        
        
         const partner = await page.evaluate(() => {
           const tmp = {};
           tmp.name = document.querySelector('h1').innerHTML;
           tmp.phone = document.querySelector('h2 .attcontactNum').innerHTML;
           tmp.mail = document.querySelector('h2 a[href ^="mailto"]').innerHTML.replace(/<br>/g,'');
           tmp.practiceArea = document.querySelector('.atty-main p a[href ^="/?"').innerHTML;
           return tmp;
         })

         partnerList.push(partner);
       }
  console.log(enlaces.length);
  console.log(enlaces);
  console.log(partnerList);
})();





    
    

   
 
 





