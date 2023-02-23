const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General"
    },
    image: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("post", postSchema);