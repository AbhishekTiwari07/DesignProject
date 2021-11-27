const mongoose = require('mongoose')
const { Schema } = mongoose;


const charitySchema = new Schema({
    name : {
        type: String,
        required: true
    },
    cause: {
        type: String,
        required: true
    },
    public_address:{
        type: String,
        required: true
    },
    target: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

const Charity = mongoose.model('Charity', charitySchema);

module.exports = Charity;