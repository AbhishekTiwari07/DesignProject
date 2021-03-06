const Charity = require('../model/charity')
const router = require('express').Router()
const auth = require('../middleware/auth')
require('dotenv').config()


var Web3 = require('web3');
var provider = 'http://127.0.0.1:7545';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

var abi =  [
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

const address = "0x1b54708B192A63B0be5Daa8E02B76288bAAfBc59"

const contract = new web3.eth.Contract(abi, address);

router.post('/register', async (req,res)=>{
    try{
        const {
            name,
            cause,
            target,
            public_address
        } = req.body;

        var res_charity = await Charity.findOne({
            public_address
        })

        if(res_charity)
            throw new Error('Charity already Exist')

        var result = await contract.methods.addCharity(name, cause, target).send(
        {
            from: public_address,
            gas: 200000,
            gasPrice: 200000000
        });

        console.log(result)

        const charity = new Charity(req.body);

        result = await charity.save();
        
        res.status(200).send(result);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});

router.get('/all', async (req,res)=>{
    try{
        const charity = await Charity.find();
        res.status(200).send(charity);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});


router.get('/all/:type', async (req,res)=>{
    try{
        const charity = await Charity.find({
            cause: req.params.type
        });
        res.status(200).send(charity);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});


module.exports = router;