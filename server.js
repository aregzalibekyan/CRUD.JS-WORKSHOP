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
function something(arr, res) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '') {
      res.status(400).send('Something wrong! You should type all info about the product!');
      return false;
    }
  }

  if (isNaN(arr[1])) {
    res.status(400).send('Something wrong! The price should be a number!');
    return false;
  }

  return true;
}
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
    req.body.title.substring(0, 20),
    Number.parseInt(req.body.price, 10),
    req.body.description.substring(0, 50),
    req.body.imgUrl,
    req.body.UUID,
  ];
  let arr = [title, price, description, imgUrl, UUID]
  if (!something(arr, res)) {
    return;

  }
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
      await mongoose.connection.db.collection('products').findOneAndDelete({ _id: new ObjectId(id) });

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
    const [title, price, imgUrl, descr, uuid, id] = [
      req.body.title.substring(0, 20),
      Number.parseInt(req.body.price, 10),
      req.body.description.substring(0, 50),
      req.body.imgUrl,
      req.body.UUID,
      req.body.id
    ]
    let arr = [title, price, descr, imgUrl, uuid]
    if (!something(arr, res)) {
      return;

    }
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
        await mongoose.connection.db
          .collection("products")
          .updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                title: title,
                price: price,
                image: imgUrl,
                description: descr,
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
app.get('/*', (req, res) => {
  res.status(404).send("404:The requested page cannot be found.")
})
app.listen(port, () => {
  console.log(`App is running on ${port} port`);
});
