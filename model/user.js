const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose;
const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: String,
    public_address: {
        type: String,
        required: true,
    },
    transactions: {
        type: Schema.Types.ObjectId,
        ref: "Transaction"
    }
},{
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password'))
        this.password = await bcrypt.hash(this.password,8);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;