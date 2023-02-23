const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const connectToMongo = require("./db");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const Posts = require("./models/PostModel");
const Subscriber = require("./models/SubscriberModel");
const cors = require("cors");
const { parse } = require("dotenv");
const { body, validationResult } = require('express-validator');

const app = express();
const port = 5000;

connectToMongo();

app.use(cookieParser());
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "/static")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))

app.use("/posts", require("./routes/postRoutes"));

app.get("/", (req, res) => {
    res.render("login");
})

app.post("/", (req, res) => {
    const {name, password} = req.body;
    if (name == process.env.ADMIN_NAME && password == process.env.ADMIN_PASSWORD) {
        res.cookie("auth", process.env.ADMIN_COOKIE)
        res.redirect("/posts/");
    } else {
        res.send("Invalid name or password");
    }
})

app.get("/logout", (req, res) => {
    res.cookie("auth", "");
    res.send("logout");
})

function panigatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            results.previous ={
                page: page - 1,
                limit: limit
            }
        }

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.panigatedResults = results;
            next();
        } catch (err) {
            res.json({ message: err.message })
        }
    }
}

app.get("/api/posts/", panigatedResults(Posts), async (req, res) => {
    try {
        res.json(res.panigatedResults);
    } catch (err) {
        res.json({"error": "Some error occured"});
    }
})

app.get("/api/posts/:id/", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        res.json({post});
    } catch (err) {
        res.json({"error": "Some error occured"});
    }
})

app.post("/api/subscribe/", [
    body('email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    
    try {
        const post = await new Subscriber({email: req.body.email});
        await post.save();
        res.json({email: req.body.email, status: 200});        
    } catch (err) {
        res.json({"error": "Some error occured"});
    }
})

app.listen(port, () => {
    console.log(`App is successfully running on port ${port}`);
})