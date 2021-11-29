var Web3 = require('web3');
var provider = 'http://127.0.0.1:7545';
var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);

const data = async ()=>{
    const block = await web3.eth.getBlockNumber();
    console.log('Total Script: '+block)
    
    const accounts = await web3.eth.getAccounts();

    accounts.forEach(async account => {
        const amount = await web3.eth.getBalance(account)
        console.log(`Account: ${account} and Balance : ${amount}`)})
}

data()