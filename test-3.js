
var Web3 = require('web3');
var provider = 'http://127.0.0.1:7545';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

var abi = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "charity",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cause",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "src",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "donate",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "src",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "dest",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "cause",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        }
      ],
      "name": "addCharity",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "dest",
          "type": "address"
        }
      ],
      "name": "donateTo",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];

const address = "0x5722A0014024FE9C5e827c10E5f5Fcf548D05eBd"

const contract = new web3.eth.Contract(abi, address)

const test = async () => {
    var result = await contract.methods.getAddress().call()
    console.log(result)

    // result = await contract.methods.addCharity("Charity 100", "Disaster", 1000).send(
    //     {
    //         from: '0x2c822e0B07419fE83EB3340c5aE32E032065eE75',
    //         gas: 200000,
    //         gasPrice: 200000000
    //     })

    // console.log(result)
    
    // result = await contract.methods.getBalance().call({
    //     from: '0x1bE7E2d95a031935d868509e4f60358e222d2987'
    // })

    result = await contract.methods.donateTo('Abhishek', 10, '0x2c822e0B07419fE83EB3340c5aE32E032065eE75').send({
        from : '0x1bE7E2d95a031935d868509e4f60358e222d2987',
        gas: 200000,
        gasPrice: 200000000,
        value : 1000000000000000000
    })

    console.log(result)

    // result = await contract.methods.charity.call()

    console.log(result)
    
} 

test()