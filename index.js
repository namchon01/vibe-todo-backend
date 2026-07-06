require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRouter = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "MONGO_URI 환경변수가 없습니다. Heroku Settings > Config Vars에 MONGO_URI를 설정하세요."
  );
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use("/todos", todoRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Todo Backend API",
    endpoints: {
      health: "GET /health",
      todos: "GET /todos",
      createTodo: "POST /todos",
      updateTodo: "PATCH /todos/:id",
      deleteTodo: "DELETE /todos/:id",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.listen(PORT, () => {
  console.log(`Todo backend running on port ${PORT}`);
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("연결성공");
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  });
