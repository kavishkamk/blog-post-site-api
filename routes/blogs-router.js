const express = require("express");
const { check } = require('express-validator');

const blogControllers = require("../controllers/blog-controllers");
const fileUpload = require("../middleware/file-upload");
const authCheck = require("../middleware/check-auth");

const router = express.Router();

router.use(authCheck);

router.post("/", 
        fileUpload.single("image"),
        [
            check("title")
                .not()
                .isEmpty(),
            check("content")
                .not()
                .isEmpty(),
        ], blogControllers.createBlog);

module.exports = router;