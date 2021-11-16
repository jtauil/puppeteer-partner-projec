const { json } = require('express');
const puppeteer = require('puppeteer');
//const ExcelJS = require('exceljs');
//const XLSX = require('xlsx');
const reader = require('xlsx')



const links = [];

(async() => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.bdlaw.com/people/?search%5Bkeyword%5D=&search%5Bpractice-area%5D=&search%5Bindustry%5D=&search%5Boffice%5D=&search%5Bpeople-position%5D=1&search%5Bpeople-bar-admission%5D=&search%5Bpeople-school%5D=');
  await page.waitForSelector('.person-info');
  await page.waitForTimeout(1);
  const enlaces = await page.evaluate(() => {
     const elements = document.querySelectorAll('.name-wrapper a[id^="post-title"]');

     const links = [];
     for(let element of elements){
       links.push(element.href);
     }
     return links;
  });
        const partnerPt1 = [];
  
       for (let enlace of enlaces){ //iterator for array of links 
         await page.goto(enlace);
         await page.waitForTimeout(1);
         await page.waitForSelector('.page-title');
       

        const partner = await page.evaluate(() => {
         const tmp = {};
          tmp.name = document.querySelector('a span.page-title').innerHTML;
           tmp.phone = document.querySelector('.phone-link').innerHTML;
           tmp.mail = document.querySelector('.bio-info__email a[href ^="mailto"]').innerHTML;
           tmp.office = document.querySelector('.office-title a').innerHTML;
           tmp.practices = [];
           const practices = document.querySelectorAll('li.bio-associations-list__item a');
            
            
           for(let p of practices){
                  tmp.practices.push(p.innerHTML);
                  
                }
              tmp.partnerToString = JSON.stringify(tmp.practices);
            
                
          return tmp;})
         partnerPt1.push(partner);
      
        }
  //console.log(enlaces.length);
  //console.log(enlaces);
  console.log(partnerPt1);
 

 const file = reader.readFile('./partnerTest.xlsx');
  const ws = reader.utils.json_to_sheet(partnerPt1);
  reader.utils.book_append_sheet(file,ws,"test numero mil");
     
  reader.writeFile(file,'./partnerTest.xlsx')



})();




















    
    

   
 
 





