const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;


const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

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
  
  let body = `<tr><th>Amount:</th><td>$${amount}</td></tr>`;
  body += `<tr><th>Duration:</th><td>$${duration} years</td></tr>`;
  body += `<tr><th>APR:</th><td>$${RATE}</td></tr>`;
  body += `<tr><th>Monthly Payment:</th><td>$${calcLoan(amount, duration, RATE)}</td></tr>`;

  return `${HTML_START}${body}${HTML_END}`;
}

const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {    
    let msgBody = createLoanBody(getParams(path));
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(msgBody);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
