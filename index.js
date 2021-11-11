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
    const database = client.db('bike_world');
    const productsCollection = database.collection('products');

    // get services
    app.get('/products', async(req, res) => {
        const cursor = productsCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    })
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
