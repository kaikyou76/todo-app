const route = require("express").Router();
const jwt = require("jsonwebtoken");
const Todo = require("../schemas/todoSchema");

// route.get("/", (req, res) => {
//   res.send("Hello todo");
// });

//CRUD... Create, Read, Update, Delete
route.post("/", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "トークンがありません" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const todo = new Todo({
      title: req.body.title,
      userId,
    });
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.get("/", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "トークンがありません" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const todos = await Todo.find({ userId });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.put("/edit/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todoが見つかりません" });
    }
    const title = req.body.title;
    todo.title = title;
    await todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.put("/complete/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "todoが存在しません" });
    }
    todo.completed = true;
    todo.save();
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ message: "todoが存在しません" });
    }
    await todo.deleteOne();
    return res.status(200).json({ message: "Todoを削除しました" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = route;
