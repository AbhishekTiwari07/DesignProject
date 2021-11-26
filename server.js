const express = require('express');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded());
app.use(express.json());
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use('/user', user);

app.listen(PORT, err=>{
    if(err)
        return console.log(err)
    console.log(`App is up at ${PORT}`)
})