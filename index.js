const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const todoRouter = require("./src/todoRouter");

const app = express();

app.use(bodyParser.json());
app.use("/todo", todoRouter);

const startApplication = async () => {
    await mongoose.connect("mongodb://localhost:27017/blog", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(
        "Successfully connected to MongoDB at: mongodb://localhost:27017/blog"
    );

    await app.listen(3000);
    console.log('Listening on port 3000');
}

startApplication();
