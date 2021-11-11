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
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('review');;

        //post addProduct api

        app.post('/addProduct', async (req, res) => {
            const product = req.body
            const result = await productsCollection.insertOne(product);
            res.json(result);
        })

        // get all products api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        //get api one Product by id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);

            res.send(result);

        })
        // get all user api 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })
        //post user api 
        app.post('/addUser', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        //post review api 
        app.post('/addReview', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        //get all review api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        //Order api 
        app.post('/addOrder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })
        //get order list for user api
        app.post('/myOrder', async (req, res) => {
            const email = req.body;
            // const query = {};
            const result = await orderCollection.find(email).toArray();
            res.send(result)
        })
        //get user list for user api
        app.post('/user', async (req, res) => {
            const email = req.body;
            // const query = {};
            const result = await usersCollection.findOne(email);
            res.json(result)
        })
        //get all user
        app.get('/allUsers', async (req, res) => {
            const result = await usersCollection.find({}).toArray();
            res.send(result)
        })

         //delete my order api
         app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            res.json(result)
        })
         //delete my Product api
         app.delete('/deleteProduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);

            res.json(result)
        })
        //get all order list api
        app.get('/allOrder', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result)
        })
        //update states api
        app.put('/updateStates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    states: `Shipped`
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc, options);
            // console.log(query);

            res.json(result);
        })
        //update admin states api
        app.put('/updateAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    admin: `yes`
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc, options);
            // console.log(query);

            res.json(result);
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
