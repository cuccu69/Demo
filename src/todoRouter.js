const express = require('express');
const Todo = require('./todo');

const todoRouter = express.Router();

//List all
todoRouter.get('/', async (_, res) => {
    res.json(await Todo.find({}));
});

//Read by ID
todoRouter.get('/:todoId', async (req, res) => {
    const {todoId} = req.params;
    res.json(await Todo.findById({_id: todoId}));
});

//Delete by ID
todoRouter.delete('/todoId', async (req, res) => {
    const {todoId} = req.params;
    await Todo.deleteOne({_id: todoId});
    res.status(204).send();
});

// Update by ID
todoRouter.put("/:todoId", async (req, res) => {
    const {title} = req.body;
    const {todoId} = req.params;
    res.json(await Todo.updateOne({_id: todoId}, {title}));
});

// Create new
todoRouter.post("/", async (req, res) => {
    const {title} = req.body;
    res.json(await Todo.create({title, createdAt: new Date()}));
});

module.exports = todoRouter;
