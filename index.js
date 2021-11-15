const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

require('dotenv').config();
// app.use(bodyParser.urlenconded({ extended: true }));
const { MongoClient } = require('mongodb');
const objectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.25ryw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* async function run() {
    try {
        await client.connect();
        const database = client.db('bike_Service');
        const servicesCollection = database.collection('services');

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir); */

app.get('/', (req, res) => {
    res.send('Hello from my bike services')
});
client.connect(err => {
    //here is all service collection
    const servicesCollection = client.db("awesomeBike").collection("services");
    //here is all order collection
    const ordersCollection = client.db("awesomeBike").collection("orders");
    //here is review collection
    const reviewCollection = client.db("awesomeBike").collection("reviews");
    //here is all users collection
    const usersCollection = client.db("awesomeBike").collection("users");


    // here adding the services
    app.post("/addServices", async (req, res) => {
        console.log(req.body);
        const result = await servicesCollection.insertOne(req.body);
        res.send(result);
    });
    // here getting all the services from server
    app.get("/allServices", async (req, res) => {
        const result = await servicesCollection.find({}).toArray();
        res.send(result);
    });

    // Here is all single service

    app.get("/singleService/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await servicesCollection.find({ _id: objectId(req.params.id) }).toArray();
        res.send(result[0]);
        console.log(result);
    })

    //Here is my order
    app.get("/myOrder/:email", async (req, res) => {
        const result = await ordersCollection.find({ email: req.params.email }).toArray();
        res.send(result);
    });

    // Here is all the review
    app.post("/addReview", async (req, res) => {
        const result = await reviewCollection.insertOne(req.body);
        res.send(result);
    });
    app.get("/getReview", async (req, res) => {
        const result = await reviewCollection.find({}).toArray();
        res.send(result);
    })

    //adding user collection here
    app.post("/addUserInfo", async (req, res) => {
        console.log("req.body");
        const result = await usersCollection.insertOne(req.body);
        res.send(result);
        console.log(result);
    });

    // Here making Admin
    app.put("/makingAdmin", async (req, res) => {
        const filter = { email: req.body.email };
        const result = await usersCollection.find(filter).toArray();

        if (result) {
            const documents = await usersCollection.updateOne(filter, {
                $set: { role: "admin" },
            });
            console.log(documents);
        }
        else {
            // const role = "admin";
            // const newResult = await usersCollection.insertOne(req.body.email, {
            //     role: role,
            // });

        }
        // console.log(result);

    });

    //  Admin Checking

    app.get("/adminCheck/:email", async (req, res) => {
        const result = await usersCollection.find({ email: req.params.email }).toArray();
        console.log(result);
        res.send(result);
    });


    // here adding all the orders 
    app.post("/addOrders", async (req, res) => {
        const result = await ordersCollection.insertOne(req.body);
        res.send(result);
    });

    // Getting all orders here
    app.get("/allOrders", async (req, res) => {
        const result = await ordersCollection.find({}).toArray();
        res.send(result);
    });


});

app.listen(port, () => {
    console.log(` listening at ${port}`)
})


/*
app.get('/users');
        app.get('/users/:id');
        app.post('/users');
        app.put('/users/:id');
        app.delete('/users/:id')
        //users: get
        //users: post
*/