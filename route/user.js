const User = require('../model/user')
const Transaction = require('../model/transaction')
const Charity = require('../model/charity')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const auth = require('../middleware/auth')
require('dotenv').config();

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

const address = "0x1b54708B192A63B0be5Daa8E02B76288bAAfBc59"

const contract = new web3.eth.Contract(abi, address);

router.post('/register', async (req,res)=>{
    try{
        const user = new User(req.body);
        const result = await user.save();
        res.status(200).send(result);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});

router.post('/login', async (req,res)=>{
    try{
        const user = await User.findOne({
            email : req.body.email
        })

        if(!user)
            throw new Error('No User Found')
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if(!isMatch)
            throw new Error('Wrong Email/Password');

        const token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET)
            
        res.status(200).send({
            token
        })

    }
    catch(e){
        res.status(400).json({
            message: e.message
        })
    }
});

router.get('/me', auth, async (req,res)=>{
    try{
        const user = await User.findOne({
            _id: req.user.id
        });

        res.status(200).send({
            user
        });
    }
    catch(e){
        res.status(400).send({
            message: e.message
        });
    }
});


router.get('/transaction/me', auth, async (req, res)=>{
    try{
        const transactions = await Transaction.find({
            from: req.user.public_address
        });
        res.status(200).send(transactions);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});

router.get('/transaction', async (req, res)=>{
    try{
        const transactions = await Transaction.find();
        res.status(200).send(transactions);
    }
    catch(e){
        res.status(400).send({
            message: e.message
        })
    }
});

router.post('/transaction', async (req,res)=>{
    try{
        if(!req.body.sender_name)
            req.body['sender_name'] = 'Kakabito'

        console.log(req.body.amount*Math.pow(10,18))

        var result = await contract.methods.donateTo(req.body.sender_name, req.body.amount, req.body.to).send({
            from : req.body.from,
            gas: 200000,
            gasPrice: 200000000,
            value : req.body.amount*Math.pow(10,18)
        });

        console.log(result);

        const transaction = new Transaction(req.body);
        result = await transaction.save();

        var charity = await Charity.findOne({
            public_address: req.body.to
        });

        charity.target -= result.amount;

        await charity.save();

        res.status(200).send({
            message: 'Transaction Saved',
            result
        })
    }
    catch(e){
        console.log(e.message);
        res.status(400).json({
            message: e.message
        })
    }
});

module.exports = router;