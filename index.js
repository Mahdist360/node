const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const fs = require("fs");

const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/user";

// const mongoURI = "http://118.179.115.150:27017/user";

const connect = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};

connect();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
});

// Create the User model
const User = mongoose.model("User", UserSchema);

// const { User } = require("/modals/User");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "ok" });
});

app.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.save();

    return res.json({ message: "created successfully " });
  } catch (error) {
    res.json({ message: "error occured" });
  }
});

// const postData = async (data)=>{

//   try {

//     data.forEach((value,index,array)=>{
//       const user = new User(value);
//       await user.save();
//     })

//     return res.json({ message: "created successfully " });
//   } catch (error) {
//     res.json({ message: "error occured" });
//   }

// }

app.get("/read", async (req, res) => {
  try {
    const data = await fs.readFileSync("./data.json", "utf8");
    console.log(JSON.parse(data));

    const parsedData = JSON.parse(data);
    parsedData.forEach(async (value) => {
      const user = new User(value);
      await user.save();
    });

    res.send({ message: "created successfully", data: JSON.parse(data) });
  } catch (err) {
    console.error("Error reading file:", err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
