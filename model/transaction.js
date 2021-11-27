const mongoose = require('mongoose')
const { Schema } = mongoose;

const transactionSchema = new Schema({
    sender_name:{
        type: String,
        required: true
    },
    to:{
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    charity_name:{
        type: String
    },
    amount:{
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;