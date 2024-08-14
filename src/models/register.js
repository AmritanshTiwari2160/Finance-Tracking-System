const mongoose = require("mongoose");
const Transaction = require("./transaction");
const { Double } = require("mongodb");

// Make a moongose schema name userSchema for inputing the data into the database for signup page
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Please enter a valid name!"]
    },
    phone:{
        type: String,
        required:[true, "Please enter a valid phone number!"],
        unique: true
    },
    email:{
        type: String,
        required:[true, "Please enter a valid Email Id!"],
        unique: true
    },
    password:{
        type: String,
        required:[true, "Please enter a valid password!"],
        required: true
    },
    // add balance here
    balance:{
        type: Number,
        required:[true, "Please enter a valid balance!"]
    },
    // Past transactions will be stored here
    history: {
        type: [{
            type: {
                recordNumber: {type: Number},
                income: {type: Boolean},
                amount: {type: Number},
                category: {type: String},
                date: {type: Date},
                description: {type: String},
            }
        }]
    }

});

// Now we need to create a collection

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;