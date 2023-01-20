const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

function getParams(path) {
  let newURL = new URL(path, `http://localhost:${PORT}`);
  return newURL.searchParams;
}

function rollDice(params) {
  let sides = Number(params.get('sides')) || 6;
  let numRolls = Number(params.get('rolls')) || 1;
  let rollResults = '';
  
  for (let roll = 1; roll <= numRolls; roll++) {
    rollResults += `${Math.floor(Math.random() * sides) + 1}\n`;
  }

  return rollResults;
}

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();
  } else {    
    let rollResults = rollDice(getParams(path));
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write(rollResults);
    res.write(`${method} ${path}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
