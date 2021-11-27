const Charity = require('../model/charity')
const router = require('express').Router()
const auth = require('../middleware/auth')
require('dotenv').config()

router.post('/register', async (req,res)=>{
    try{
        var res_charity = await Charity.findOne({
            public_address: req.body.public_address
        })

        if(res_charity)
            throw new Error('Charity already Exist')
        const charity = new Charity(req.body);
        const result = await charity.save();
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