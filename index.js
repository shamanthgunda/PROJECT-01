const express = require("express");
const { connectMongoDB } = require("./connection");

const { logReqRes } = require("./middlewares");

const userRouter = require("./routes/user");

const app = express();
const port = 8000;

//Connection
connectMongoDB("mongodb://127.0.0.1:27017/Myapp-0");

//Middleware - Plugin
app.use(express.urlencoded());

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  next();
});

app.use(logReqRes("log.txt"));

app.use("/api/users", userRouter);

app.listen(port, () => console.log(`server started at ${port}`));
