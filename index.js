const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fiz9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log("database connected successfully");
    const database = client.db("bike_world");
    const exploreProductsCollection = database.collection("explore");
    const productsCollection = database.collection("products");
    const reviewCollection = database.collection("review");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
   

    // get products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    // get single product
    app.get("/singleProduct/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await productsCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
      console.log(result);
    });

    // get explore products
    app.get("/exploreProducts", async (req, res) => {
      const cursor = exploreProductsCollection.find({});
      const exploreProducts = await cursor.toArray();
      res.send(exploreProducts);
      console.log(exploreProducts);
    });

    // get explore single product
    app.get("/exploreSingleProduct/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await exploreProductsCollection
        .find({ _id: ObjectId(req.params.id) })
        .toArray();
      res.send(result[0]);
      console.log(result);
    });

    //add productsCollection
  app.post("/addProducts", async (req, res) => {
    console.log(req.body);
    const result = await exploreProductsCollection.insertOne(req.body);
    res.send(result);
  });

    // review
    app.post("/addSReview", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      res.send(result);
    });

    // insert order
    app.post("/addOrders", async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.send(result);
    });

    // my orders
    app.get("/myOrder/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // all order
  app.get("/allOrders", async (req, res) => {
    console.log("hello");
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });

  // status update
  app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    const result = await ordersCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });

    // From useFirebase to get special user information
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // From useFirebase to post user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // From useFirebase to Updating user data
    app.put("/users", async (req, res) => {
      const user = req.body;
      // console.log('put', user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

  } 
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Bike World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
