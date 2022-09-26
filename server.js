require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const usersRouter = require("./routes/users-routes");
const blogRouter = require("./routes/blogs-router");
const HttpError = require("./models/http-error");

const app = express();

const port = 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/upload/images", express.static(path.join("upload", "images")));
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogRouter);

// handle unused routes
app.use((req, res, next) => {
    next(new HttpError("Could not find route", 404));
});

// handle errors
app.use((error, req, res, next) => {

    if(req.file) {
        fs.unlink(req.file.path, (error) => {
            console.log(error);
        });
    }

    if(res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "unknown error occurred!"} )
});

(async() => {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            app.listen(process.env.PORT || port, () => {
                console.log("server started on port : " + (process.env.PORT || port));
            });
        })
        .catch((error) => {
            console.log("DB Connection Failed : " + error);
            console.log("Server shutdown");
            process.exit(1);
        });
})();