const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
  override: true,
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRouter = require("./routes/todos");

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI 환경변수가 없습니다. .env 파일을 확인해주세요.");
  process.exit(1);
}
app.use(cors());
app.use(express.json());
app.use("/todos", todoRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("연결성공");
    console.log("MongoDB 주소:", MONGO_URI.replace(/\/\/.*@/, "//***@"));
    app.listen(PORT, () => {
      console.log(`Todo backend running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error.message);
  });
