const rp = require('request-promise');
const url = 'http://s11.leadsrain.com/leadsrain/admin.php'
const $ = require('cheerio');
const puppeteer = require('puppeteer');
var express = require('express');
var router = express.Router();
const CREDS = {
  username: 'nubiramm@hotmail.com',
  password: 'Rccbp02019'
}

router.get('/scrape', (req, res) => {
login()
})

async function login() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('http://s11.leadsrain.com/leadsrain/admin.php',{ waitUntil: 'networkidle0' } );
  await page.type('#admin_user', CREDS.username);
  await page.type('#admin_pass', CREDS.password);


  await Promise.all([
   page.click('body > form > div > div.modal-body > div > div > div > div:nth-child(3) > input'),
]).then(()=> {
  getData(page);
}).catch((error) => {console.log(error)})
}

async function getData(page) {
  await page.goto('http://s11.leadsrain.com/leadsrain/clientadmin/agent_time_detail.php', { waitUntil: 'networkidle0' })
  // await page.setRequestInterception(true);
  // page.on('request', intRequest => {
  //   var data = {
  //     method: 'POST',
  //     postData: 'fdt=2019-02-12&tdt=2019-02-12&campaign_id%5B%5D=1542132&campaign_id%5B%5D=5258276&campaign_id%5B%5D=6293299&campaign_id%5B%5D=5398272&campaign_id%5B%5D=548903&shift=current_hour&sub=View+Report'
  //   }
  //   const method = Object.assign({}, intRequest.method(), 'POST');
  //   const postData = Object.assign({}, intRequest.postData(), 'fdt=2019-02-12&tdt=2019-02-12&campaign_id%5B%5D=1542132&campaign_id%5B%5D=5258276&campaign_id%5B%5D=6293299&campaign_id%5B%5D=5398272&campaign_id%5B%5D=548903&shift=current_hour&sub=View+Report');
  //     intRequest.continue(data);
  // });
  await page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti');


  await Promise.all([
     page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti > select > option:nth-child(1)'),
    page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti > select > option:nth-child(2)'),
    page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti > select > option:nth-child(3)'),
    page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti > select > option:nth-child(4)'),
    page.click('#formid > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > div.optmulti > select > option:nth-child(5)'),
    page.click('#formid > div > div > table > tbody > tr:nth-child(2) > td > div > input'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
]).then(() => {
  page.on('load', () => {
    responses.map(async (resp, i) => {
        console.log(resp);
    });
  });
}).catch((error) => {console.log(error)});



}

module.exports = router;
