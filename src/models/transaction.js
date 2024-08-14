//make a mongoose schema for transcation added to the page
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    
    amount:{
        type: Number,
        required:[true, "Please enter a valid amount!"]
    },
    category:{
        type: String,
        required:[true, "Please enter a valid type!"]
    },
    date:{
        type: Date,
        required:[true, "Please enter a valid date!"]
    },
    description:{
        type: String,
        required:[true, "Please enter a valid description!"]
    },
});

// Now we need to create a collection

const Transaction = new mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;