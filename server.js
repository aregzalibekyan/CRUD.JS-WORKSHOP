const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
});
app.post("/addInfo", function (req, res) {
  let [surname, age] = [req.body.surname, req.body.age];
  console.log(surname, age);
  res.redirect("/");
});
app.listen(port, () => {
  console.log(`App is running on ${port} port`);
});
