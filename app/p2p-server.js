const WebSocket = require('ws');
 
const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2pserver {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));
    this.connectToPeers();
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`);
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log("Socket connected");
    this.messageHandler(socket);
    this.sendChain(socket);
  }

  connectToPeers() {
    peers.forEach(peer => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.connectSocket(socket));

    });
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      console.log("data ", data);
      this.blockchain.replaceChain(data);

    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }

}

module.exports = P2pserver;