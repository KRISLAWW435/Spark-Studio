const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text());
  });

  const routes = [
    'http://localhost:3000',
    'http://localhost:3000/course/m0-l1',
    'http://localhost:3000/course/m1-l1',
    'http://localhost:3000/labs/color',
    'http://localhost:3000/mentor',
    'http://localhost:3000/builder',
  ];

  for (const r of routes) {
    console.log('Testing route:', r);
    try {
      await page.goto(r, { waitUntil: 'networkidle2' });
    } catch (e) {
      console.log('GOTO ERROR:', e.message);
    }
  }
  
  await browser.close();
})();
