const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require("fs");

const HttpError = require("../models/http-error");

const Blog = require("../models/blog-model");
const User = require("../models/user-model");

// create blog
const createBlog = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return next(new HttpError("Invalid input data", 422));
    }

    const { title, content } = req.body;

    let user;

    // find user for given user id
    try {
        user = await User.findById(req.userData.userId);
    } catch (error) {
        return next(new HttpError("creating place failed, please try again " + error, 500));
    }

    if (!user) {
        return next(new HttpError("Could not find user for given id ", 404));
    }

    const createdBlog = new Blog({
        title,
        content,
        image: req.file.path,
        creator: req.userData.userId
    });
    
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdBlog.save({session: sess});
        user.blogs.push(createdBlog);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (error) {
        return next(new HttpError("Error with creating place " + error, 500));
    }

    res.status(201).json({place: createdBlog});
};

const getBlogs = async (req, res, next) => {

    let blogs;

    try {
        blogs = await Blog.find({});
    } catch (error) {
        return next(new HttpError("Somthing wrong", 500));
    }
    
    res.json({blogs: blogs.map(p => p.toObject({getters: true}))});
};

exports.createBlog = createBlog;
exports.getBlogs = getBlogs;