const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("subscriber", subscriberSchema);