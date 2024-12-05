const route = require("express").Router();
const User = require("../schemas/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  res.send("Hello auth");
});

route.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "メールアドレスが見つかりません" });
    }
    const isVaild = await bcrypt.compare(password, user.password);
    if (!isVaild) {
      return res.status(400).json({ error: "パスワードが間違っています" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = route;
