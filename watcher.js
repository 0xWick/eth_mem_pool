var Web3 = require("web3");

// WebSocket IP
const wsAddress =
  "wss://mainnet.infura.io/ws/v3/5b9696e574d54ed3b86c22ffba7b770f";

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
