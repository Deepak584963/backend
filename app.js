const express = require("express");
const app = express();
const Deepak = require("./mongo");
const authentication = require("./midleware/authentication");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/about", authentication, (req, res) => {
  res.status(200).send(req.user);
});

app.get("/register", async (req, res) => {
  res.send("hii");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, Email, Password, city, state, zip } = req.body;

  const data = new Deepak({
    firstName,
    lastName,
    Email,
    Password,
    city,
    state,
    zip,
  });
  const vv = await data.generateAuthToken();
  res.cookie("pika", vv, {
    expires: new Date(Date.now() + 67676555000),
  });

  const ll = await data.save();
  console.log(ll);
  res.status(201).send(ll);
});

app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  const data = await Deepak.findOne({ Email: Email });
  console.log(data);

  if (data) {
    console.log("hiiiiiiiiiiiiii");
    const ss = bcrypt.compare(data.Password, Password);
    if (ss) {
      const vv = await data.generateAuthToken();
      res.cookie("pika", vv, {
        expires: new Date(Date.now() + 555000),
      });

      // console.log('kiiiiiiiiiiiiiii')
      res.status(201).send("login succesefull");
      // res.status(201).json(req.user)
    } else {
      res.send("incorect password");
    }
  } else {
    res.status(401).json({ Error: "Email not Registred" });
  }
});

app.get("/ContactUs", authentication, (req, res) => {
  // console.log(req.user)

  res.status(200).json(req.user);
});
app.post("/Contact", authentication, async (req, res) => {
  const { firstName, lastName, Email, message } = req.body;
  const id = req.id;
  const data = await Deepak.findOne({ _id: id });
  data.AddValue(firstName, lastName, Email, message);
  const result = await data.save();
  res.status(200).send(result);
});

app.get("/Logout", async (req, res) => {
  console.log("listen");
  res.clearCookie("pika", { path: "/" });
  res.send("Logout succesful");
});

app.listen(port, "localhost", () => {
  console.log("listen");
});
