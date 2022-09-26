const express = require("express");
const { check } = require('express-validator');

const usersControllers = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.post("/signup", 
    fileUpload.single("image"), 
    [
        check("firstName")
            .not()
            .isEmpty(),
        check("lastName")
            .not()
            .isEmpty(),
        check("email")
            .isEmail(),
        check("password")
            .isLength({min: 6})
    ],usersControllers.signUp);

router.post("/login", 
    [
        check("email")
            .isEmail(),
        check("password")
            .not()
            .isEmpty()
    ],usersControllers.login);

module.exports = router;