const User = require('../model/user')
const Transaction = require('../model/transaction')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const auth = require('../middleware/auth')
require('dotenv').config()

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

        res.send(200).status({
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
        const transaction = new Transaction(req.body);
        const result = await transaction.save();

        res.status(200).send({
            message: 'Transaction Saved',
            result
        })
    }
    catch(e){
        res.status(400).json({
            message: e.message
        })
    }
})

module.exports = router;