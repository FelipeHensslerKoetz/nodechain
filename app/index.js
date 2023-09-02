const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const app = express();
const blockchain = new Blockchain();
const P2pserver = require('./p2p-server');
const p2pserver = new P2pserver(blockchain);

p2pserver.listen();

app.use(bodyParser.json());

app.get('/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/mine', (req, res) => {
  const block = blockchain.addBlock(req.body.data);
  console.log(`New block added: ${block.toString()}`);

  p2pserver.syncChain();
  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
  console.log(`listening on port ${HTTP_PORT}`);
})