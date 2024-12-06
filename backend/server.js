//expressフレームワークをもってきます。
const express = require("express");

const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");
const cors = require("cors");

//const helmet = require('helmet');

require("dotenv").config();

const corsOptions = {
  orgin: "http://localhost:3000",
};

//expressをインスタンス化してあげます
const app = express();
const PORT = 8000;

//ミドルウエア
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/todo", todoRouter);

//DBの接続
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDBを接続中"))
  .catch((err) => console.log(err.message));

// セキュリティ強化のためのHelmetを使用
//app.use(helmet());

// サンプルのエンドポイント
app.get("/", (req, res) => {
  res.send("Hello, World!! and Japanとアメリカ！ ");
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
