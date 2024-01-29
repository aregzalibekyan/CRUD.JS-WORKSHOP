const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://aregzalibekyan:613235Ruz.@cluster0.p1fxrej.mongodb.net/sample_mflix";
const db1 = mongoose.connection;
const {Schema} = mongoose;
db1.on("error", console.error.bind(console, "Connection error:"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.get("/", async function (req, res) {

  const connectionString =
    "mongodb+srv://aregzalibekyan:613235Ruz.@cluster0.p1fxrej.mongodb.net/Tumo_products";
  mongoose.connect(connectionString, { useUnifiedTopology: true });

  db1.once('open', async () => {
    try {
      const schema = new Schema({
        name: String,
        info: String,
        price: Number,
        img: String
      })
      const Product = mongoose.model('Product', schema);
      schema.path('_id');
      var a = new Product;
      a.name = 'aa'
      a.save()

    } catch (e) {

    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
  })


});

app.get("/list", (req, res) => {

  mongoose.connect(connectionString, { useUnifiedTopology: true });
  db1.once('open', async () => {
    try {
      const theaters = await mongoose.connection.db.collection("theaters").find({
        'location.address.city': 'Bloomington'
      }).toArray()
      res.render('../public/form.ejs', {
        theaters: theaters
      });

    } catch (e) {

    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
  })

})
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

