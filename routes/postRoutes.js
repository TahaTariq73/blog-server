const express = require("express");
const router = express.Router();
const upload = require("../upload");
const Post = require("../models/PostModel");
const middleware = require("../middleware");

router.use(express.urlencoded({
    extended: true
}))
router.use(express.json());

router.get("/", middleware, async (req, res) => {
    const posts = await Post.find();
    const params = {posts: posts};
    res.render("posts", params);
})

router.post("/addpost/", middleware, upload.single("file"), async (req, res) => {
    const {title, tag, desc, content} = req.body;
    const post = new Post({title, content, tag, desc, image: req.file.filename});        
    const savedpost = await post.save();

    res.redirect("/posts/");
})

router.post("/deletepost/:id/", middleware, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        res.redirect("/posts/");
    } catch (err) {
        res.json({"error": "post not found"});
    }
})

router.get("/editpost/:id/", middleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        params = {post: post};
        res.render("editpost", params);
    } catch (err) {
        res.json({"error": "post not found"});
    }
})

router.post("/editpost/:id/", middleware, upload.single("file"), async (req, res) => {
    try {
        const {title, tag, content, desc} = req.body;
        const editpost = {title, tag, desc, content, image: req.file.filename}
        const post = await Post.findByIdAndUpdate(req.params.id, {$set: editpost});
        res.redirect("/posts/"); 
    } catch (err) {
        res.json({"error": "post not found"});
    }
})

module.exports = router;