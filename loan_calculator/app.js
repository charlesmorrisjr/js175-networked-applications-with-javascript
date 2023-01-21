const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

function getParams(path) {
  let newURL = new URL(path, `http://localhost:${PORT}`);
  return newURL.searchParams;
}

function calcLoan(amount, duration, apr) {
  apr = apr / 100;
  let monthlyInterestRate = apr / 12;
  let months = Number(duration) * 12;
  let payment = amount *
    (monthlyInterestRate /
    (1 - Math.pow((1 + monthlyInterestRate),(-months))));

  return payment.toFixed(2);
}

function createLoanBody(params) {
  let amount = Number(params.get('amount')) || 0;
  let duration = Number(params.get('duration')) || 1;
  const RATE = 5;
  
  let body = `Amount: $${amount}\n`;
  body += `Duration: ${duration}\n`;
  body += `APR: ${RATE}%\n`;
  body += `Monthly Payment: $${calcLoan(amount, duration, RATE)}\n`;

  return body;
}

const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {    
    let msgBody = createLoanBody(getParams(path));
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(msgBody);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
