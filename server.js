  const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://aregzalibekyan:613235Ruz.@cluster0.p1fxrej.mongodb.net/sample_mflix";
const db1 = mongoose.connection;
db1.on("error", console.error.bind(console, "Connection error:"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/form.html"));
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
          email:email,
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

// Replace the connection string with your MongoDB connection string

// Connect to MongoDB
mongoose.connect(connectionString, { useUnifiedTopology: true });

// Check the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", async () => {
  try {
    await mongoose.connection.db
      .collection("users")
      .deleteOne({ name: "Gexam" });
    console.log(
      await mongoose.connection.db.collection("users").findOne({
        name: "Gexam",
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
