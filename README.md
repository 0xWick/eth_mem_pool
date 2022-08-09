# Query Ethereum MemPool using Node.js, Web3.js and Geth

Created by: Anonymous
Description: Using Node.js, Web3.js and Geth to query Ethereum Mainnet MemPool (Transaction pool)
Tags: Blockchain

## (soft) Pre-requisite:

You only need basic knowledge of these libraries and languages. Otherwise, learn on the fly 💀 I will explain assuming you know nothing 🆗

→ Node.js → web3.js → WebSockets → Go Eth (Geth)

# What We Buidling:

**A node.js bot/script that listens to “Pending Transactions” on Ethereum using JSON-RPC URL from our own node.**

### Overview:

Blockchain’s are a network of nodes. Each having its own state(copy) of the current blockchain. Each node running Ethereum core protocol software that enforces the rules like PoW, Transaction validity etc. When we do a transaction (write) or read something from the blockchain we are basically interacting with one of these nodes from the network.
But we need our own node to be able to talk to them. Metamask uses Infura (Node Service) whose nodes talk to these blockchain nodes for us. Hence, “Broadcasting” our transaction or sending it to the transaction pool (memPool).

### Client Software:

Nodes on the network only validate the transactions according to the Ethereum protocol specified in the client they are running. Almost all clients have the same main rules as defined in Ethereum Core but some may put extra constraint. We will be using geth (written in Go lang) client for our node since it’s the one most used and have some extra shananigans we can have fun with.

### Transaction Pool (Memory Pool):

Now, as I said earlier nodes only validate the transactions they **“hear”** about from other nodes. But the actual work is done by the miner who is also running a node but is also responsible for putting the transactions in blocks (Real State of the Blockchain). 

***Note: Transactions in the Memory Pool can be Dropped (several reasons), pending or successful if the miner adds it into a block and that gets attached to the longest chain.***

So, we are going to look at these pending transactions floating around in the Memory Pool.

## Let’s get a lil Codie: 🌉

### Node.js:

A JavaScript runtime. In short, you can’t run JavaScript outside the browser. But due to its popularity developers would have died without JS outside. And Node let’s you run it outside the browser and now is a popular backend language. 

### Why Web3.js:

By Default, all requests on Ethereum network use something called “JSON RPC”. 
JSON RPC: In short, a protocol used to request something from a program in another computer on a network. Other nodes in our case. And it looks something like this:

```jsx
curl --data '{"jsonrpc":"2.0","method":"eth_getBalance", "params": ["0x9b1d35635cc34752ca54713bb99d38614f63c955", "latest"], "id":2}' -H "Content-Type: application/json" localhost:8545
```

Result: (JSON with values as Hexadecimal Strings)

```jsx
{"id":2,"jsonrpc":"2.0","result":"0x1639e49bba16280000"}
```

So, the same function in Web3.js will be written as

```jsx
web3.eth.getBalance("0xFA90d99D10c5D94D0E67b2d0F706020B722A529a")
```

Result: (ETH balance of account in BigNumber)

```jsx
714054706280125824 // 0.71 ETH 
```

Look how much easy it was when using a Client library like Web3.js/Ethers.js!

## Let’s Build: 🤖

### Run your Node:

Follow [Geth Docs](https://geth.ethereum.org/docs/install-and-build/installing-geth) to download the instance according to your OS.

After Installation, run the following command in a terminal (cmd, powershell, shell)

```jsx
geth --syncmode light --ws --ws.origins "*" --ws.port 3334 --ws.api eth,net,web3
```

It will spit out some configuration data about where it’s storing(or will store) data and logs. What is the URL for HTTP requests etc. It will take some time to sync with the current state. 

Meanwhile, **let’s talk about Geth Light Node.**

A light node only downloads block headers that contain minimal block info enough for validation and it requests the rest from a full node that supports requests from Light Nodes (Not everyone is so nice!) on demand.

Other flags provide some functionality we can use while interacting with our node, mainly “WebSockets” used to subscribe to streams from our node for full-duplex communication without making requests again and again like HTTP.

After it’s synced you will be able to read or write data to the Ethereum Blockchain using your own node, without any third-party. **Cool!**

## Node Server:

*Note: Please don’t disappoint me and confuse an Ethereum Node with Node.js!*

Now, it’s time for the main program/bot/script/server.

Initialize NPM project and install these packages

```jsx
npm init --yes
npm install --save web3
```

Code Explained Below: (index.js)

```jsx
var Web3 = require("web3");

// WebSocket IP
const wsAddress = "ws://127.0.0.1:8546";

// Creating a Provider Instance (to query blockchain)
const web3 = new Web3(new Web3.providers.WebsocketProvider(wsAddress));

// Subscribing to "pendingTransactions" event

const subscription = web3.eth.subscribe("pendingTransactions");

// This code executes everytime a new transaction is added to the pool
subscription
  .subscribe((error, result) => {
    if (error) console.log(error);
  })
  .on("data", async (txHash) => {
    try {
      // Subscription only spits out txHash of transactions
      // We can use the txHash to get the complete transaction like this
      const transaction = await web3.eth.getTransaction(txHash);
      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  });
```

1. Provider: A provider is an abstraction used to query the blockchain.
2. Subscription: You can subscribe to WebSocket Streams of events.
***[subscriptions supported](https://web3js.readthedocs.io/en/v1.7.5/web3-eth-subscribe.html#subscribe)***
3. Code executes on every event “data” means everytime a new transaction signed by a node and broadcasted to the network is added into the pool
4. This Stream only gives the TransactionsHash, but we can make an additional request to get the full transaction.

```jsx
node index.js // To run your code in the terminal
```

## Successful Output: (Ctrl + C to Stop)

![Untitled](Query%20Ethereum%20MemPool%20using%20Node%20js,%20Web3%20js%20and%20%20284b16b1950d43b6a2a1aaaf93068163/Untitled.png)

I tried to be simple and explanative as much as possible!

**Feel free to ask if you are having any errors.**

Program exited with error code 0

0xWick
