const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 4000;
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const connectionString =
  "mongodb+srv://aregzalibekyan:613235RuzannaQ@cluster0.p1fxrej.mongodb.net/Tumo_products";
const db1 = mongoose.connection;
db1.on("error", console.error.bind(console, "Connection error:"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  mongoose.connect(connectionString, { useUnifiedTopology: true });
  db1.once("open", async () => {
    try {
      const obj = await mongoose.connection.db
        .collection("products")
        .find()
        .toArray();
      res.render("../public/form.ejs", {
        obj: obj,
      });
    } catch (e) {
    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
  });
});

app.post("/addInfo", (req, res) => {
  let [title, price, description, imgUrl, UUID] = [
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.imgUrl,
    req.body.UUID,
  ];
  mongoose.connect(connectionString, { useUnifiedTopology: true });
  db1.once("open", async () => {
    try {
      await mongoose.connection.db.collection("products").insertOne({
        title: title,
        price: price,
        description: description,
        imgUrl: imgUrl,
        UUID: UUID,
      });
      res.redirect("/");
    } catch (e) {
      throw new Error(`Something wrong: ${e}`);
    } finally {
      console.log("Connection closed");
      mongoose.connection.close();
    }
    // You can add additional code here for testing or other operations
    // Make sure to close the connection when you're done
  });



  // Check the connection
});
app.get("/update/:id", function (req, res) {
  var id = req.params.id;
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error:"));
  db.once("open", async () => {
    try {
      let result = await mongoose.connection.db
        .collection("products")
        .findOne({ _id: new ObjectId(id) });
      res.render("../public/update.ejs", { obj: result });
    } catch (error) {
      console.error("Error occured:", error);
    } finally {
      mongoose.connection.close();
    }
  });
});
app.get("/delete/:id", function (req, res) {
  var id = req.params.id;
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "Connection error:"));
  db.once("open", async () => {
    try {
      await mongoose.connection.db.collection('products').findOneAndDelete({_id: new ObjectId(id) });
      
    } catch (error) {
      console.error("Error occured:", error);
    } finally {
      mongoose.connection.close();
    }
  });
  res.redirect('/')
});
app.post("/updateData", async function (req, res) {
  try {
    const name = req.body.title;
    const price = req.body.price;
    const image = req.body.imgUrl;
    const des = req.body.description;
    const uuid = req.body.UUID;
    const id = req.body.id;
console.log("Received ID for update:", id);
    
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "Connection error:"));

    db.once("open", async () => {
      console.log("Connected to MongoDB!");

      try {
        let result = await mongoose.connection.db
          .collection("products")
          .updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                title: name,
                price: price,
                image: image,
                description: des,
                UUID: uuid,
              },
            }
          );
          res.redirect('/');

      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        mongoose.connection.close();
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`App is running on ${port} port`);
});
