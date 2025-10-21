const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");

const app = express();
const port = 8000;

//Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Myapp-0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

app.use(express.urlencoded());

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  next();
});

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}:${req.method} :${req.path}:${req.ip}\n`,
    (err, data) => {
      next();
    }
  );
});
app.get("/users", async (req, res) => {
  const allDbusers = await User.find({});
  const html = `
    <ul>
    ${allDbusers
      .map((user) => `<li>${user.firstName}-${user.email}</li>`)
      .join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbusers = await User.find({});
  res.setHeader("X-MyName", "Shamanthgunda");
  return res.json(allDbusers);
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })

  .patch(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { lastName: "g" });
    return res.json({ status: "success" });
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "deleted" });
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ msg: "All fiels to be required" });
  }
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  return res.status(201).json({ msg: "success" });
});

app.listen(port, () => console.log(`server started at ${port}`));
