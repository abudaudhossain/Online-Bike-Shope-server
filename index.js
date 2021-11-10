const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("connection success")

        const database = client.db("online-bike-shop");
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users')

        //post offer api

        app.post('/addProduct', async (req, res) => {
            const product = req.body
            const result = await offersCollection.insertOne(product);
            res.json(result);
        })

        // get all offers api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        //get api one offer by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);

            res.send(result);

        })
        // get all offers api 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })
        //post user api 
        app.post('/addUser', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

         //Order api 
         app.post('/order', async (req, res) => {
            booking = req.body;

            const result = await bookingCollection.insertOne(booking);

            res.json(result)
        })
      

    } finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Online Bike shope");
})

app.listen(port, () => {
    console.log("Listening port: ", port);
})