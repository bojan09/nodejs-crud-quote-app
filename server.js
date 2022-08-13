const express = require("express");
const bodyParser = require("body-parser");
const { query } = require("express");
const MongoClient = require("mongodb").MongoClient;
// initialize express
const app = express();

// Middlewares and other routes
// MongoDB
MongoClient.connect(
  "mongodb+srv://bojan-star-wars:0mohrlgRE0qKIsTi@cluster0.2luqhdr.mongodb.net/?retryWrites=true&w=majority",
  // remove the deprecation warning
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to MongoDatabase");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    // ========================
    // Middlewares
    // ========================
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    // ========================
    // Routes
    // ========================
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => res.render("index.ejs", { quotes: results }))
        .catch((err) => console.log(err));
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => res.redirect("/"))
        .catch((err) => console.log(err));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            // MongoDB’s update operators like $set , $inc and $push
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          // options tells MongoDB to define additional options for this request.
          // In this case, it’s possible that no Yoda quotes exist in the database. We can force MongoDB to create a new Darth Vadar quote if no Yoda quotes exist. We do this by setting upsert to true . upsert means: Insert a document if no documents can be updated.
          {
            upsert: true,
          }
        )
        .then((result) => res.json("Success"))

        .catch((error) => console.log(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => res.json(`Deleted Darth Vader's quote`))
        .catch((error) => console.log(error));
    });

    app.listen(/*....*/);
  })
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Listening to PORT 3000");
});
