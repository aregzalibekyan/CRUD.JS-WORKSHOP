const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://aregzalibekyan:613235Ruz.@cluster0.p1fxrej.mongodb.net/tumo_products";
const db1 = mongoose.connection;
const { Schema } = mongoose;
db1.on("error", console.error.bind(console, "Connection error:"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
const SchemaProduct = new Schema({
  productName: String,
  price: Number,
  image: String,
});
mongoose.connect(connectionString, { useUnifiedTopology: true });
const Products = mongoose.model("Products", SchemaProduct);
db1.on("error", console.error.bind(console, "Connection error:"));
db1.once("open", async () => {
  console.log("Connected to MongoDB!");
  try {
    const accProgm = await Products.createCollection();
  } catch (error) {
    console.error("Error retrieving data:", error);
  } finally {
    mongoose.connection.close();
  }
});
app.get("/", function (req, res) {
  res.render("../public/form.ejs");
});

app.get("/list", (req, res) => {
  mongoose.connect(connectionString, { useUnifiedTopology: true });
  db1.once("open", async () => {
    try {
      const theaters = await mongoose.connection.db
        .collection("theaters")
        .find({
          "location.address.city": "Bloomington",
        })
        .toArray();
      res.render("../public/form.ejs", {
        theaters: theaters,
      });
    } catch (e) {
    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
  });
});
app.post("/addInfo", function (req, res) {
  let [surname, age, email] = [req.body.surname, req.body.age, req.body.email];
  mongoose.connect(connectionString, { useUnifiedTopology: true });
  db1.once("open", async () => {
    try {
      await mongoose.connection.db.collection("users").insertOne({
        name: surname,
        age: age,
        email: email,
      });
      console.log(
        await mongoose.connection.db.collection("users").findOne({
          email: email,
        })
      );
    } catch (e) {
      throw new Error(`Something wrong: ${e}`);
    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
    // You can add additional code here for testing or other operations
    // Make sure to close the connection when you're done
  });

  res.redirect("/");

  // Check the connection
});
app.listen(port, () => {
  console.log(`App is running on ${port} port`);
});
