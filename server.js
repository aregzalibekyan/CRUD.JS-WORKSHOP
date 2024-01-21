// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const path = require("path");
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.static("public"));

// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "./public/form.html"));
// });
// app.post("/addInfo", function (req, res) {
//   let [surname, age] = [req.body.surname, req.body.age];
//   console.log(surname, age);
//   res.redirect("/");
// });
// app.listen(port, () => {
//   console.log(`App is running on ${port} port`);
// });
const mongoose = require('mongoose');

// Replace the connection string with your MongoDB connection string
const connectionString = 'mongodb+srv://aregzalibekyan:613235Ruz.@cluster0.p1fxrej.mongodb.net/sample_mflix';


// Connect to MongoDB
mongoose.connect(connectionString, { useUnifiedTopology: true });

// Check the connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open',async () => {
    try {
        await mongoose.connection.db.collection('sessions').insertOne({
            _id: 1,
            user_id: 'tasfasf',
            jwt:'asdasd',
        })
    } catch (e) {
        throw new error('Something wrong')
    } finally {
        console.log('connection closed')
        mongoose.connection.close();
    }
// You can add additional code here for testing or other operations
// Make sure to close the connection when you're done

});