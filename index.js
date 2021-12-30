const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
require('dotenv').config()
const port = process.env.PORT || "5000"

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sa6qa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
    try {
        await client.connect();

        const database = client.db('onlineStore-SCIC_1');
        const productsCollection = database.collection('products_collection');
        const cart = database.collection('cart')

        app.get("/explore", async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        app.get('/cart', async (req, res) => {
            const cursor = cart.find({});
            const result = await cursor.toArray()
            res.send(result);
        })
        app.post('/cart', async (req, res) => {
            const orderedProduct = req.body
            const result = await cart.insertOne(orderedProduct)
            res.send(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})