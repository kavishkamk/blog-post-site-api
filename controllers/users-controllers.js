const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");
const User = require("../models/user-model");

// sign up
const signUp = async (req, res, next) => {

    console.log("hiii");

    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input, please check again", 422));
    }

    const {firstName, lastName, email, password} = req.body;

    let exsistingUser;

    try {
        exsistingUser = await User.findOne({email});
    } catch (error) {
        return next(new HttpError("Signup fail, please try again later", 500))
    }

    if (exsistingUser) {
        return next(new HttpError("User alray exsisting, try Insted", 422));
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError("Could not created users, Please try again", 500));
    }

    const createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image: req.file ? req.file.path : "upload/images/unknownPerson.jpg"
    });

    try {
        await createdUser.save();
    } catch ( error ) {
        return next(new HttpError("Something went wrong, could not create user", 500));
    }

    let token;

    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email }, 
            process.env.JWT_KEY,
            { expiresIn: "1h"}
        );
    
    } catch (error) {
        return next(new HttpError("Signin up failed, please try again later", 500));
    }

    res.json({userId: createdUser.id, email: createdUser.email, token: token});

};

exports.signUp = signUp;